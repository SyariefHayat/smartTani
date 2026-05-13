import authServiceClient from './auth-client';
import axios from 'axios';

jest.mock('axios');

describe('AuthServiceClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return user info if success', async () => {
    const mockData = { success: true, data: { id: '1', full_name: 'John' } };
    (axios.get as jest.Mock).mockResolvedValue({ data: mockData });

    const result = await authServiceClient.getUserInfo('1');

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/auth/users/1'));
    expect(result).toEqual(mockData.data);
  });

  it('should return null if axios fails', async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

    const errorSpy = jest.spyOn(console, 'error').mockImplementation();

    const result = await authServiceClient.getUserInfo('1');

    expect(result).toBeNull();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('should return null if success is false', async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { success: false } });

    const result = await authServiceClient.getUserInfo('1');

    expect(result).toBeNull();
  });
});
