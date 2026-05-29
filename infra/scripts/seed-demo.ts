/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-empty */
import axios from 'axios';
import crypto from 'crypto';

const GATEWAY_URL = 'http://localhost:3000';

const USERS = {
  admin: {
    email: 'admin@smarttani.id',
    password: 'password123',
    role: 'admin',
    full_name: 'Super Admin',
  },
  petanis: [
    {
      email: 'budi@smarttani.id',
      password: 'password123',
      role: 'petani',
      full_name: 'Budi Santoso',
      location: { province: 'Jawa Timur', city: 'Banyuwangi' },
    },
    {
      email: 'siti@smarttani.id',
      password: 'password123',
      role: 'petani',
      full_name: 'Siti Aminah',
      location: { province: 'Jawa Barat', city: 'Garut' },
    },
    {
      email: 'agus@smarttani.id',
      password: 'password123',
      role: 'petani',
      full_name: 'Agus Salim',
      location: { province: 'Jawa Tengah', city: 'Boyolali' },
    },
  ],
  buyers: [
    {
      email: 'buyer1@gmail.com',
      password: 'password123',
      role: 'buyer',
      full_name: 'Andi Buyer',
    },
    {
      email: 'buyer2@gmail.com',
      password: 'password123',
      role: 'buyer',
      full_name: 'Rina Buyer',
    },
  ],
  investor: {
    email: 'investor@smarttani.id',
    password: 'password123',
    role: 'investor',
    full_name: 'Iwan Investor',
  },
  logistics: {
    email: 'logistik@smarttani.id',
    password: 'password123',
    role: 'logistik',
    full_name: 'Logistik Kilat',
  },
};

