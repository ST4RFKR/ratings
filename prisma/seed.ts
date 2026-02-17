import { slug } from '@/shared/lib/server/slugify';
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
          role: faker.helpers.arrayElement([UserRole.ADMIN, UserRole.USER]),
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
      slug: slug('Test Company'),
      industry: 'Restaurant',
      address: faker.location.streetAddress(),
      joinCode: faker.string.alphanumeric(6),
      ownerId: users[0].id,
      status: 'ACTIVE',
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
          slug: slug(faker.company.name()),
          address: faker.location.streetAddress(),
          industry: 'Restaurant',
          companyId: company.id,
          status: 'ACTIVE',
        },
      }),
    ),
  );

  // -----------------------
  // employees
  // -----------------------
  const ownerEmployee = await prisma.employee.create({
    data: {
      fullName: users[0].fullName,
      slug: slug(`${users[0].fullName}-${users[0].id.slice(0, 8)}`),
      userId: users[0].id,
      companyId: company.id,
      role: EmployeeRole.OWNER,
      status: EmployeeStatus.ACTIVE,
    },
  });

  await prisma.user.update({
    where: { id: users[0].id },
    data: { activeCompanyId: company.id },
  });

  const staffRoles = Object.values(EmployeeRole).filter((role) => role !== EmployeeRole.OWNER);

  const otherEmployees = await Promise.all(
    users.slice(1).map((user) =>
      prisma.employee.create({
        data: {
          fullName: user.fullName,
          slug: slug(`${user.fullName}-${user.id.slice(0, 8)}`),
          userId: user.id,
          companyId: company.id,
          locationId: faker.helpers.arrayElement(locations).id,
          role: faker.helpers.arrayElement(staffRoles),
          status: EmployeeStatus.ACTIVE,
        },
      }),
    ),
  );

  const employees = [ownerEmployee, ...otherEmployees];

  // -----------------------
  // reviews + scores
  // -----------------------
  for (let i = 0; i < 20; i++) {
    const employee = faker.helpers.arrayElement(employees.filter((item) => item.locationId));

    await prisma.review.create({
      data: {
        employeeId: employee.id,
        companyId: employee.companyId,
        locationId: employee.locationId!,
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
