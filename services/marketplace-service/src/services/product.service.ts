import { CreateProductInput } from '../schemas/product.schema';
import productRepository from '../repositories/product.repository';

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
}

export default new ProductService();
