import { EmployeeStatus, LocationStatus } from '@/prisma/generated/prisma/enums';
import prisma from '@/prisma/prisma-client';
import { ApiErrors } from '@/shared/lib/server/api-error';
import { getUserSession } from '@/shared/lib/server/get-user-session';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v3';

const createReviewBodySchema = z.object({
  employeeId: z.string().trim().min(1),
  locationId: z.string().trim().min(1),
  speed: z.number().int().min(1).max(5),
  politeness: z.number().int().min(1).max(5),
  quality: z.number().int().min(1).max(5),
  professionalism: z.number().int().min(1).max(5),
  cleanliness: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
});

function recalculateRating(currentRating: number, totalReviews: number, reviewRating: number) {
  const result = (currentRating * totalReviews + reviewRating) / (totalReviews + 1);

  return Number(result.toFixed(2));
}

const getReviewsQuerySchema = z.object({
  employeeId: z.string().trim().min(1).optional(),
  locationId: z.string().trim().min(1).optional(),
  search: z.string().trim().max(100).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const user = await getUserSession();

    if (!user || !user.activeCompanyId) {
      return ApiErrors.unauthorized('Unauthorized');
    }

    const currentEmployee = await prisma.employee.findFirst({
      where: {
        userId: user.id,
        companyId: user.activeCompanyId,
        status: EmployeeStatus.ACTIVE,
      },
      select: { id: true },
    });

    if (!currentEmployee) {
      return ApiErrors.forbidden('Forbidden');
    }

    const parsedQuery = getReviewsQuerySchema.safeParse({
      employeeId: req.nextUrl.searchParams.get('employeeId') ?? undefined,
      locationId: req.nextUrl.searchParams.get('locationId') ?? undefined,
      search: req.nextUrl.searchParams.get('search') ?? undefined,
    });

    if (!parsedQuery.success) {
      return ApiErrors.badRequest('Invalid reviews filters');
    }

    const reviews = await prisma.review.findMany({
      where: {
        companyId: user.activeCompanyId,
        ...(parsedQuery.data.employeeId ? { employeeId: parsedQuery.data.employeeId } : {}),
        ...(parsedQuery.data.locationId ? { locationId: parsedQuery.data.locationId } : {}),
        ...(parsedQuery.data.search
          ? {
              OR: [
                { employee: { fullName: { contains: parsedQuery.data.search, mode: 'insensitive' } } },
                { location: { name: { contains: parsedQuery.data.search, mode: 'insensitive' } } },
                { comment: { contains: parsedQuery.data.search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        comment: true,
        createdAt: true,
        employee: {
          select: {
            id: true,
            slug: true,
            fullName: true,
          },
        },
        location: {
          select: {
            id: true,
            slug: true,
            name: true,
          },
        },
        scores: {
          select: {
            value: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const payload = reviews.map((review) => {
      const totalScore = review.scores.reduce((sum, score) => sum + score.value, 0);
      const averageScore = review.scores.length ? Number((totalScore / review.scores.length).toFixed(2)) : 0;

      return {
        id: review.id,
        comment: review.comment,
        createdAt: review.createdAt,
        rating: averageScore,
        employee: review.employee,
        location: review.location,
      };
    });

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return ApiErrors.internal('Internal server error');
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserSession();

    if (!user || !user.activeCompanyId) {
      return ApiErrors.unauthorized('Unauthorized');
    }

    const currentEmployee = await prisma.employee.findFirst({
      where: {
        userId: user.id,
        companyId: user.activeCompanyId,
        status: EmployeeStatus.ACTIVE,
      },
      select: { id: true },
    });

    if (!currentEmployee) {
      return ApiErrors.forbidden('Forbidden');
    }

    const rawBody = await req.json();
    const parsedBody = createReviewBodySchema.safeParse(rawBody);

    if (!parsedBody.success) {
      return ApiErrors.badRequest('Invalid review payload');
    }

    const body = parsedBody.data;

    const employee = await prisma.employee.findFirst({
      where: {
        id: body.employeeId,
        companyId: user.activeCompanyId,
        status: EmployeeStatus.ACTIVE,
      },
      select: {
        id: true,
        rating: true,
      },
    });

    if (!employee) {
      return ApiErrors.badRequest('Selected employee is not available for review');
    }

    const location = await prisma.location.findFirst({
      where: {
        id: body.locationId,
        companyId: user.activeCompanyId,
        status: LocationStatus.ACTIVE,
      },
      select: {
        id: true,
        rating: true,
      },
    });

    if (!location) {
      return ApiErrors.badRequest('Invalid employee location');
    }

    const company = await prisma.company.findUnique({
      where: { id: user.activeCompanyId },
      select: {
        id: true,
        rating: true,
      },
    });

    if (!company) {
      return ApiErrors.badRequest('Company not found');
    }

    const reviewRating =
      (body.speed + body.politeness + body.quality + body.professionalism + body.cleanliness) / 5;

    const review = await prisma.$transaction(async (tx) => {
      const [employeeReviewsCount, locationReviewsCount, companyReviewsCount] = await Promise.all([
        tx.review.count({ where: { employeeId: employee.id } }),
        tx.review.count({ where: { locationId: location.id } }),
        tx.review.count({ where: { companyId: company.id } }),
      ]);

      const newReview = await tx.review.create({
        data: {
          employeeId: employee.id,
          locationId: location.id,
          companyId: company.id,
          comment: body.comment || null,
          scores: {
            create: [
              { category: 'SPEED', value: body.speed },
              { category: 'POLITENESS', value: body.politeness },
              { category: 'QUALITY', value: body.quality },
              { category: 'PROFESSIONALISM', value: body.professionalism },
              { category: 'CLEANLINESS', value: body.cleanliness },
            ],
          },
        },
        include: {
          scores: true,
        },
      });

      await Promise.all([
        tx.employee.update({
          where: { id: employee.id },
          data: {
            rating: recalculateRating(employee.rating, employeeReviewsCount, reviewRating),
          },
        }),
        tx.location.update({
          where: { id: location.id },
          data: {
            rating: recalculateRating(location.rating, locationReviewsCount, reviewRating),
          },
        }),
        tx.company.update({
          where: { id: company.id },
          data: {
            rating: recalculateRating(company.rating, companyReviewsCount, reviewRating),
          },
        }),
      ]);

      return newReview;
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return ApiErrors.internal('Internal server error');
  }
}
