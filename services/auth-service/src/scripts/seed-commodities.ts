import { logger } from '../../../../shared/utils/logger';
import prisma from '../lib/prisma';

const COMMODITIES = [
  'Padi',
  'Jagung',
  'Kedelai',
  'Bawang Merah',
  'Bawang Putih',
  'Cabai Merah',
  'Cabai Rawit',
  'Kentang',
  'Tomat',
  'Kubis',
  'Kelapa Sawit',
  'Kopi',
  'Kakao',
  'Karet',
  'Tebu',
  'Teh',
  'Cengkeh',
  'Lada',
  'Singkong',
  'Ubi Jalar',
  'Melon',
  'Semangka',
  'Mangga',
  'Durian',
  'Jeruk',
  'Apel',
  'Nanas',
  'Pisang',
  'Pepaya',
  'Kelapa',
  'Kacang Tanah',
  'Kacang Hijau',
  'Jahe',
  'Kunyit',
  'Temulawak',
  'Lainnya',
];

export const seedCommodities = async () => {
  try {
    for (const name of COMMODITIES) {
      const slug = name
        .toLowerCase()
        .replace(/ & /g, '-')
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');

      // Idempotent check
      const existing = await prisma.commodity.findUnique({
        where: { slug },
      });

      if (!existing) {
        await prisma.commodity.create({
          data: {
            name,
            slug,
            description: `Komoditas pertanian ${name}`,
          },
        });
        logger.info(`🌱 Seeded commodity: ${name}`);
      }
    }
    logger.info('✅ Commodity seeding completed');
  } catch (error) {
    logger.error('❌ Error seeding commodities:', error);
  }
};
