import { faker } from '@faker-js/faker';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'argon2';
import 'dotenv/config';
import { EmployeeRole, EmployeeStatus, PrismaClient, ReviewCategory, UserRole } from './generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding...');

  // -----------------------
  // cleanup
  // -----------------------
  await prisma.reviewScore.deleteMany();
  await prisma.review.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.location.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  // -----------------------
  // users
  // -----------------------
  const password = await hash('password123');

  const users = await Promise.all(
    Array.from({ length: 8 }).map(() =>
      prisma.user.create({
        data: {
          fullName: faker.person.fullName(),
          email: faker.internet.email(),
          password,
          role: faker.helpers.arrayElement([UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]),
          verified: new Date(),
        },
      }),
    ),
  );

  // -----------------------
  // company
  // -----------------------
  const company = await prisma.company.create({
    data: {
      name: 'Test Company',
      industry: 'Restaurant',
      address: faker.location.streetAddress(),
      joinCode: faker.string.alphanumeric(6),
      ownerId: users[0].id,
    },
  });

  // -----------------------
  // locations
  // -----------------------
  const locations = await Promise.all(
    Array.from({ length: 2 }).map(() =>
      prisma.location.create({
        data: {
          name: faker.company.name(),
          address: faker.location.streetAddress(),
          industry: 'Restaurant',
          companyId: company.id,
        },
      }),
    ),
  );

  // -----------------------
  // employees
  // -----------------------
  const employees = await Promise.all(
    users.map((user, i) =>
      prisma.employee.create({
        data: {
          fullName: user.fullName,
          userId: user.id,
          companyId: company.id,
          locationId: faker.helpers.arrayElement(locations).id,
          role: faker.helpers.arrayElement(Object.values(EmployeeRole)),
          status: EmployeeStatus.ACTIVE,
        },
      }),
    ),
  );

  // -----------------------
  // reviews + scores
  // -----------------------
  for (let i = 0; i < 20; i++) {
    const employee = faker.helpers.arrayElement(employees);

    await prisma.review.create({
      data: {
        employeeId: employee.id,
        comment: faker.lorem.sentence(),

        scores: {
          create: [
            {
              category: ReviewCategory.SPEED,
              value: faker.number.int({ min: 3, max: 5 }),
            },
            {
              category: ReviewCategory.POLITENESS,
              value: faker.number.int({ min: 3, max: 5 }),
            },
            {
              category: ReviewCategory.QUALITY,
              value: faker.number.int({ min: 3, max: 5 }),
            },
          ],
        },
      },
    });
  }

  console.log('✅ Done');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
