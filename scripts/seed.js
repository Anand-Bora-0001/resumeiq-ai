const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding mock user...");
  
  await prisma.user.upsert({
    where: { clerkId: 'mock_user_1' },
    update: {},
    create: {
      clerkId: 'mock_user_1',
      email: 'mock@example.com',
      firstName: 'Mock',
      lastName: 'User',
      imageUrl: 'https://i.pravatar.cc/150?u=mock',
      plan: 'FREE'
    }
  });

  console.log("Mock user seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
