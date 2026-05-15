
import axios from 'axios';

const GATEWAY_URL = 'http://localhost:3000';

const USERS = {
  admin: {
    email: 'admin@smarttani.id',
    password: 'password123',
    role: 'admin',
    full_name: 'Super Admin'
  },
  petanis: [
    {
      email: 'budi@smarttani.id',
      password: 'password123',
      role: 'petani',
      full_name: 'Budi Santoso',
      location: { province: 'Jawa Timur', city: 'Banyuwangi' }
    },
    {
      email: 'siti@smarttani.id',
      password: 'password123',
      role: 'petani',
      full_name: 'Siti Aminah',
      location: { province: 'Jawa Barat', city: 'Garut' }
    },
    {
      email: 'agus@smarttani.id',
      password: 'password123',
      role: 'petani',
      full_name: 'Agus Salim',
      location: { province: 'Jawa Tengah', city: 'Boyolali' }
    }
  ],
  buyers: [
    {
      email: 'buyer1@gmail.com',
      password: 'password123',
      role: 'buyer',
      full_name: 'Andi Buyer'
    },
    {
      email: 'buyer2@gmail.com',
      password: 'password123',
      role: 'buyer',
      full_name: 'Rina Buyer'
    }
  ],
  investor: {
    email: 'investor@smarttani.id',
    password: 'password123',
    role: 'investor',
    full_name: 'Iwan Investor'
  },
  logistics: {
    email: 'logistik@smarttani.id',
    password: 'password123',
    role: 'logistik',
    full_name: 'Logistik Kilat'
  }
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
    images: ['https://placehold.co/600x400?text=Beras+Pandan+Wangi']
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
    images: ['https://placehold.co/600x400?text=Tomat+Segar']
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
    images: ['https://placehold.co/600x400?text=Cabai+Rawit']
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
    images: ['https://placehold.co/600x400?text=Kentang+Dieng']
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
    images: ['https://placehold.co/600x400?text=Susu+Boyolali']
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
    images: ['https://placehold.co/600x400?text=Telur+Ayam+Kampung']
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
    images: ['https://placehold.co/600x400?text=Wortel']
  },
  {
    farmerIdx: 1,
    title: 'Jahe Merah',
    description: 'Jahe merah untuk kesehatan dan bumbu dapur.',
    category: 'Tanaman Obat',
    price_per_unit: 35000,
    unit: 'kg',
    stock: 150,
    min_order: 0.5,
    images: ['https://placehold.co/600x400?text=Jahe+Merah']
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
    images: ['https://placehold.co/600x400?text=Bawang+Merah']
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
    images: ['https://placehold.co/600x400?text=Jeruk+Medan']
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
    images: ['https://placehold.co/600x400?text=Kacang+Hijau']
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
    images: ['https://placehold.co/600x400?text=Tempe+Organik']
  }
];

