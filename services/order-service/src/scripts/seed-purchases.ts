import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();

interface DbUser {
  id: string;
  email: string;
  role: string;
  full_name: string | null;
}

async function main() {
  console.log('🌱 Starting Purchase Seeding Script for ALL Farmers...');

  try {
    // 1. Find farmer users from the auth schema
    console.log('Fetching petani users from "auth" schema...');
    const farmers: DbUser[] = await prisma.$queryRaw`
      SELECT id, email, role, full_name 
      FROM auth.users 
      WHERE role = 'petani'
    `;

    if (farmers.length === 0) {
      console.error(
        '❌ No petani users found in database. Please run seed-demo or register a farmer first.'
      );
      process.exit(1);
    }

    console.log(`Found ${farmers.length} petani user(s).`);

    // Loop through each farmer and seed 10 purchase records
    for (const farmer of farmers) {
      console.log(
        `\n🎯 Seeding purchases for: ${farmer.full_name} (${farmer.email}) -> ID: ${farmer.id}`
      );
      const farmerId = farmer.id;

      const purchaseRecords = [
        {
          farmer_id: farmerId,
          supplier_name: 'Toko Tani Makmur',
          item_name: 'Bibit Padi Pandan Wangi',
          quantity: 100.0,
          unit: 'kg',
          total_cost: 1500000,
          purchase_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          notes: 'Bibit padi premium bersertifikat untuk lahan blok utara.',
        },
        {
          farmer_id: farmerId,
          supplier_name: 'CV Tani Sejahtera',
          item_name: 'Pupuk UREA Non-Subsidi',
          quantity: 500.0,
          unit: 'kg',
          total_cost: 4000000,
          purchase_date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
          notes: 'Pemupukan tahap pertama tanaman padi musim tanam kemarau.',
        },
        {
          farmer_id: farmerId,
          supplier_name: 'CV Tani Sejahtera',
          item_name: 'Pupuk NPK Mutiara 16-16-16',
          quantity: 200.0,
          unit: 'kg',
          total_cost: 3600000,
          purchase_date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000), // 22 days ago
          notes: 'Pupuk susulan fase vegetatif.',
        },
        {
          farmer_id: farmerId,
          supplier_name: 'Toko Agro Kencana',
          item_name: 'Pestisida Cair Regent 50SC',
          quantity: 5.0,
          unit: 'liter',
          total_cost: 1100000,
          purchase_date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), // 18 days ago
          notes: 'Pengendalian hama penggerek batang padi.',
        },
        {
          farmer_id: farmerId,
          supplier_name: 'Toko Agro Kencana',
          item_name: 'Mulsa Plastik Hitam Perak',
          quantity: 4.0,
          unit: 'roll',
          total_cost: 1800000,
          purchase_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          notes: 'Mulsa penutup tanah persiapan tanam cabai rawit.',
        },
        {
          farmer_id: farmerId,
          supplier_name: 'Toko Tani Jaya',
          item_name: 'Bibit Tomat Servo F1',
          quantity: 10.0,
          unit: 'pack',
          total_cost: 1200000,
          purchase_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // 12 days ago
          notes: 'Bibit tomat tahan virus untuk lahan tumpang sari.',
        },
        {
          farmer_id: farmerId,
          supplier_name: 'Toko Tani Jaya',
          item_name: 'Bibit Cabai Rawit Dewata F1',
          quantity: 8.0,
          unit: 'pack',
          total_cost: 680000,
          purchase_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
          notes: 'Varietas unggul, cocok untuk musim kemarau basah.',
        },
        {
          farmer_id: farmerId,
          supplier_name: 'Toko Bangunan & Teknik',
          item_name: 'Selang Irigasi Drip 2 Inch',
          quantity: 2.0,
          unit: 'roll',
          total_cost: 700000,
          purchase_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          notes: 'Sistem pengairan tetes otomatis blok B.',
        },
        {
          farmer_id: farmerId,
          supplier_name: 'Toko Agro Kencana',
          item_name: 'Kapur Pertanian (Dolomit)',
          quantity: 1000.0,
          unit: 'kg',
          total_cost: 800000,
          purchase_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          notes: 'Peningkatan pH tanah sebelum tanam.',
        },
        {
          farmer_id: farmerId,
          supplier_name: 'Mega Plastik Surabaya',
          item_name: 'Keranjang Panen Plastik',
          quantity: 15.0,
          unit: 'unit',
          total_cost: 1125000,
          purchase_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          notes: 'Keranjang panen sayur berlubang tebal.',
        },
      ];

      // Clean existing purchases for this farmer to start fresh
      await prisma.purchaseRecord.deleteMany({
        where: { farmer_id: farmerId },
      });

      // Insert new records
      for (const record of purchaseRecords) {
        await prisma.purchaseRecord.create({
          data: record,
        });
      }
      console.log(`✅ Successfully seeded 10 purchase records!`);
    }

    console.log(`\n🎉 ALL SEEDING PROCESS COMPLETED SUCCESSFULLY!`);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
