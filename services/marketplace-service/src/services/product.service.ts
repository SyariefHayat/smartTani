import sharp from 'sharp';
import path from 'path';
import {
  CreateProductInput,
  GetProductsInput,
  UpdateProductInput,
} from '../schemas/product.schema';
import productRepository from '../repositories/product.repository';
import authServiceClient from '../lib/auth-client';
import S3Manager from '../lib/s3';
import { AppError } from '../../../../shared/types/express';

export class ProductService {
  async createProduct(farmerId: string, input: CreateProductInput) {
    // Generate search_text
    const searchText = `${input.title} ${input.description} ${input.category} ${input.location.city} ${input.location.province}`;

    const productData = {
      ...input,
      farmer_id: farmerId,
      search_text: searchText,
      status: 'active' as const,
    };

    return productRepository.create(productData);
  }

  async getProducts(params: GetProductsInput) {
    const { products, total } = await productRepository.findAll(params);

    return {
      products,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / (params.limit || 20)),
      },
    };
  }

  async getProductById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) {
      const error = new Error('Produk tidak ditemukan') as AppError;
      error.statusCode = 404;
      error.code = 'MARKET_001';
      throw error;
    }

    // Fetch farmer info
    const farmer = await authServiceClient.getUserInfo(product.farmer_id);

    return {
      ...product.toObject(),
      farmer: farmer || { id: product.farmer_id, full_name: 'Unknown Farmer' },
    };
  }

  async updateProduct(userId: string, role: string, productId: string, input: UpdateProductInput) {
    const product = await productRepository.findById(productId);
    if (!product) {
      const error = new Error('Produk tidak ditemukan') as AppError;
      error.statusCode = 404;
      error.code = 'MARKET_001';
      throw error;
    }

    // Ownership validation (except admin)
    if (role !== 'admin' && product.farmer_id !== userId) {
      const error = new Error('Anda tidak memiliki akses untuk mengubah produk ini') as AppError;
      error.statusCode = 403;
      error.code = 'AUTH_011';
      throw error;
    }

    const updateData: Record<string, unknown> = { ...input };

    // Regenerate search_text if relevant fields are updated
    if (input.title || input.description || input.category || input.location) {
      const title = input.title || product.title;
      const description = input.description || product.description;
      const category = input.category || product.category;
      const city = input.location?.city || product.location?.city || '';
      const province = input.location?.province || product.location?.province || '';

      updateData.search_text = `${title} ${description} ${category} ${city} ${province}`;
    }

    const updatedProduct = await productRepository.update(productId, updateData);
    if (!updatedProduct) {
      const error = new Error('Gagal memperbarui produk') as AppError;
      error.statusCode = 500;
      throw error;
    }

    return updatedProduct;
  }

  async deactivateProduct(userId: string, role: string, productId: string) {
    const product = await productRepository.findById(productId);
    if (!product) {
      const error = new Error('Produk tidak ditemukan') as AppError;
      error.statusCode = 404;
      error.code = 'MARKET_001';
      throw error;
    }

    // Ownership validation (except admin)
    if (role !== 'admin' && product.farmer_id !== userId) {
      const error = new Error('Anda tidak memiliki akses untuk menghapus produk ini') as AppError;
      error.statusCode = 403;
      error.code = 'AUTH_011';
      throw error;
    }

    const updatedProduct = await productRepository.update(productId, { status: 'inactive' });
    if (!updatedProduct) {
      const error = new Error('Gagal menonaktifkan produk') as AppError;
      error.statusCode = 500;
      throw error;
    }

    return { message: 'Produk berhasil dinonaktifkan' };
  }

  async reduceStock(items: { productId: string; quantity: number }[]) {
    const reducedItems: { productId: string; quantity: number }[] = [];

    for (const item of items) {
      const updated = await productRepository.reduceStock(item.productId, item.quantity);
      if (!updated) {
        // Rollback previously reduced items
        for (const reduced of reducedItems) {
          await productRepository.update(reduced.productId, {
            $inc: { stock: reduced.quantity },
          } as Record<string, unknown>);
        }
        const error = new Error(`Stok tidak mencukupi untuk produk ${item.productId}`) as AppError;
        error.statusCode = 409;
        error.code = 'MARKET_008';
        throw error;
      }
      reducedItems.push(item);
    }
    return { success: true };
  }

  async uploadProductImage(
    userId: string,
    role: string,
    productId: string,
    file: Express.Multer.File
  ) {
    const product = await productRepository.findById(productId);
    if (!product) {
      const error = new Error('Produk tidak ditemukan') as AppError;
      error.statusCode = 404;
      error.code = 'MARKET_001';
      throw error;
    }

    // Ownership validation (except admin)
    if (role !== 'admin' && product.farmer_id !== userId) {
      const error = new Error('Anda tidak memiliki akses untuk mengubah produk ini') as AppError;
      error.statusCode = 403;
      error.code = 'AUTH_011';
      throw error;
    }

    // Max 5 images per product
    if (product.images.length >= 5) {
      const error = new Error('Maksimal 5 foto per produk.') as AppError;
      error.statusCode = 400;
      error.code = 'MARKET_004';
      throw error;
    }

    // Image processing with Sharp: resize to max 1200x1200px, convert to WebP, compress quality 80
    const processedImage = await sharp(file.buffer)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();

    // Upload to S3: products/{product_id}/{timestamp}-{filename}.webp
    const timestamp = Date.now();
    const fileName = path.parse(file.originalname).name;
    const s3Key = `products/${productId}/${timestamp}-${fileName}.webp`;

    const imageUrl = await S3Manager.uploadFile(processedImage, s3Key, 'image/webp');

    // Update array images di MongoDB (push URL baru)
    await productRepository.update(productId, {
      $push: { images: imageUrl },
    } as Record<string, unknown>);

    return { imageUrl };
  }
}

export default new ProductService();
