import prisma from '../lib/prisma';
import crypto from 'crypto';

const FARMER_ID = 'a5c30f9a-55fd-4639-a494-07f14b083818';
const BUYER_ID = 'c474b847-0968-4a9d-84e5-ee02c5371bf4';

const PRODUCTS = [
  {
    id: '60c72b2f9b1d8b2bad000001',
    title: 'Beras Pandan Wangi Organik',
    price: 18000,
    image:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '60c72b2f9b1d8b2bad000002',
    title: 'Tomat Segar Hidroponik',
    price: 12000,
    image:
      'https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '60c72b2f9b1d8b2bad000003',
    title: 'Cabai Rawit Merah Super',
    price: 45000,
    image:
      'https://images.unsplash.com/photo-1588252399745-b7987b39c6ae?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '60c72b2f9b1d8b2bad000004',
    title: 'Kentang Dieng Premium',
    price: 15000,
    image:
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '60c72b2f9b1d8b2bad000005',
    title: 'Wortel Organik Brastagi',
    price: 10000,
    image:
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '60c72b2f9b1d8b2bad000006',
    title: 'Bawang Merah Brebes Super',
    price: 25000,
    image:
      'https://images.unsplash.com/photo-1608797178974-15b35a61d121?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '60c72b2f9b1d8b2bad000007',
    title: 'Jeruk Siam Madu Segar',
    price: 22000,
    image:
      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '60c72b2f9b1d8b2bad000008',
    title: 'Tempe Organik Daun Pisang',
    price: 5000,
    image:
      'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '60c72b2f9b1d8b2bad000009',
    title: 'Bayam Hijau Organik',
    price: 7000,
    image:
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '60c72b2f9b1d8b2bad000010',
    title: 'Bawang Putih Kating',
    price: 35000,
    image:
      'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '60c72b2f9b1d8b2bad000011',
    title: 'Kelapa Muda Hijau',
    price: 15000,
    image:
      'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '60c72b2f9b1d8b2bad000012',
    title: 'Mangga Harum Manis',
    price: 28000,
    image:
      'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '60c72b2f9b1d8b2bad000013',
    title: 'Alpukat Mentega Jumbo',
    price: 32000,
    image:
      'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '60c72b2f9b1d8b2bad000014',
    title: 'Pisang Raja Bulu',
    price: 20000,
    image:
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '60c72b2f9b1d8b2bad000015',
    title: 'Kubis Bulat Segar',
    price: 8000,
    image:
      'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '60c72b2f9b1d8b2bad000016',
    title: 'Nanas Madu Subang',
    price: 12000,
    image:
      'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&auto=format&fit=crop&q=80',
  },
];

