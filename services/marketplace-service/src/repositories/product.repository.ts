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

  async update(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(id, data, { new: true });
  }

  async reduceStock(id: string, quantity: number): Promise<IProduct | null> {
    return Product.findOneAndUpdate(
      { _id: id, stock: { $gte: quantity }, status: 'active' },
      { $inc: { stock: -quantity } },
      { new: true }
    );
  }

  async restoreStock(id: string, quantity: number): Promise<IProduct | null> {
    return Product.findByIdAndUpdate(id, { $inc: { stock: quantity } }, { new: true });
  }

  async findAll(params: {
    category?: string;
    location_province?: string;
    location_city?: string;
    min_price?: number;
    max_price?: number;
    search?: string;
    page: number;
    limit: number;
    status?: string;
  }): Promise<{ products: IProduct[]; total: number }> {
    const {
      category,
      location_province,
      location_city,
      min_price,
      max_price,
      search,
      page,
      limit,
      status,
    } = params;

    const skip = (page - 1) * limit;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = { status: status || 'active' };

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (location_province) {
      query['location.province'] = location_province;
    }

    if (location_city) {
      query['location.city'] = location_city;
    }

    if (min_price !== undefined || max_price !== undefined) {
      query.price_per_unit = {};
      if (min_price !== undefined) query.price_per_unit.$gte = min_price;
      if (max_price !== undefined) query.price_per_unit.$lte = max_price;
    }

    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(query),
    ]);

    return { products, total };
  }
}

export default new ProductRepository();
