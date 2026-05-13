import productService from './product.service';
import productRepository from '../repositories/product.repository';
import authServiceClient from '../lib/auth-client';
import S3Manager from '../lib/s3';
import sharp from 'sharp';

jest.mock('../repositories/product.repository');
jest.mock('../lib/auth-client');
jest.mock('../lib/s3');
jest.mock('sharp');

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
        location: { city: 'Bandung', province: 'Jawa Barat' },
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

  describe('updateProduct', () => {
    const updateInput = { title: 'Updated' };

    it('should update successfully as owner', async () => {
      const mockProduct = {
        _id: '1',
        farmer_id: 'f1',
        title: 'Old',
        location: { city: 'C', province: 'P' },
      };
      (productRepository.findById as jest.Mock).mockResolvedValue(mockProduct);
      (productRepository.update as jest.Mock).mockResolvedValue({ ...mockProduct, ...updateInput });

      const result = await productService.updateProduct('f1', 'petani', '1', updateInput);

      expect(productRepository.update).toHaveBeenCalled();
      expect(result.title).toBe('Updated');
    });

    it('should throw 403 if not owner', async () => {
      const mockProduct = { _id: '1', farmer_id: 'f1' };
      (productRepository.findById as jest.Mock).mockResolvedValue(mockProduct);

      await expect(productService.updateProduct('f2', 'petani', '1', updateInput)).rejects.toThrow(
        'Anda tidak memiliki akses untuk mengubah produk ini'
      );
    });

    it('should throw 500 if update fails', async () => {
      const mockProduct = {
        _id: '1',
        farmer_id: 'f1',
        location: { city: 'C', province: 'P' },
      };
      (productRepository.findById as jest.Mock).mockResolvedValue(mockProduct);
      (productRepository.update as jest.Mock).mockResolvedValue(null);

      await expect(productService.updateProduct('f1', 'petani', '1', updateInput)).rejects.toThrow(
        'Gagal memperbarui produk'
      );
    });
  });

  describe('deactivateProduct', () => {
    it('should deactivate successfully as owner', async () => {
      const mockProduct = { _id: '1', farmer_id: 'f1' };
      (productRepository.findById as jest.Mock).mockResolvedValue(mockProduct);
      (productRepository.update as jest.Mock).mockResolvedValue({
        ...mockProduct,
        status: 'inactive',
      });

      const result = await productService.deactivateProduct('f1', 'petani', '1');

      expect(productRepository.update).toHaveBeenCalledWith('1', { status: 'inactive' });
      expect(result.message).toBe('Produk berhasil dinonaktifkan');
    });

    it('should throw 404 if product not found', async () => {
      (productRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(productService.deactivateProduct('f1', 'petani', 'invalid')).rejects.toThrow(
        'Produk tidak ditemukan'
      );
    });

    it('should throw 500 if update fails', async () => {
      const mockProduct = { _id: '1', farmer_id: 'f1' };
      (productRepository.findById as jest.Mock).mockResolvedValue(mockProduct);
      (productRepository.update as jest.Mock).mockResolvedValue(null);

      await expect(productService.deactivateProduct('f1', 'petani', '1')).rejects.toThrow(
        'Gagal menonaktifkan produk'
      );
    });
  });

  describe('uploadProductImage', () => {
    const mockFile = {
      buffer: Buffer.from('fake-image'),
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
    } as Express.Multer.File;

    it('should upload image successfully', async () => {
      const mockProduct = { _id: '1', farmer_id: 'f1', images: [] };
      (productRepository.findById as jest.Mock).mockResolvedValue(mockProduct);
      (S3Manager.uploadFile as jest.Mock).mockResolvedValue('http://s3/image.webp');

      const mockSharpChain = {
        resize: jest.fn().mockReturnThis(),
        webp: jest.fn().mockReturnThis(),
        toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed-image')),
      };
      (sharp as unknown as jest.Mock).mockReturnValue(mockSharpChain);

      const result = await productService.uploadProductImage('f1', 'petani', '1', mockFile);

      expect(S3Manager.uploadFile).toHaveBeenCalled();
      expect(productRepository.update).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          $push: { images: 'http://s3/image.webp' },
        })
      );
      expect(result.imageUrl).toBe('http://s3/image.webp');
    });

    it('should throw 400 if product already has 5 images', async () => {
      const mockProduct = { _id: '1', farmer_id: 'f1', images: ['1', '2', '3', '4', '5'] };
      (productRepository.findById as jest.Mock).mockResolvedValue(mockProduct);

      await expect(
        productService.uploadProductImage('f1', 'petani', '1', mockFile)
      ).rejects.toThrow('Maksimal 5 foto per produk.');
    });

    it('should throw 404 if product not found', async () => {
      (productRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        productService.uploadProductImage('f1', 'petani', 'invalid', mockFile)
      ).rejects.toThrow('Produk tidak ditemukan');
    });
  });
});