async function main() {
  console.log('🌱 Seeding PostgreSQL dummy data for one month with 16 products...');

  try {
    // 1. Ensure Farmer exists in auth.users and analytics.users
    const passwordHash = '$2a$10$Y5n.S/.YwQvS1mFmQ6/pSeoM0FpeHhX3tJ5RpyD0Wl0m2P1mS3y3G'; // bcrypt for password123

    await prisma.$executeRawUnsafe(
      `
      INSERT INTO "auth"."users" (id, email, password, role, status, full_name, created_at, updated_at)
      VALUES ($1::uuid, $2, $3, $4, $5, $6, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET role = $4, status = $5
    `,
      FARMER_ID,
      'zaidamar@smarttani.id',
      passwordHash,
      'petani',
      'active',
      'Zaid bin Amar'
    );

    await prisma.$executeRawUnsafe(
      `
      INSERT INTO "analytics"."users" (id, email, role, status, full_name, created_at, updated_at)
      VALUES ($1::uuid, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET role = $3, status = $4
    `,
      FARMER_ID,
      'zaidamar@smarttani.id',
      'petani',
      'active',
      'Zaid bin Amar'
    );

    console.log('✅ Farmer verified and updated');

    // 2. Ensure Buyer exists in auth.users and analytics.users
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO "auth"."users" (id, email, password, role, status, full_name, created_at, updated_at)
      VALUES ($1::uuid, $2, $3, $4, $5, $6, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET role = $4, status = $5
    `,
      BUYER_ID,
      'buyer_test@smarttani.id',
      passwordHash,
      'buyer',
      'active',
      'Andi Buyer'
    );

    await prisma.$executeRawUnsafe(
      `
      INSERT INTO "analytics"."users" (id, email, role, status, full_name, created_at, updated_at)
      VALUES ($1::uuid, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET role = $3, status = $4
    `,
      BUYER_ID,
      'buyer_test@smarttani.id',
      'buyer',
      'active',
      'Andi Buyer'
    );

    console.log('✅ Buyer verified and updated');

    // 3. Clear existing Products and Orders for this Farmer to avoid dirty data
    await prisma.$executeRawUnsafe(
      `DELETE FROM "analytics"."order_items" WHERE farmer_id = $1::uuid`,
      FARMER_ID
    );
    await prisma.$executeRawUnsafe(
      `DELETE FROM "order"."order_items" WHERE farmer_id = $1::uuid`,
      FARMER_ID
    );
    await prisma.$executeRawUnsafe(
      `DELETE FROM "analytics"."products" WHERE farmer_id = $1::uuid`,
      FARMER_ID
    );

    // Clean up empty orders
    await prisma.$executeRawUnsafe(
      `DELETE FROM "analytics"."orders" WHERE id NOT IN (SELECT DISTINCT order_id FROM "analytics"."order_items")`
    );
    await prisma.$executeRawUnsafe(
      `DELETE FROM "order"."orders" WHERE id NOT IN (SELECT DISTINCT order_id FROM "order"."order_items")`
    );

    console.log('🗑️ Existing dummy products and orders cleared');

    // 4. Seed Products in analytics.products
    for (const p of PRODUCTS) {
      await prisma.$executeRawUnsafe(
        `
        INSERT INTO "analytics"."products" (id, farmer_id, title, image, status, created_at, updated_at)
        VALUES ($1, $2::uuid, $3, $4, $5, NOW(), NOW())
      `,
        p.id,
        FARMER_ID,
        p.title,
        p.image,
        'active'
      );
    }
    console.log('✅ 16 premium products seeded in PG');

    // 5. Generate one month of dummy orders (past 30 days)
    const statuses = [
      'completed',
      'completed',
      'delivered',
      'delivered',
      'shipped',
      'confirmed_seller',
      'paid',
    ];
    const paymentMethods = ['midtrans', 'manual', 'bank_transfer'];

    let orderCount = 0;
    let itemTotalCount = 0;

    for (let day = 30; day >= 0; day--) {
      // Date calculation
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - day);
      orderDate.setHours(8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), 0, 0);

      // 2 to 4 orders per day to handle the larger product selection
      const dailyOrdersNum = 2 + Math.floor(Math.random() * 3);

      for (let o = 0; o < dailyOrdersNum; o++) {
        const orderId = crypto.randomUUID();
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

        // Select 1 to 4 random products from our 16 products
        const numItems = 1 + Math.floor(Math.random() * 4);
        const selectedProducts = [...PRODUCTS].sort(() => 0.5 - Math.random()).slice(0, numItems);

        let totalAmount = 0;
        const orderItemsData = [];

        for (const prod of selectedProducts) {
          const quantity = 1 + Math.floor(Math.random() * 8);
          const price = prod.price;
          const subtotal = quantity * price;
          totalAmount += subtotal;

          orderItemsData.push({
            id: crypto.randomUUID(),
            productId: prod.id,
            quantity,
            price,
            subtotal,
          });
        }

        const platformFee = totalAmount * 0.02;

        // Insert into order.orders
        await prisma.$executeRawUnsafe(
          `
          INSERT INTO "order"."orders" (id, buyer_id, total_amount, platform_fee, shipping_cost, status, payment_method, created_at, updated_at)
          VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6, $7, $8, $8)
        `,
          orderId,
          BUYER_ID,
          totalAmount,
          platformFee,
          15000,
          status,
          paymentMethod,
          orderDate
        );

        // Insert into order.order_items
        for (const item of orderItemsData) {
          await prisma.$executeRawUnsafe(
            `
            INSERT INTO "order"."order_items" (id, order_id, product_id, farmer_id, quantity, price_per_unit, subtotal)
            VALUES ($1::uuid, $2::uuid, $3, $4::uuid, $5, $6, $7)
          `,
            item.id,
            orderId,
            item.productId,
            FARMER_ID,
            item.quantity,
            item.price,
            item.subtotal
          );
        }

        // Insert into analytics.orders
        await prisma.$executeRawUnsafe(
          `
          INSERT INTO "analytics"."orders" (id, buyer_id, total_amount, status, created_at, updated_at)
          VALUES ($1::uuid, $2::uuid, $3, $4, $5, $5)
        `,
          orderId,
          BUYER_ID,
          totalAmount,
          status,
          orderDate
        );

        // Insert into analytics.order_items
        for (const item of orderItemsData) {
          await prisma.$executeRawUnsafe(
            `
            INSERT INTO "analytics"."order_items" (id, order_id, product_id, farmer_id, quantity, price_per_unit, subtotal)
            VALUES ($1::uuid, $2::uuid, $3, $4::uuid, $5, $6, $7)
          `,
            item.id,
            orderId,
            item.productId,
            FARMER_ID,
            item.quantity,
            item.price,
            item.subtotal
          );
          itemTotalCount++;
        }

        orderCount++;
      }
    }

    console.log(
      `✅ Success! Seeded ${orderCount} orders and ${itemTotalCount} order items over the past 30 days with 16 products.`
    );
  } catch (err) {
    console.error('❌ Error seeding PostgreSQL database:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
