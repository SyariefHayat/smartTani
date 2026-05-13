import { Product, IProduct } from '../models/product.model';

export class ProductRepository {
  async create(data: Partial<IProduct>): Promise<IProduct> {
    return Product.create(data);
  }

  async findById(id: string): Promise<IProduct | null> {
    return Product.findById(id);
  }

  async findByFarmerId(farmerId: string): Promise<IProduct[]> {
    return Product.find({ farmer_id: farmerId });
  }
}

export default new ProductRepository();
