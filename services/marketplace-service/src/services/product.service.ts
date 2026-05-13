import {
  CreateProductInput,
  GetProductsInput,
  UpdateProductInput,
} from '../schemas/product.schema';
import productRepository from '../repositories/product.repository';
import authServiceClient from '../lib/auth-client';
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
}

export default new ProductService();
