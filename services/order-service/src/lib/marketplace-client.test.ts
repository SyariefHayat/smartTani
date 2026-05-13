import marketplaceClient from './marketplace-client';
import axios from 'axios';

jest.mock('axios');

describe('MarketplaceServiceClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return product info if success', async () => {
    const mockData = { success: true, data: { id: 'p1', title: 'Prod' } };
    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await marketplaceClient.getProductInfo('p1');

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/products/p1'));
    expect(result).toEqual(mockData.data);
  });

  it('should return true if reduceStock success', async () => {
    (axios.patch as jest.Mock).mockResolvedValue({ data: { success: true } });

    const result = await marketplaceClient.reduceStock([{ productId: 'p1', quantity: 1 }]);

    expect(axios.patch).toHaveBeenCalledWith(
      expect.stringContaining('/products/reduce-stock'),
      expect.any(Object)
    );
    expect(result).toBe(true);
  });

  it('should return false if reduceStock fails', async () => {
    (axios.patch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const errorSpy = jest.spyOn(console, 'error').mockImplementation();

    const result = await marketplaceClient.reduceStock([{ productId: 'p1', quantity: 1 }]);

    expect(result).toBe(false);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
