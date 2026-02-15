import { faker } from '@faker-js/faker';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'argon2';
import 'dotenv/config';
import { PrismaClient, UserRole } from './generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // -----------------------
  // 0️⃣ Удаляем все данные
  // -----------------------
  await prisma.store.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.user.deleteMany({});

  // -----------------------
  // 1️⃣ Создаем пользователей
  // -----------------------
  const password = await hash('password123');

  const [admin1, admin2, manager1, manager2, user1, user2] = await Promise.all([
    prisma.user.create({
      data: {
        fullName: 'John Admin',
        email: 'admin1@test.com',
        password,
        role: UserRole.ADMIN,
        verified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        fullName: 'Sarah Admin',
        email: 'admin2@test.com',
        password,
        role: UserRole.ADMIN,
        verified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        fullName: 'Mike Manager',
        email: 'manager1@test.com',
        password,
        role: UserRole.MANAGER,
        verified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        fullName: 'Lisa Manager',
        email: 'manager2@test.com',
        password,
        role: UserRole.MANAGER,
        verified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        fullName: 'Bob User',
        email: 'user1@test.com',
        password,
        role: UserRole.USER,
        verified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        fullName: 'Alice User',
        email: 'user2@test.com',
        password,
        role: UserRole.USER,
        verified: new Date(),
      },
    }),
  ]);

  // -----------------------
  // 2️⃣ Создаем компании
  // -----------------------

  // Admin 1 - 2 компании
  const techCorp = await prisma.company.create({
    data: {
      name: 'TechCorp',
      address: '123 Tech Street, Silicon Valley',
      rating: 4.5,
      description: 'Leading tech solutions and innovation',
      industry: 'Technology',
      ownerId: admin1.id,
    },
  });

  const cloudSystems = await prisma.company.create({
    data: {
      name: 'CloudSystems',
      address: '789 Cloud Avenue, San Francisco',
      rating: 4.7,
      description: 'Cloud infrastructure and services',
      industry: 'Technology',
      ownerId: admin1.id,
    },
  });

  // Admin 2 - 1 компания
  const retailChain = await prisma.company.create({
    data: {
      name: 'MegaRetail Chain',
      address: '456 Shopping Blvd, New York',
      rating: 4.3,
      description: 'National retail chain with premium products',
      industry: 'Retail',
      ownerId: admin2.id,
    },
  });

  // Manager 1 - 2 компании
  const foodiesInc = await prisma.company.create({
    data: {
      name: 'Foodies Inc',
      address: '456 Gourmet Ave, Los Angeles',
      rating: 4.2,
      description: 'Delicious food products and catering',
      industry: 'Food & Beverage',
      ownerId: manager1.id,
    },
  });

  const organicMarket = await prisma.company.create({
    data: {
      name: 'Organic Market Co',
      address: '321 Green Street, Portland',
      rating: 4.6,
      description: 'Fresh organic products',
      industry: 'Food & Beverage',
      ownerId: manager1.id,
    },
  });

  // Manager 2 - 1 компания
  const fashionHub = await prisma.company.create({
    data: {
      name: 'Fashion Hub',
      address: '999 Style Avenue, Miami',
      rating: 4.4,
      description: 'Trendy fashion and accessories',
      industry: 'Fashion',
      ownerId: manager2.id,
    },
  });

  // User 1 - 1 компания
  const localCafe = await prisma.company.create({
    data: {
      name: 'Local Cafe',
      address: '111 Coffee Lane, Seattle',
      rating: 4.1,
      description: 'Cozy neighborhood cafe',
      industry: 'Food & Beverage',
      ownerId: user1.id,
    },
  });

  const companies = [techCorp, cloudSystems, retailChain, foodiesInc, organicMarket, fashionHub, localCafe];

  // -----------------------
  // 3️⃣ Устанавливаем активные компании
  // -----------------------
  await prisma.user.update({
    where: { id: admin1.id },
    data: { activeCompanyId: techCorp.id },
  });

  await prisma.user.update({
    where: { id: admin2.id },
    data: { activeCompanyId: retailChain.id },
  });

  await prisma.user.update({
    where: { id: manager1.id },
    data: { activeCompanyId: foodiesInc.id },
  });

  await prisma.user.update({
    where: { id: manager2.id },
    data: { activeCompanyId: fashionHub.id },
  });

  await prisma.user.update({
    where: { id: user1.id },
    data: { activeCompanyId: localCafe.id },
  });

  // -----------------------
  // 4️⃣ Генерируем магазины для каждой компании
  // -----------------------
  const storesData = [];

  // Распределение магазинов:
  const storesPerCompany = [5, 4, 6, 3, 3, 4, 2]; // Всего 27 магазинов

  companies.forEach((company, companyIndex) => {
    const storeCount = storesPerCompany[companyIndex];

    for (let i = 1; i <= storeCount; i++) {
      storesData.push({
        name: `${company.name} - Branch ${i}`,
        email: faker.internet.email().toLowerCase(),
        address: faker.location.streetAddress(),
        rating: parseFloat(faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }).toFixed(1)),
        employeesCount: faker.number.int({ min: 5, max: 50 }),
        totalReview: faker.number.int({ min: 10, max: 200 }),
        description: faker.company.catchPhrase(),
        industry: company.industry,
        companyId: company.id,
      });
    }
  });

  await prisma.store.createMany({
    data: storesData,
  });

  // -----------------------
  // 📊 Статистика
  // -----------------------
  console.log('\n✅ Seed завершен успешно!\n');
  console.log('📊 Создано:');
  console.log(`   👥 Пользователей: 6`);
  console.log(`      - Админов: 2 (admin1@test.com, admin2@test.com)`);
  console.log(`      - Менеджеров: 2 (manager1@test.com, manager2@test.com)`);
  console.log(`      - Пользователей: 2 (user1@test.com, user2@test.com)`);
  console.log(`   🏢 Компаний: ${companies.length}`);
  console.log(`      - admin1: TechCorp, CloudSystems`);
  console.log(`      - admin2: MegaRetail Chain`);
  console.log(`      - manager1: Foodies Inc, Organic Market Co`);
  console.log(`      - manager2: Fashion Hub`);
  console.log(`      - user1: Local Cafe`);
  console.log(`   🏪 Магазинов: ${storesData.length}`);
  console.log(`\n🔑 Пароль для всех: password123\n`);
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
