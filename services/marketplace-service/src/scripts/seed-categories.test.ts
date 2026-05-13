import { seedCategories } from './seed-categories';
import Category from '../models/category.model';

jest.mock('../models/category.model');

describe('seedCategories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should seed categories if they do not exist', async () => {
    (Category.findOne as jest.Mock).mockResolvedValue(null);
    (Category.create as jest.Mock).mockResolvedValue({});

    // Capture console.log
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await seedCategories();

    // Should call findOne for each category (9)
    expect(Category.findOne).toHaveBeenCalledTimes(9);
    // Should call create for each category (9)
    expect(Category.create).toHaveBeenCalledTimes(9);
    expect(logSpy).toHaveBeenCalledWith('✅ Category seeding completed');

    logSpy.mockRestore();
  });

  it('should not seed categories if they already exist', async () => {
    (Category.findOne as jest.Mock).mockResolvedValue({ name: 'Exist' });
    (Category.create as jest.Mock).mockResolvedValue({});

    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    await seedCategories();

    expect(Category.findOne).toHaveBeenCalledTimes(9);
    expect(Category.create).not.toHaveBeenCalled();

    logSpy.mockRestore();
  });

  it('should handle errors during seeding', async () => {
    (Category.findOne as jest.Mock).mockRejectedValue(new Error('DB Error'));
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();

    await seedCategories();

    expect(errorSpy).toHaveBeenCalledWith('❌ Error seeding categories:', expect.any(Error));

    errorSpy.mockRestore();
  });
});
