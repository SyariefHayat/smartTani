import prisma from '../lib/prisma';

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log('Analytics users:', users);
    const products = await prisma.product.findMany();
    console.log('Analytics products:', products);
  } catch (err) {
    console.error('Error connecting to database:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