async function seed() {
  console.log('🌱 Starting Demo Seeding...');

  try {
    // 1. Create and login Admin
    console.log('--- Registering Users ---');
    await registerAndLogin(USERS.admin);
    const adminToken = (await login(USERS.admin)).accessToken;
    console.log('✅ Admin Ready');

    // 2. Register other users
    for (const farmer of USERS.petanis) {
      const reg = await registerAndLogin(farmer);
      // Verify farmer as admin
      await axios.patch(`${GATEWAY_URL}/auth/users/${reg.user.id}/status`, { status: 'active' }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      process.stdout.write('👨‍🌾');
    }
    for (const buyer of USERS.buyers) {
      const reg = await registerAndLogin(buyer);
      await axios.patch(`${GATEWAY_URL}/auth/users/${reg.user.id}/status`, { status: 'active' }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      process.stdout.write('🛒');
    }
    const investorReg = await registerAndLogin(USERS.investor);
    await axios.patch(`${GATEWAY_URL}/auth/users/${investorReg.user.id}/status`, { status: 'active' }, {
        headers: { Authorization: `Bearer ${adminToken}` }
    });
    process.stdout.write('💰');

    const logisticsReg = await registerAndLogin(USERS.logistics);
    await axios.patch(`${GATEWAY_URL}/auth/users/${logisticsReg.user.id}/status`, { status: 'active' }, {
        headers: { Authorization: `Bearer ${adminToken}` }
    });
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
      const res = await axios.post(`${GATEWAY_URL}/products`, {
        title: p.title,
        description: p.description,
        category: p.category,
        price_per_unit: p.price_per_unit,
        unit: p.unit,
        stock: p.stock,
        min_order: p.min_order,
        location: (USERS.petanis[p.farmerIdx] as any).location,
        images: p.images
      }, {
        headers: { Authorization: `Bearer ${farmerTokens[p.farmerIdx]}` }
      });
      seededProducts.push(res.data.data);
      process.stdout.write('🍎');
    }
    console.log('\n✅ Products Seeded');

    // 4. Create Proposals
    console.log('\n--- Creating Proposals ---');
    // Budi creates a proposal
    const budiToken = farmerTokens[0];
    const p1Res = await axios.post(`${GATEWAY_URL}/proposals`, {
      title: 'Modernisasi Alat Tani Banyuwangi',
      description: 'Pengadaan traktor dan sistem irigasi otomatis untuk lahan padi 5 hektar.',
      target_amount: 50000000,
      expected_return_percent: 15,
      duration_months: 6,
      location: USERS.petanis[0].location,
      risk_level: 'low'
    }, {
      headers: { Authorization: `Bearer ${budiToken}` }
    });
    const p1Id = p1Res.data.data.id;
    await axios.post(`${GATEWAY_URL}/proposals/${p1Id}/submit`, {}, { headers: { Authorization: `Bearer ${budiToken}` } });
    await axios.post(`${GATEWAY_URL}/proposals/${p1Id}/approve`, {}, { headers: { Authorization: `Bearer ${adminToken}` } });
    console.log('✅ Proposal 1 (Open) Created');

    // Siti creates a proposal (will be fully funded)
    const sitiToken = farmerTokens[1];
    const p2Res = await axios.post(`${GATEWAY_URL}/proposals`, {
      title: 'Budidaya Cabai Rawit Garut',
      description: 'Modal untuk bibit dan pupuk cabai rawit musim tanam 2026.',
      target_amount: 10000000,
      expected_return_percent: 20,
      duration_months: 4,
      location: USERS.petanis[1].location,
      risk_level: 'medium'
    }, {
      headers: { Authorization: `Bearer ${sitiToken}` }
    });
    const p2Id = p2Res.data.data.id;
    await axios.post(`${GATEWAY_URL}/proposals/${p2Id}/submit`, {}, { headers: { Authorization: `Bearer ${sitiToken}` } });
    await axios.post(`${GATEWAY_URL}/proposals/${p2Id}/approve`, {}, { headers: { Authorization: `Bearer ${adminToken}` } });
    
    // Investor funds P2 fully
    const investorToken = (await login(USERS.investor)).accessToken;
    await axios.post(`${GATEWAY_URL}/investments`, {
      proposal_id: p2Id,
      amount: 10000000
    }, {
      headers: { Authorization: `Bearer ${investorToken}` }
    });
    console.log('✅ Proposal 2 (Fully Funded) Created');

    // 5. Create Orders
    console.log('\n--- Creating Orders ---');
    const buyer1Token = (await login(USERS.buyers[0])).accessToken;
    const buyer2Token = (await login(USERS.buyers[1])).accessToken;

    // Buyer 1 adds to cart and checkout
    await axios.post(`${GATEWAY_URL}/cart/items`, { productId: seededProducts[0].id, quantity: 10 }, { headers: { Authorization: `Bearer ${buyer1Token}` } });
    await axios.post(`${GATEWAY_URL}/cart/items`, { productId: seededProducts[1].id, quantity: 5 }, { headers: { Authorization: `Bearer ${buyer1Token}` } });
    const order1Res = await axios.post(`${GATEWAY_URL}/orders`, {
      shippingAddress: {
        full_name: 'Andi Buyer',
        phone: '08123456789',
        address: 'Jl. Melati No 123',
        city: 'Jakarta Selatan',
        province: 'DKI Jakarta',
        postal_code: '12345'
      },
      payment_method: 'midtrans'
    }, { headers: { Authorization: `Bearer ${buyer1Token}` } });
    const order1Id = order1Res.data.data.id;
    console.log('✅ Order 1 (Pending Payment) Created');

    // Buyer 2 creates a PAID order
    await axios.post(`${GATEWAY_URL}/cart/items`, { productId: seededProducts[2].id, quantity: 2 }, { headers: { Authorization: `Bearer ${buyer2Token}` } });
    const order2Res = await axios.post(`${GATEWAY_URL}/orders`, {
      shippingAddress: {
        full_name: 'Rina Buyer',
        phone: '08987654321',
        address: 'Perumahan Elok Blok A1',
        city: 'Surabaya',
        province: 'Jawa Timur',
        postal_code: '60123'
      },
      payment_method: 'midtrans'
    }, { headers: { Authorization: `Bearer ${buyer2Token}` } });
    const order2Id = order2Res.data.data.id;
    
    // Simulate Payment Webhook for Order 2
    await axios.post(`${GATEWAY_URL}/payments/webhook`, {
      order_id: order2Id,
      status_code: '200',
      gross_amount: order2Res.data.data.total_amount.toString(),
      transaction_status: 'settlement',
      signature_key: 'dummy' // Signature verification is bypassed/mocked in some dev envs or we use correct logic
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

async function registerAndLogin(user: any) {
  try {
    await axios.post(`${GATEWAY_URL}/auth/register`, user);
  } catch (err) {}
  const res = await axios.post(`${GATEWAY_URL}/auth/login`, {
    email: user.email,
    password: user.password
  });
  return res.data.data;
}

async function login(user: any) {
  const res = await axios.post(`${GATEWAY_URL}/auth/login`, {
    email: user.email,
    password: user.password
  });
  return res.data.data;
}

seed();
