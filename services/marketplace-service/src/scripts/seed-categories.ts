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
        console.log(`🌱 Seeded category: ${name}`);
      }
    }
    console.log('✅ Category seeding completed');
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  }
};
