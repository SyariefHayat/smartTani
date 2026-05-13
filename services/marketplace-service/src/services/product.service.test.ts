import productService from './product.service';
import productRepository from '../repositories/product.repository';

jest.mock('../repositories/product.repository');

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
});
