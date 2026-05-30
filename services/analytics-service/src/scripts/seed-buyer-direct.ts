import prisma from '../lib/prisma';
import crypto from 'crypto';

const PRODUCTS = [
  {
    id: '6a195d230061c8e50f1d1581', // Tempe Organik
    title: 'Tempe Organik Daun Pisang',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '6a195d230061c8e50f1d1580', // Kacang Hijau Pilihan
    title: 'Kacang Hijau Pilihan',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '6a195d230061c8e50f1d157f', // Jeruk Medan Manis
    title: 'Jeruk Medan Manis',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '6a195d230061c8e50f1d157e', // Bawang Merah Brebes
    title: 'Bawang Merah Brebes',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1608797178974-15b35a61d121?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: '6a195d230061c8e50f1d157d', // Wortel Brastagi
    title: 'Wortel Brastagi',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80',
  },
];

async function main() {
  console.log('🌱 Starting direct database seeding for buyer@smarttani.id...');

  try {
    // 1. Ensure user buyer@smarttani.id exists in analytics.users
    const BUYER_ID = '5317b556-0e16-485f-a6b6-815e1fba3a9f';
    await prisma.$executeRawUnsafe(
      `
      INSERT INTO "analytics"."users" (id, email, role, status, full_name, created_at, updated_at)
      VALUES ($1::uuid, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `,
      BUYER_ID,
      'buyer@smarttani.id',
      'buyer',
      'active',
      'Buyer SmartTani'
    );
    console.log('✅ User buyer@smarttani.id verified in analytics.users');

    // 2. Fetch Budi (Farmer) and buyer@smarttani.id
    const farmer = await prisma.user.findFirst({
      where: { email: 'budi@smarttani.id' }
    });

    const buyer = await prisma.user.findFirst({
      where: { email: 'buyer@smarttani.id' }
    });

    if (!farmer || !buyer) {
      throw new Error(`User not found: Farmer Budi (${!!farmer}), Buyer (${!!buyer})`);
    }

    const FARMER_ID = farmer.id;

    console.log(`✅ Farmer ID (Budi): ${FARMER_ID}`);
    console.log(`✅ Buyer ID (buyer@smarttani.id): ${BUYER_ID}`);

    // 3. Clear existing entries for this buyer in both schemas to avoid duplicate key issues
    await prisma.$executeRawUnsafe(
      `DELETE FROM "analytics"."order_items" WHERE order_id IN (SELECT id FROM "analytics"."orders" WHERE buyer_id = $1::uuid)`,
      BUYER_ID
    );
    await prisma.$executeRawUnsafe(
      `DELETE FROM "order"."order_items" WHERE order_id IN (SELECT id FROM "order"."orders" WHERE buyer_id = $1::uuid)`,
      BUYER_ID
    );
    await prisma.$executeRawUnsafe(
      `DELETE FROM "analytics"."orders" WHERE buyer_id = $1::uuid`,
      BUYER_ID
    );
    await prisma.$executeRawUnsafe(
      `DELETE FROM "order"."orders" WHERE buyer_id = $1::uuid`,
      BUYER_ID
    );

    // 4. Upsert products in analytics.products
    for (const p of PRODUCTS) {
      await prisma.$executeRawUnsafe(
        `
        INSERT INTO "analytics"."products" (id, farmer_id, title, image, status, created_at, updated_at)
        VALUES ($1, $2::uuid, $3, $4, $5, NOW(), NOW())
        ON CONFLICT (id) DO NOTHING
      `,
        p.id,
        FARMER_ID,
        p.title,
        p.image,
        'active'
      );
    }
    console.log('✅ Premium products upserted in PostgreSQL products table');

    // 5. Generate one month of dummy orders (past 30 days)
    const statuses = [
      'completed',
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

      // Random chance to place an order on this day (approx 50% chance)
      if (Math.random() > 0.55) {
        continue;
      }

      const orderId = crypto.randomUUID();
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

      // Select 1 to 3 random products from our list
      const numItems = 1 + Math.floor(Math.random() * 3);
      const selectedProducts = [...PRODUCTS].sort(() => 0.5 - Math.random()).slice(0, numItems);

      let totalAmount = 0;
      const orderItemsData = [];

      for (const prod of selectedProducts) {
        const quantity = 2 + Math.floor(Math.random() * 10);
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

    console.log(
      `✅ Success! Direct seeded ${orderCount} orders and ${itemTotalCount} order items over the past 30 days for buyer@smarttani.id directly in PG.`
    );
  } catch (err) {
    console.error('❌ Error seeding PostgreSQL database:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
