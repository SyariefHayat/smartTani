import productRepository from './product.repository';
import { Product } from '../models/product.model';

jest.mock('../models/product.model');

describe('ProductRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should find all with all filters combined', async () => {
    const products = [{ id: '1', title: 'Test' }];
    const count = 1;

    const findMock = {
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue(products),
    };

    (Product.find as jest.Mock).mockReturnValue(findMock);
    (Product.countDocuments as jest.Mock).mockResolvedValue(count);

    const result = await productRepository.findAll({
      category: 'Fruits',
      location_province: 'Province',
      location_city: 'City',
      min_price: 10,
      max_price: 100,
      search: 'Keyword',
      page: 1,
      limit: 10,
    });

    expect(Product.find).toHaveBeenCalledWith({
      status: 'active',
      $text: { $search: 'Keyword' },
      category: 'Fruits',
      'location.province': 'Province',
      'location.city': 'City',
      price_per_unit: { $gte: 10, $lte: 100 },
    });
    expect(result.products).toEqual(products);
    expect(result.total).toBe(count);
  });

  it('should find by farmer id', async () => {
    (Product.find as jest.Mock).mockResolvedValue([]);
    await productRepository.findByFarmerId('f1');
    expect(Product.find).toHaveBeenCalledWith({ farmer_id: 'f1' });
  });

  it('should update product', async () => {
    (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue({});
    await productRepository.update('1', { title: 'New' });
    expect(Product.findByIdAndUpdate).toHaveBeenCalledWith('1', { title: 'New' }, { new: true });
  });
});
