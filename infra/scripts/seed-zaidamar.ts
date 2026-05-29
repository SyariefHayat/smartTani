/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-empty */
import axios from 'axios';

const GATEWAY_URL = 'http://localhost:3000';

const FARMER = {
  email: 'zaidamar@smarttani.id',
  password: 'password123',
  role: 'petani',
  full_name: 'Zaid Amar',
  location: { province: 'Jawa Barat', city: 'Cianjur' },
};

const ADMIN = {
  email: 'admin@smarttani.id',
  password: 'password123',
};

async function seed() {
  console.log('🌱 Starting Zaid Amar Farming Report Seeding...');

  try {
    // 1. Login Admin to search & verify user
    console.log('Authenticating Admin...');
    let adminToken: string;
    try {
      const adminLoginRes = await axios.post(`${GATEWAY_URL}/auth/login`, ADMIN);
      adminToken = adminLoginRes.data.data.accessToken;
    } catch (err) {
      console.error('❌ Failed to authenticate Admin. Please make sure database is seeded first.');
      return;
    }

    // 2. Register zaidamar@smarttani.id if not exists
    console.log('Registering user zaidamar@smarttani.id...');
    let userId: string | null = null;
    try {
      const regRes = await axios.post(`${GATEWAY_URL}/auth/register`, FARMER);
      userId = regRes.data.data.id;
      console.log('✅ User registered successfully.');
    } catch (err: any) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.error &&
        (err.response.data.error.code === 'AUTH_002' || err.response.data.error.code === 'AUTH_001')
      ) {
        console.log('ℹ️ User already registered. Finding existing ID...');
        const usersListRes = await axios.get(`${GATEWAY_URL}/auth/users`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        const existingUser = usersListRes.data.data.find((u: any) => u.email === FARMER.email);
        if (existingUser) {
          userId = existingUser.id;
          console.log(`✅ Found existing user ID: ${userId}`);
        } else {
          console.error('❌ Could not find existing user ID');
          return;
        }
      } else {
        console.error('❌ Registration failed:', err.message);
        if (err.response) console.error(err.response.data);
        return;
      }
    }

    // 3. Verify user to ensure status is active
    if (userId) {
      console.log(`Verifying/activating user account: ${userId}...`);
      try {
        await axios.patch(
          `${GATEWAY_URL}/auth/users/${userId}/verify`,
          {},
          {
            headers: { Authorization: `Bearer ${adminToken}` },
          }
        );
        console.log('✅ User verified successfully.');
      } catch (err: any) {
        console.log('ℹ️ User might already be verified.');
      }
    }

    // 4. Login as Zaid Amar
    console.log('Authenticating Zaid Amar...');
    const loginRes = await axios.post(`${GATEWAY_URL}/auth/login`, {
      email: FARMER.email,
      password: FARMER.password,
    });
    const token = loginRes.data.data.accessToken;
    console.log('✅ Zaid Amar Authenticated');

    const headers = { Authorization: `Bearer ${token}` };

    // 5. Create Lands
    console.log('--- Seeding Farm Lands ---');
    const lands = [
      {
        name: 'Lahan Hijau',
        location_province: 'Jawa Barat',
        location_city: 'Cianjur',
        location_district: 'Cugenang',
        full_address: 'Jl. Raya Cugenang No. 12',
        area_ha: 2.2,
        soil_type: 'Vulkanik',
        status: 'active' as const,
        current_crop: 'Cabai Merah',
        notes: 'Lahan subur di kaki gunung gede',
      },
      {
        name: 'Lahan Basah',
        location_province: 'Jawa Barat',
        location_city: 'Cianjur',
        location_district: 'Cibeber',
        full_address: 'Jl. Pembangunan No. 8',
        area_ha: 1.5,
        soil_type: 'Aluvial',
        status: 'active' as const,
        current_crop: 'Padi Pandanwangi',
        notes: 'Irigasi lancar sepanjang tahun',
      },
      {
        name: 'Kebun Bukit',
        location_province: 'Jawa Barat',
        location_city: 'Cianjur',
        location_district: 'Pacet',
        full_address: 'Jl. Pacet Indah Blok C',
        area_ha: 3.0,
        soil_type: 'Andosol',
        status: 'active' as const,
        current_crop: 'Wortel',
        notes: 'Suhu udara sejuk cocok untuk sayuran',
      },
    ];

    const seededLands: any[] = [];
    // Clear old lands if any (optional, or just create since it's demo)
    for (const land of lands) {
      const res = await axios.post(`${GATEWAY_URL}/lands`, land, { headers });
      seededLands.push(res.data.data);
      console.log(`✅ Created land: ${land.name}`);
    }

    // 6. Create Harvest Records across last 6 months
    console.log('--- Seeding Harvest Records ---');
    const harvests = [
      {
        landIdx: 0,
        crop_name: 'Cabai Merah',
        quantity: 450,
        unit: 'kg',
        harvest_date: '2026-05-20T00:00:00.000Z',
        quality_grade: 'A' as const,
        notes: 'Hasil melimpah, kualitas A premium',
      },
      {
        landIdx: 0,
        crop_name: 'Cabai Merah',
        quantity: 320,
        unit: 'kg',
        harvest_date: '2026-04-18T00:00:00.000Z',
        quality_grade: 'B' as const,
        notes: 'Kena sedikit hama tapi terselamatkan',
      },
      {
        landIdx: 1,
        crop_name: 'Padi Pandanwangi',
        quantity: 2500,
        unit: 'kg',
        harvest_date: '2026-05-10T00:00:00.000Z',
        quality_grade: 'A' as const,
        notes: 'Padi khas cianjur wangi pandan asli',
      },
      {
        landIdx: 2,
        crop_name: 'Wortel',
        quantity: 850,
        unit: 'kg',
        harvest_date: '2026-05-02T00:00:00.000Z',
        quality_grade: 'A' as const,
        notes: 'Wortel segar manis dipanen pagi',
      },
      {
        landIdx: 2,
        crop_name: 'Wortel',
        quantity: 790,
        unit: 'kg',
        harvest_date: '2026-03-28T00:00:00.000Z',
        quality_grade: 'B' as const,
        notes: 'Cuaca agak kering',
      },
      {
        landIdx: 0,
        crop_name: 'Cabai Merah',
        quantity: 380,
        unit: 'kg',
        harvest_date: '2026-03-12T00:00:00.000Z',
        quality_grade: 'A' as const,
        notes: 'Panen awal tahun bagus',
      },
      {
        landIdx: 1,
        crop_name: 'Padi Pandanwangi',
        quantity: 2200,
        unit: 'kg',
        harvest_date: '2026-01-15T00:00:00.000Z',
        quality_grade: 'B' as const,
        notes: 'Padi awal tahun curah hujan tinggi',
      },
      {
        landIdx: 2,
        crop_name: 'Wortel',
        quantity: 900,
        unit: 'kg',
        harvest_date: '2026-01-20T00:00:00.000Z',
        quality_grade: 'C' as const,
        notes: 'Kadar air tinggi karena hujan deras',
      },
    ];

    for (const h of harvests) {
      const landId = seededLands[h.landIdx].id;
      const res = await axios.post(
        `${GATEWAY_URL}/harvests`,
        {
          land_id: landId,
          crop_name: h.crop_name,
          quantity: h.quantity,
          unit: h.unit,
          harvest_date: h.harvest_date,
          quality_grade: h.quality_grade,
          notes: h.notes,
        },
        { headers }
      );
      console.log(`✅ Created harvest: ${h.crop_name} (${h.quantity} ${h.unit})`);
    }

    console.log('\n✨ Zaid Amar Farming Report Seeding Completed Successfully!');
  } catch (error: any) {
    console.error('❌ Seeding failed:', error.message);
    if (error.response) {
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

seed();
