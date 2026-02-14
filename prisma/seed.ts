import { faker } from '@faker-js/faker';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    // -----------------------
    // 1️⃣ Создаем пользователей
    // -----------------------
    const user1 = await prisma.user.create({
        data: {
            fullName: 'Alice Johnson',
            email: 'alice@example.com',
            password: 'password123',
        },
    });

    const user2 = await prisma.user.create({
        data: {
            fullName: 'Bob Smith',
            email: 'bob@example.com',
            password: 'password456',
        },
    });

    // -----------------------
    // 2️⃣ Создаем 2 компании
    // -----------------------
    const company1 = await prisma.company.create({
        data: {
            name: 'TechCorp',
            address: '123 Tech Street',
            rating: 4.5,
            description: 'Leading tech solutions',
            industry: 'Technology',
            ownerId: user1.id,
        },
    });

    const company2 = await prisma.company.create({
        data: {
            name: 'Foodies Inc',
            address: '456 Gourmet Ave',
            rating: 4.2,
            description: 'Delicious food products',
            industry: 'Food & Beverage',
            ownerId: user2.id,
        },
    });

    // -----------------------
    // 3️⃣ Генерируем 20 магазинов
    // -----------------------
    const storesData = [];

    for (let i = 1; i <= 20; i++) {
        const company = i <= 10 ? company1 : company2; // 10 магазинов на каждую компанию
        storesData.push({
            name: `${company.name} Store ${i}`,
            email: faker.internet.email(),
            address: faker.location.streetAddress(),
            rating: parseFloat(faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }).toFixed(1)),
            employeesCount: faker.number.int({ min: 5, max: 50 }),
            totalReview: faker.number.int({ min: 10, max: 200 }),
            description: faker.lorem.sentence(),
            industry: company.industry,
            companyId: company.id,
        });
    }

    await prisma.store.createMany({
        data: storesData,
    });

    console.log('✅ Seed: 2 компании и 20 магазинов создано!');
}

main()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
