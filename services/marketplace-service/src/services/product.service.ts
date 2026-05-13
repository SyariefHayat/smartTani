import { CreateProductInput, GetProductsInput } from '../schemas/product.schema';
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
}

export default new ProductService();
