import { logger } from '../../../../shared/utils/logger';
import Category from '../models/category.model';

const CATEGORIES = [
  'Sayuran',
  'Buah-buahan',
  'Umbi-umbian',
  'Rempah & Bumbu',
  'Biji-bijian & Kacang',
  'Tanaman Obat',
  'Hasil Ternak',
  'Produk Olahan',
  'Lainnya',
];

export const seedCategories = async () => {
  try {
    for (const name of CATEGORIES) {
      const slug = name
        .toLowerCase()
        .replace(/ & /g, '-')
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');

      // Idempotent check
      const existing = await Category.findOne({ slug });
      if (!existing) {
        await Category.create({ name, slug });
        logger.info(`🌱 Seeded category: ${name}`);
      }
    }
    logger.info('✅ Category seeding completed');
  } catch (error) {
    logger.error('❌ Error seeding categories:', error);
  }
};
