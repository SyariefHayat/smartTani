import { logger } from '../../../../shared/utils/logger';
import Brand from '../models/brand.model';

const BRANDS = [
  'Petrokimia Gresik',
  'Pupuk Kaltim',
  'Syngenta',
  'Bayer Indonesia',
  'Pioneer (Corteva)',
  'BASF Indonesia',
  'Bintang Tani',
  'East West Seed (Cap Panah Merah)',
  'Bejo Zaden',
  'Rijk Zwaan',
  'FMC Corporation',
  'DOW AgroSciences',
];

export const seedBrands = async () => {
  try {
    for (const name of BRANDS) {
      const slug = name
        .toLowerCase()
        .replace(/ & /g, '-')
        .replace(/ \(/g, '-')
        .replace(/\)/g, '')
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');

      // Idempotent check
      const existing = await Brand.findOne({ slug });
      if (!existing) {
        await Brand.create({ name, slug });
        logger.info(`🌱 Seeded brand: ${name}`);
      }
    }
    logger.info('✅ Brand seeding completed');
  } catch (error) {
    logger.error('❌ Error seeding brands:', error);
  }
};
