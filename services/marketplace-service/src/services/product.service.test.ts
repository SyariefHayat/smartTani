import productService from './product.service';
import productRepository from '../repositories/product.repository';
import authServiceClient from '../lib/auth-client';

jest.mock('../repositories/product.repository');
jest.mock('../lib/auth-client');

describe('ProductService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a product with generated search_text', async () => {
    const mockInput = {
      title: 'Tomat Merah Segar',
      description: 'Tomat organic pilihan yang dipetik langsung dari kebun.',
      category: 'Sayuran',
      price_per_unit: 15000,
      unit: 'kg',
      stock: 100,
      min_order: 1,
      location: {
        province: 'Jawa Barat',
        city: 'Bandung',
      },
      images: [],
    };

    (productRepository.create as jest.Mock).mockResolvedValue({
      _id: 'prod-123',
      ...mockInput,
      search_text:
        'Tomat Merah Segar Tomat organic pilihan yang dipetik langsung dari kebun. Sayuran Bandung Jawa Barat',
      status: 'active',
    });

    const result = await productService.createProduct('farmer-123', mockInput);

    expect(productRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        farmer_id: 'farmer-123',
        search_text: expect.stringContaining('Tomat Merah Segar'),
      })
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((result as any)._id).toBe('prod-123');
  });

  it('should return paginated products', async () => {
    const mockResult = {
      products: [{ id: '1', title: 'Product 1' }],
      total: 1,
    };
    (productRepository.findAll as jest.Mock).mockResolvedValue(mockResult);

    const result = await productService.getProducts({
      page: 1,
      limit: 10,
      min_price: undefined,
      max_price: undefined,
    });

    expect(productRepository.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    expect(result.products).toEqual(mockResult.products);
    expect(result.meta.total).toBe(1);
    expect(result.meta.totalPages).toBe(1);
  });

  describe('getProductById', () => {
    it('should return product with farmer info', async () => {
      const mockProduct = {
        _id: 'prod-123',
        farmer_id: 'farmer-123',
        title: 'Product 1',
        toObject: jest
          .fn()
          .mockReturnValue({ _id: 'prod-123', farmer_id: 'farmer-123', title: 'Product 1' }),
      };
      const mockFarmer = { id: 'farmer-123', full_name: 'Farmer John' };

      (productRepository.findById as jest.Mock).mockResolvedValue(mockProduct);
      (authServiceClient.getUserInfo as jest.Mock).mockResolvedValue(mockFarmer);

      const result = await productService.getProductById('prod-123');

      expect(productRepository.findById).toHaveBeenCalledWith('prod-123');
      expect(authServiceClient.getUserInfo).toHaveBeenCalledWith('farmer-123');
      expect(result.farmer).toEqual(mockFarmer);
    });

    it('should throw 404 if product not found', async () => {
      (productRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(productService.getProductById('invalid')).rejects.toThrow(
        'Produk tidak ditemukan'
      );
    });
  });
});
