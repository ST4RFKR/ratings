import { slug } from '@/shared/lib/server/slugify';
import { faker } from '@faker-js/faker';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'argon2';
import 'dotenv/config';
import { EmployeeRole, EmployeeStatus, PrismaClient, ReviewCategory, UserRole } from './generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = new PrismaClient({ adapter });
const USERS_COUNT = 28;
const LOCATIONS_COUNT = 6;
const REVIEWS_COUNT = 420;
const DAYS_HISTORY = 240;

type RatingAccumulator = {
  sum: number;
  count: number;
};

function toAverage(value: RatingAccumulator) {
  if (value.count === 0) {
    return 0;
  }

  return Number((value.sum / value.count).toFixed(2));
}

async function main() {
  console.log('🌱 Seeding...');
  faker.seed(20260226);

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
    Array.from({ length: USERS_COUNT }).map((_, index) =>
      prisma.user.create({
        data: {
          fullName: faker.person.fullName(),
          email: `user${index + 1}@ratings.local`,
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
    Array.from({ length: LOCATIONS_COUNT }).map(() => {
      const locationName = faker.company.name();

      return prisma.location.create({
        data: {
          name: locationName,
          slug: slug(locationName),
          address: faker.location.streetAddress(),
          industry: 'Restaurant',
          companyId: company.id,
          status: 'ACTIVE',
        },
      });
    }),
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
  const reviewEmployees = employees.filter((item) => item.locationId);
  const reviewsStartDate = new Date();
  reviewsStartDate.setDate(reviewsStartDate.getDate() - DAYS_HISTORY);

  const employeeRatings = new Map<string, RatingAccumulator>();
  const locationRatings = new Map<string, RatingAccumulator>();
  const companyRating: RatingAccumulator = { sum: 0, count: 0 };

  // -----------------------
  // reviews + scores
  // -----------------------
  for (let index = 0; index < REVIEWS_COUNT; index += 1) {
    const employee = faker.helpers.arrayElement(reviewEmployees);
    const createdAt = faker.date.between({ from: reviewsStartDate, to: new Date() });
    createdAt.setHours(
      faker.number.int({ min: 9, max: 22 }),
      faker.number.int({ min: 0, max: 59 }),
      faker.number.int({ min: 0, max: 59 }),
      0,
    );

    const speed = faker.number.int({ min: 2, max: 5 });
    const politeness = faker.number.int({ min: 2, max: 5 });
    const quality = faker.number.int({ min: 2, max: 5 });
    const professionalism = faker.number.int({ min: 2, max: 5 });
    const cleanliness = faker.number.int({ min: 2, max: 5 });
    const reviewRating = Number(((speed + politeness + quality + professionalism + cleanliness) / 5).toFixed(2));

    await prisma.review.create({
      data: {
        employeeId: employee.id,
        companyId: employee.companyId,
        locationId: employee.locationId!,
        createdAt,
        comment: faker.datatype.boolean(0.78) ? faker.lorem.sentence() : null,

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
              value: quality,
            },
            {
              category: ReviewCategory.PROFESSIONALISM,
              value: professionalism,
            },
            {
              category: ReviewCategory.CLEANLINESS,
              value: cleanliness,
            },
          ],
        },
      },
    });

    const employeeAccumulator = employeeRatings.get(employee.id) ?? { sum: 0, count: 0 };
    employeeAccumulator.sum += reviewRating;
    employeeAccumulator.count += 1;
    employeeRatings.set(employee.id, employeeAccumulator);

    const locationAccumulator = locationRatings.get(employee.locationId!) ?? { sum: 0, count: 0 };
    locationAccumulator.sum += reviewRating;
    locationAccumulator.count += 1;
    locationRatings.set(employee.locationId!, locationAccumulator);

    companyRating.sum += reviewRating;
    companyRating.count += 1;
  }

  for (const employee of reviewEmployees) {
    const accumulator = employeeRatings.get(employee.id);
    if (!accumulator) {
      continue;
    }

    await prisma.employee.update({
      where: { id: employee.id },
      data: { rating: toAverage(accumulator) },
    });
  }

  for (const location of locations) {
    const accumulator = locationRatings.get(location.id);
    if (!accumulator) {
      continue;
    }

    await prisma.location.update({
      where: { id: location.id },
      data: { rating: toAverage(accumulator) },
    });
  }

  await prisma.company.update({
    where: { id: company.id },
    data: { rating: toAverage(companyRating) },
  });

  console.log('✅ Done');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