const PRODUCTS = [
  {
    farmerIdx: 0,
    title: 'Beras Pandan Wangi Organik',
    description: 'Beras organik tanpa pestisida, dipanen dari lereng gunung.',
    category: 'Biji-bijian & Kacang',
    price_per_unit: 18000,
    unit: 'kg',
    stock: 500,
    min_order: 5,
    images: ['https://placehold.co/600x400?text=Beras+Pandan+Wangi'],
  },
  {
    farmerIdx: 0,
    title: 'Tomat Merah Segar',
    description: 'Tomat merah segar dipanen setiap pagi.',
    category: 'Sayuran',
    price_per_unit: 12000,
    unit: 'kg',
    stock: 200,
    min_order: 1,
    images: ['https://placehold.co/600x400?text=Tomat+Segar'],
  },
  {
    farmerIdx: 1,
    title: 'Cabai Rawit Merah',
    description: 'Cabai rawit super pedas hasil petani Garut.',
    category: 'Rempah & Bumbu',
    price_per_unit: 45000,
    unit: 'kg',
    stock: 100,
    min_order: 1,
    images: ['https://placehold.co/600x400?text=Cabai+Rawit'],
  },
  {
    farmerIdx: 1,
    title: 'Kentang Dieng',
    description: 'Kentang kualitas super, cocok untuk bahan olahan.',
    category: 'Umbi-umbian',
    price_per_unit: 15000,
    unit: 'kg',
    stock: 300,
    min_order: 2,
    images: ['https://placehold.co/600x400?text=Kentang+Dieng'],
  },
  {
    farmerIdx: 2,
    title: 'Susu Sapi Segar Boyolali',
    description: 'Susu murni tanpa campuran, langsung dari peternakan.',
    category: 'Hasil Ternak',
    price_per_unit: 10000,
    unit: 'liter',
    stock: 50,
    min_order: 1,
    images: ['https://placehold.co/600x400?text=Susu+Boyolali'],
  },
  {
    farmerIdx: 2,
    title: 'Telur Ayam Kampung',
    description: 'Telur ayam kampung asli, kaya protein.',
    category: 'Hasil Ternak',
    price_per_unit: 3000,
    unit: 'butir',
    stock: 1000,
    min_order: 10,
    images: ['https://placehold.co/600x400?text=Telur+Ayam+Kampung'],
  },
  {
    farmerIdx: 0,
    title: 'Wortel Brastagi',
    description: 'Wortel segar kaya vitamin A.',
    category: 'Sayuran',
    price_per_unit: 8000,
    unit: 'kg',
    stock: 400,
    min_order: 1,
    images: ['https://placehold.co/600x400?text=Wortel'],
  },
  {
    farmerIdx: 1,
    title: 'Jahe Merah',
    description: 'Jahe merah untuk kesehatan dan bumbu dapur.',
    category: 'Tanaman Obat',
    price_per_unit: 35000,
    unit: 'kg',
    stock: 150,
    min_order: 1,
    images: ['https://placehold.co/600x400?text=Jahe+Merah'],
  },
  {
    farmerIdx: 2,
    title: 'Bawang Merah Brebes',
    description: 'Bawang merah kualitas ekspor dari Brebes.',
    category: 'Rempah & Bumbu',
    price_per_unit: 25000,
    unit: 'kg',
    stock: 600,
    min_order: 1,
    images: ['https://placehold.co/600x400?text=Bawang+Merah'],
  },
  {
    farmerIdx: 0,
    title: 'Jeruk Medan Manis',
    description: 'Jeruk manis kupas mudah, air melimpah.',
    category: 'Buah-buahan',
    price_per_unit: 22000,
    unit: 'kg',
    stock: 250,
    min_order: 2,
    images: ['https://placehold.co/600x400?text=Jeruk+Medan'],
  },
  {
    farmerIdx: 1,
    title: 'Kacang Hijau Pilihan',
    description: 'Kacang hijau kualitas premium, cepat empuk.',
    category: 'Biji-bijian & Kacang',
    price_per_unit: 20000,
    unit: 'kg',
    stock: 400,
    min_order: 1,
    images: ['https://placehold.co/600x400?text=Kacang+Hijau'],
  },
  {
    farmerIdx: 2,
    title: 'Tempe Organik',
    description: 'Tempe kedelai non-GMO dibungkus daun pisang.',
    category: 'Produk Olahan',
    price_per_unit: 5000,
    unit: 'papan',
    stock: 100,
    min_order: 2,
    images: ['https://placehold.co/600x400?text=Tempe+Organik'],
  },
];

