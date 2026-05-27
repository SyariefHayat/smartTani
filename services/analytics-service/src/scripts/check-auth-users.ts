import prisma from '../lib/prisma';

async function main() {
  try {
    const authUsers = await prisma.$queryRawUnsafe(
      'SELECT id, email, role, status, full_name FROM auth.users'
    );
    console.log('Auth Users:', authUsers);
  } catch (err) {
    console.error('Error querying auth.users:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
