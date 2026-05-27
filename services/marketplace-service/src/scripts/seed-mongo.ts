import mongoose from 'mongoose';
import { Product } from '../models/product.model';
import { Review } from '../models/review.model';

const FARMER_ID = 'a5c30f9a-55fd-4639-a494-07f14b083818';
const MONGODB_URL =
  process.env.MONGODB_URL ||
  'mongodb://smarttani_user:smarttani_pass@localhost:27017/smarttani_marketplace?authSource=admin';

const PRODUCTS = [
  {
    _id: new mongoose.Types.ObjectId('60c72b2f9b1d8b2bad000001'),
    farmer_id: FARMER_ID,
    title: 'Beras Pandan Wangi Organik',
    description:
      'Beras Pandan Wangi Organik premium pilihan. Diproses alami tanpa bahan pengawet dan pestisida kimia. Memiliki aroma harum yang khas dan rasa pulen yang lezat.',
    category: 'Biji-bijian & Kacang',
    price_per_unit: 18000,
    unit: 'kg',
    stock: 500,
    min_stock: 20,
    min_order: 5,
    location: {
      province: 'Jawa Timur',
      city: 'Banyuwangi',
    },
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'active' as const,
    search_text: 'beras pandan wangi organik premium banyuwangi',
  },
  {
    _id: new mongoose.Types.ObjectId('60c72b2f9b1d8b2bad000002'),
    farmer_id: FARMER_ID,
    title: 'Tomat Segar Hidroponik',
    description:
      'Tomat merah segar hasil budidaya hidroponik modern. Kaya akan vitamin, tekstur padat dan berair. Sangat segar untuk konsumsi langsung maupun masakan.',
    category: 'Sayuran',
    price_per_unit: 12000,
    unit: 'kg',
    stock: 200,
    min_stock: 10,
    min_order: 1,
    location: {
      province: 'Jawa Timur',
      city: 'Banyuwangi',
    },
    images: [
      'https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'active' as const,
    search_text: 'tomat segar hidroponik merah vitamin sayur banyuwangi',
  },
  {
    _id: new mongoose.Types.ObjectId('60c72b2f9b1d8b2bad000003'),
    farmer_id: FARMER_ID,
    title: 'Cabai Rawit Merah Super',
    description:
      'Cabai rawit merah segar super pedas pilihan dari petani. Dipanen dalam kondisi matang sempurna sehingga kesegarannya terjaga sampai ke tangan Anda.',
    category: 'Rempah & Bumbu',
    price_per_unit: 45000,
    unit: 'kg',
    stock: 100,
    min_stock: 5,
    min_order: 1,
    location: {
      province: 'Jawa Timur',
      city: 'Banyuwangi',
    },
    images: [
      'https://images.unsplash.com/photo-1588252399745-b7987b39c6ae?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'active' as const,
    search_text: 'cabai rawit merah super pedas rempah bumbu banyuwangi',
  },
  {
    _id: new mongoose.Types.ObjectId('60c72b2f9b1d8b2bad000004'),
    farmer_id: FARMER_ID,
    title: 'Kentang Dieng Premium',
    description:
      'Kentang Dieng super premium dengan ukuran seragam dan mulus. Memiliki kandungan pati yang pas, sangat cocok untuk kentang goreng atau olahan lainnya.',
    category: 'Umbi-umbian',
    price_per_unit: 15000,
    unit: 'kg',
    stock: 300,
    min_stock: 15,
    min_order: 2,
    location: {
      province: 'Jawa Timur',
      city: 'Banyuwangi',
    },
    images: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'active' as const,
    search_text: 'kentang dieng premium umbi banyuwangi',
  },
  {
    _id: new mongoose.Types.ObjectId('60c72b2f9b1d8b2bad000005'),
    farmer_id: FARMER_ID,
    title: 'Wortel Organik Brastagi',
    description:
      'Wortel manis organik pilihan. Memiliki warna oranye cerah dan kaya akan beta-karoten. Sangat baik untuk jus kesehatan maupun hidangan harian.',
    category: 'Sayuran',
    price_per_unit: 10000,
    unit: 'kg',
    stock: 400,
    min_stock: 20,
    min_order: 1,
    location: {
      province: 'Jawa Timur',
      city: 'Banyuwangi',
    },
    images: [
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'active' as const,
    search_text: 'wortel organik manis sayur jus vitamin banyuwangi',
  },
  {
    _id: new mongoose.Types.ObjectId('60c72b2f9b1d8b2bad000006'),
    farmer_id: FARMER_ID,
    title: 'Bawang Merah Brebes Super',
    description:
      'Bawang merah Brebes kualitas super ekspor dari petani. Memiliki aroma yang sangat pekat, cocok untuk bumbu dapur dan bawang goreng renyah.',
    category: 'Rempah & Bumbu',
    price_per_unit: 25000,
    unit: 'kg',
    stock: 600,
    min_stock: 30,
    min_order: 1,
    location: {
      province: 'Jawa Timur',
      city: 'Banyuwangi',
    },
    images: [
      'https://images.unsplash.com/photo-1608797178974-15b35a61d121?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'active' as const,
    search_text: 'bawang merah brebes super rempah bumbu banyuwangi',
  },
  {
    _id: new mongoose.Types.ObjectId('60c72b2f9b1d8b2bad000007'),
    farmer_id: FARMER_ID,
    title: 'Jeruk Siam Madu Segar',
    description:
      'Jeruk Siam Madu segar manis khas Banyuwangi dengan air melimpah. Kaya akan vitamin C, dipetik langsung dari kebun petani binaan.',
    category: 'Buah-buahan',
    price_per_unit: 22000,
    unit: 'kg',
    stock: 250,
    min_stock: 10,
    min_order: 2,
    location: {
      province: 'Jawa Timur',
      city: 'Banyuwangi',
    },
    images: [
      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'active' as const,
    search_text: 'jeruk siam madu manis segar buah banyuwangi',
  },
  {
    _id: new mongoose.Types.ObjectId('60c72b2f9b1d8b2bad000008'),
    farmer_id: FARMER_ID,
    title: 'Tempe Organik Daun Pisang',
    description:
      'Tempe organik super non-GMO yang dibungkus tradisional menggunakan daun pisang alami untuk fermentasi rasa terbaik dan higienis.',
    category: 'Produk Olahan',
    price_per_unit: 5000,
    unit: 'papan',
    stock: 100,
    min_stock: 5,
    min_order: 2,
    location: {
      province: 'Jawa Timur',
      city: 'Banyuwangi',
    },
    images: [
      'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'active' as const,
    search_text: 'tempe organik daun pisang olahan protein banyuwangi',
  },
  {
    _id: new mongoose.Types.ObjectId('60c72b2f9b1d8b2bad000009'),
    farmer_id: FARMER_ID,
    title: 'Bayam Hijau Organik',
    description:
      'Bayam hijau segar organik pilihan. Daun lebar, renyah, dan dipanen pagi hari untuk menjaga kesegarannya.',
    category: 'Sayuran',
    price_per_unit: 7000,
    unit: 'ikat',
    stock: 150,
    min_stock: 10,
    min_order: 2,
    location: {
      province: 'Jawa Timur',
      city: 'Banyuwangi',
    },
    images: [
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'active' as const,
    search_text: 'bayam hijau organik sayuran sehat banyuwangi',
  },
  {
    _id: new mongoose.Types.ObjectId('60c72b2f9b1d8b2bad000010'),
    farmer_id: FARMER_ID,
    title: 'Bawang Putih Kating',
    description:
      'Bawang putih jenis Kating premium dengan aroma yang sangat kuat dan siung yang besar berisi.',
    category: 'Rempah & Bumbu',
    price_per_unit: 35000,
    unit: 'kg',
    stock: 200,
    min_stock: 10,
    min_order: 1,
    location: {
      province: 'Jawa Timur',
      city: 'Banyuwangi',
    },
    images: [
      'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'active' as const,
    search_text: 'bawang putih kating rempah bumbu dapur banyuwangi',
  },
  {
    _id: new mongoose.Types.ObjectId('60c72b2f9b1d8b2bad000011'),
    farmer_id: FARMER_ID,
    title: 'Kelapa Muda Hijau',
    description:
      'Kelapa muda hijau segar asli pilihan dengan air kelapa melimpah dan daging kelapa yang lembut manis.',
    category: 'Buah-buahan',
    price_per_unit: 15000,
    unit: 'butir',
    stock: 100,
    min_stock: 5,
    min_order: 2,
    location: {
      province: 'Jawa Timur',
      city: 'Banyuwangi',
    },
    images: [
      'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'active' as const,
    search_text: 'kelapa muda hijau kelapa segar buah banyuwangi',
  },
  {
    _id: new mongoose.Types.ObjectId('60c72b2f9b1d8b2bad000012'),
    farmer_id: FARMER_ID,
    title: 'Mangga Harum Manis',
    description:
      'Mangga Harum Manis super manis matang pohon asli dengan daging buah tebal, serat halus, dan aroma harum.',
    category: 'Buah-buahan',
    price_per_unit: 28000,
    unit: 'kg',
    stock: 150,
    min_stock: 10,
    min_order: 2,
    location: {
      province: 'Jawa Timur',
      city: 'Banyuwangi',
    },
    images: [
      'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'active' as const,
    search_text: 'mangga harum manis buah matang pohon segar banyuwangi',
  },
  {
    _id: new mongoose.Types.ObjectId('60c72b2f9b1d8b2bad000013'),
    farmer_id: FARMER_ID,
    title: 'Alpukat Mentega Jumbo',
    description:
      'Alpukat mentega berukuran jumbo dengan daging berwarna kuning tebal, tekstur legit pulen bebas ulat.',
    category: 'Buah-buahan',
    price_per_unit: 32000,
    unit: 'kg',
    stock: 180,
    min_stock: 8,
    min_order: 1,
    location: {
      province: 'Jawa Timur',
      city: 'Banyuwangi',
    },
    images: [
      'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'active' as const,
    search_text: 'alpukat mentega jumbo legit pulen buah sehat banyuwangi',
  },
  {
    _id: new mongoose.Types.ObjectId('60c72b2f9b1d8b2bad000014'),
    farmer_id: FARMER_ID,
    title: 'Pisang Raja Bulu',
    description:
      'Pisang raja bulu berkualitas tinggi, manis alami dan sangat cocok untuk konsumsi langsung maupun digoreng.',
    category: 'Buah-buahan',
    price_per_unit: 20000,
    unit: 'sisir',
    stock: 120,
    min_stock: 6,
    min_order: 1,
    location: {
      province: 'Jawa Timur',
      city: 'Banyuwangi',
    },
    images: [
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'active' as const,
    search_text: 'pisang raja bulu buah manis segar banyuwangi',
  },
  {
    _id: new mongoose.Types.ObjectId('60c72b2f9b1d8b2bad000015'),
    farmer_id: FARMER_ID,
    title: 'Kubis Bulat Segar',
    description:
      'Kubis/kol bulat segar bertekstur garing padat, sangat bersih dan segar untuk olahan sayur sup maupun lalapan.',
    category: 'Sayuran',
    price_per_unit: 8000,
    unit: 'kg',
    stock: 250,
    min_stock: 15,
    min_order: 1,
    location: {
      province: 'Jawa Timur',
      city: 'Banyuwangi',
    },
    images: [
      'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'active' as const,
    search_text: 'kubis kol bulat segar garing sayuran banyuwangi',
  },
  {
    _id: new mongoose.Types.ObjectId('60c72b2f9b1d8b2bad000016'),
    farmer_id: FARMER_ID,
    title: 'Nanas Madu Subang',
    description:
      'Nanas madu asli Subang yang terkenal sangat manis, juicy tanpa rasa gatal di lidah saat disantap.',
    category: 'Buah-buahan',
    price_per_unit: 12000,
    unit: 'butir',
    stock: 160,
    min_stock: 10,
    min_order: 1,
    location: {
      province: 'Jawa Timur',
      city: 'Banyuwangi',
    },
    images: [
      'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&auto=format&fit=crop&q=80',
    ],
    status: 'active' as const,
    search_text: 'nanas madu subang manis segar buah juicy banyuwangi',
  },
];

const REVIEWS = [
  {
    product_id: '60c72b2f9b1d8b2bad000001',
    order_id: 'order-rev-101',
    buyer_id: 'buyer-01',
    buyer_name: 'Budi Santoso',
    rating: 5,
    comment:
      'Berasnya wangi sekali pas dimasak, pulen dan rasanya enak banget. Keluarga suka sekali, pasti beli lagi di sini!',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    product_id: '60c72b2f9b1d8b2bad000001',
    order_id: 'order-rev-102',
    buyer_id: 'buyer-02',
    buyer_name: 'Siti Aminah',
    rating: 5,
    comment:
      'Kualitas beras pandan wangi di toko ini sangat terjamin, bersih dari kerikil dan kotoran. Pelayanan seller cepat dan ramah.',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    product_id: '60c72b2f9b1d8b2bad000002',
    order_id: 'order-rev-103',
    buyer_id: 'buyer-03',
    buyer_name: 'Andi Wijaya',
    rating: 4,
    comment:
      'Tomatnya merah merona dan sangat segar. Pengiriman juga cepat sehingga tomatnya tidak bonyok di jalan.',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    product_id: '60c72b2f9b1d8b2bad000003',
    order_id: 'order-rev-104',
    buyer_id: 'buyer-04',
    buyer_name: 'Rina Herawati',
    rating: 5,
    comment:
      'Cabainya luar biasa pedas dan segar-segar. Cocok sekali untuk jualan sambal saya. Terpercaya banget tokonya.',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    product_id: '60c72b2f9b1d8b2bad000004',
    order_id: 'order-rev-105',
    buyer_id: 'buyer-05',
    buyer_name: 'Dewi Lestari',
    rating: 4,
    comment:
      'Kentangnya mulus-mulus, ukurannya besar dan pas untuk digoreng. Seller sangat responsif, terima kasih!',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
];

async function main() {
  console.log('🌱 Seeding MongoDB dummy data with 16 premium products...');

  try {
    await mongoose.connect(MONGODB_URL);
    console.log('✅ Connected to MongoDB');

    // 1. Delete existing products for this farmer
    await Product.deleteMany({ farmer_id: FARMER_ID });
    console.log('🗑️ Deleted existing MongoDB products');

    // 2. Insert new premium products
    const seededProducts = await Product.create(PRODUCTS);
    console.log(`✅ Seeded ${seededProducts.length} premium products in MongoDB`);

    // 3. Delete existing reviews for these products
    const productIds = PRODUCTS.map((p) => p._id.toString());
    await Review.deleteMany({ product_id: { $in: productIds } });
    console.log('🗑️ Deleted existing MongoDB reviews');

    // 4. Insert new reviews
    const seededReviews = await Review.create(REVIEWS);
    console.log(`✅ Seeded ${seededReviews.length} realistic customer reviews in MongoDB`);
  } catch (err) {
    console.error('❌ MongoDB Seeding failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

main();
