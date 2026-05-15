
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function seed() {
  console.log('🌱 Seeding data for load test...');
  
  try {
    // 1. Create Admin for verification
    const adminEmail = 'perf_admin@smarttani.id';
    await axios.post(`${BASE_URL}/auth/register`, {
      email: adminEmail,
      password: 'password123',
      role: 'admin',
      full_name: 'Perf Admin',
    }).catch(() => {}); // Ignore if exists
    
    const loginAdmin = await axios.post(`${BASE_URL}/auth/login`, {
      email: adminEmail,
      password: 'password123',
    });
    const adminToken = loginAdmin.data.data.accessToken;
    console.log('✅ Admin ready');

    // 2. Create 100 Farmers and 500 Products
    console.log('👨‍🌾 Creating farmers and products...');
    for (let i = 1; i <= 10; i++) { // Using 10 farmers for speed, each with 50 products
      const email = `farmer_perf_${i}@smarttani.id`;
      const reg = await axios.post(`${BASE_URL}/auth/register`, {
        email,
        password: 'password123',
        role: 'petani',
        full_name: `Farmer Perf ${i}`,
      }).catch(async () => {
         return await axios.post(`${BASE_URL}/auth/login`, { email, password: 'password123' });
      });

      const farmerId = reg.data.data.id || reg.data.data.user.id;
      await axios.patch(`${BASE_URL}/auth/users/${farmerId}/verify`, {}, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });

      const login = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password: 'password123',
      });
      const token = login.data.data.accessToken;

      for (let j = 1; j <= 50; j++) {
        await axios.post(`${BASE_URL}/products`, {
          title: `Produk Unggulan ${i}-${j}`,
          description: 'Deskripsi produk berkualitas tinggi untuk pengujian performa sistem SmartTani.',
          category: 'Sayuran',
          price_per_unit: 10000 + (j * 100),
          unit: 'kg',
          stock: 1000,
          min_order: 1,
          location: { province: 'Jawa Barat', city: 'Bandung' }
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      process.stdout.write('.');
    }
    console.log('\n✅ Farmers and Products seeded');

    // 3. Create a CSV file for login test
    console.log('📝 Generating users.csv for login test...');
    let csvContent = 'email,password\n';
    for (let i = 1; i <= 10; i++) {
      csvContent += `farmer_perf_${i}@smarttani.id,password123\n`;
    }
    // Add 90 more users just for login
    for (let i = 11; i <= 100; i++) {
        const email = `user_perf_${i}@smarttani.id`;
        const reg = await axios.post(`${BASE_URL}/auth/register`, {
            email,
            password: 'password123',
            role: 'buyer',
            full_name: `User Perf ${i}`,
        }).catch(() => ({ data: { data: { id: null } } }));
        
        if (reg.data.data.id) {
            await axios.patch(`${BASE_URL}/auth/users/${reg.data.data.id}/verify`, {}, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
        }
        csvContent += `${email},password123\n`;
        if (i % 10 === 0) process.stdout.write('.');
    }
    
    const fs = require('fs');
    fs.writeFileSync('users.csv', csvContent);
    console.log('\n✅ users.csv generated');

  } catch (error: any) {
    console.error('❌ Seeding failed:', error.message);
    if (error.response) {
        console.error('Response data:', error.response.data);
    }
  }
}

seed();