async function seed() {
  console.log('🌱 Starting Demo Seeding...');

  try {
    // 1. Create and login Admin
    console.log('--- Registering Users ---');
    await registerAdmin(USERS.admin);
    const adminToken = (await login(USERS.admin)).accessToken;
    console.log('✅ Admin Ready');

    // 2. Register other users
    for (const farmer of USERS.petanis) {
      await registerVerifyAndLogin(farmer, adminToken);
      process.stdout.write('👨‍🌾');
    }
    for (const buyer of USERS.buyers) {
      await registerVerifyAndLogin(buyer, adminToken);
      process.stdout.write('🛒');
    }
    await registerVerifyAndLogin(USERS.investor, adminToken);
    process.stdout.write('💰');

    await registerVerifyAndLogin(USERS.logistics, adminToken);
    process.stdout.write('📦');
    console.log('\n✅ All Users Registered and Verified');

    // 3. Create Products
    console.log('\n--- Creating Products ---');
    const farmerTokens: string[] = [];
    for (const f of USERS.petanis) {
      farmerTokens.push((await login(f)).accessToken);
    }

    const seededProducts: any[] = [];
    for (const p of PRODUCTS) {
      const res = await axios.post(
        `${GATEWAY_URL}/products`,
        {
          title: p.title,
          description: p.description,
          category: p.category,
          price_per_unit: p.price_per_unit,
          unit: p.unit,
          stock: p.stock,
          min_order: p.min_order,
          location: (USERS.petanis[p.farmerIdx] as any).location,
          images: p.images,
        },
        {
          headers: { Authorization: `Bearer ${farmerTokens[p.farmerIdx]}` },
        }
      );
      seededProducts.push(res.data.data);
      process.stdout.write('🍎');
    }
    console.log('\n✅ Products Seeded');

    // 4. Create Proposals
    console.log('\n--- Creating Proposals ---');
    // Budi creates a proposal
    const budiToken = farmerTokens[0];
    const p1Res = await axios.post(
      `${GATEWAY_URL}/proposals`,
      {
        title: 'Modernisasi Alat Tani Banyuwangi',
        commodity: 'Padi',
        land_area_ha: 5,
        location: {
          province: 'Jawa Timur',
          city: 'Banyuwangi',
          district: 'Glagah',
          full_address: 'Jl. Raya Glagah No. 45',
        },
        funding_needed: 50000000,
        projected_roi_percent: 15,
        duration_days: 180,
        harvest_date_estimated: '2026-11-25T00:00:00.000Z',
        description:
          'Pengadaan traktor dan sistem irigasi otomatis untuk lahan padi seluas 5 hektar agar meningkatkan produktivitas panen.',
        use_of_funds:
          'Pembelian traktor mini, mesin pompa air, pipa paralon irigasi, dan pengerjaan jaringan drainase otomatis.',
        risk_notes:
          'Risiko cuaca ekstrem diatasi dengan asuransi pertanian dan sistem irigasi modern.',
      },
      {
        headers: { Authorization: `Bearer ${budiToken}` },
      }
    );
    const p1Id = p1Res.data.data.id;
    await axios.post(
      `${GATEWAY_URL}/proposals/${p1Id}/submit`,
      {},
      { headers: { Authorization: `Bearer ${budiToken}` } }
    );
    await axios.post(
      `${GATEWAY_URL}/proposals/${p1Id}/approve`,
      {},
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    console.log('✅ Proposal 1 (Open) Created');

    // Siti creates a proposal (will be fully funded)
    const sitiToken = farmerTokens[1];
    const p2Res = await axios.post(
      `${GATEWAY_URL}/proposals`,
      {
        title: 'Budidaya Cabai Rawit Garut',
        commodity: 'Cabai Rawit',
        land_area_ha: 2,
        location: {
          province: 'Jawa Barat',
          city: 'Garut',
          district: 'Tarogong Kidul',
          full_address: 'Jl. Samarang No. 102',
        },
        funding_needed: 10000000,
        projected_roi_percent: 20,
        duration_days: 120,
        harvest_date_estimated: '2026-09-25T00:00:00.000Z',
        description: 'Modal untuk bibit dan pupuk cabai rawit musim tanam 2026.',
        use_of_funds: 'Pembelian pupuk organik, pestisida alami, dan bibit cabai rawit.',
        risk_notes: 'Fluktuasi harga cabai di pasaran dapat memengaruhi profitabilitas.',
      },
      {
        headers: { Authorization: `Bearer ${sitiToken}` },
      }
    );
    const p2Id = p2Res.data.data.id;
    await axios.post(
      `${GATEWAY_URL}/proposals/${p2Id}/submit`,
      {},
      { headers: { Authorization: `Bearer ${sitiToken}` } }
    );
    await axios.post(
      `${GATEWAY_URL}/proposals/${p2Id}/approve`,
      {},
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );

    // Investor funds P2 fully
    const investorToken = (await login(USERS.investor)).accessToken;
    await axios.post(
      `${GATEWAY_URL}/investments`,
      {
        proposalId: p2Id,
        amount: 10000000,
      },
      {
        headers: { Authorization: `Bearer ${investorToken}` },
      }
    );
    console.log('✅ Proposal 2 (Fully Funded) Created');

    // 5. Create Orders
    console.log('\n--- Creating Orders ---');
    const buyer1Token = (await login(USERS.buyers[0])).accessToken;
    const buyer2Token = (await login(USERS.buyers[1])).accessToken;

    // Buyer 1 adds to cart and checkout
    await axios.post(
      `${GATEWAY_URL}/cart/items`,
      { productId: seededProducts[0]._id || seededProducts[0].id, quantity: 10 },
      { headers: { Authorization: `Bearer ${buyer1Token}` } }
    );
    await axios.post(
      `${GATEWAY_URL}/cart/items`,
      { productId: seededProducts[1]._id || seededProducts[1].id, quantity: 5 },
      { headers: { Authorization: `Bearer ${buyer1Token}` } }
    );
    const order1Res = await axios.post(
      `${GATEWAY_URL}/orders`,
      {
        shippingAddress: {
          recipient_name: 'Andi Buyer',
          phone_number: '08123456789',
          province: 'DKI Jakarta',
          city: 'Jakarta Selatan',
          full_address: 'Jl. Melati No 123, Jakarta Selatan',
          postal_code: '12345',
        },
      },
      { headers: { Authorization: `Bearer ${buyer1Token}` } }
    );
    console.log('✅ Order 1 (Pending Payment) Created');

    // Buyer 2 creates a PAID order
    await axios.post(
      `${GATEWAY_URL}/cart/items`,
      { productId: seededProducts[2]._id || seededProducts[2].id, quantity: 2 },
      { headers: { Authorization: `Bearer ${buyer2Token}` } }
    );
    const order2Res = await axios.post(
      `${GATEWAY_URL}/orders`,
      {
        shippingAddress: {
          recipient_name: 'Rina Buyer',
          phone_number: '08987654321',
          province: 'Jawa Timur',
          city: 'Surabaya',
          full_address: 'Perumahan Elok Blok A1, Surabaya',
          postal_code: '60123',
        },
      },
      { headers: { Authorization: `Bearer ${buyer2Token}` } }
    );
    const order2Id = order2Res.data.data.id;

    // Simulate Payment Webhook for Order 2
    const serverKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-test';
    const grossAmount = order2Res.data.data.total_amount.toString();
    const signaturePayload = order2Id + '200' + grossAmount + serverKey;
    const signatureKey = crypto.createHash('sha512').update(signaturePayload).digest('hex');

    await axios.post(`${GATEWAY_URL}/payments/webhook`, {
      order_id: order2Id,
      status_code: '200',
      gross_amount: grossAmount,
      transaction_status: 'settlement',
      signature_key: signatureKey,
    });
    console.log('✅ Order 2 (Paid) Created');

    console.log('\n✨ Demo Seeding Completed Successfully!');
  } catch (error: any) {
    console.error('❌ Seeding failed:', error.message);
    if (error.response) {
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

async function registerAdmin(user: any) {
  try {
    await axios.post(`${GATEWAY_URL}/auth/register`, user);
  } catch (err) {}
}

async function registerVerifyAndLogin(user: any, adminToken: string) {
  let userId: string | null = null;

  // Try to register first
  try {
    const regRes = await axios.post(`${GATEWAY_URL}/auth/register`, user);
    userId = regRes.data.data.id;
  } catch (err: any) {
    // User already exists, try to get existing user id from user list
    try {
      const usersListRes = await axios.get(`${GATEWAY_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const existingUser = usersListRes.data.data.find((u: any) => u.email === user.email);
      if (existingUser) {
        userId = existingUser.id;
      }
    } catch (usersErr) {}
  }

  // Verify the user via admin verify endpoint
  if (userId) {
    try {
      await axios.patch(
        `${GATEWAY_URL}/auth/users/${userId}/verify`,
        {},
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
    } catch (err) {}
  }

  // Now login successfully
  const res = await axios.post(`${GATEWAY_URL}/auth/login`, {
    email: user.email,
    password: user.password,
  });
  return res.data.data;
}

async function login(user: any) {
  const res = await axios.post(`${GATEWAY_URL}/auth/login`, {
    email: user.email,
    password: user.password,
  });
  return res.data.data;
}

seed();
