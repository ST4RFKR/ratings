import prisma from '@/prisma/prisma-client';
import { ApiErrors } from '@/shared/lib/server/api-error';
import { withApiGuard } from '@/shared/lib/server/with-api-guard';
import { NextRequest, NextResponse } from 'next/server';

type ScoreCategory = 'SPEED' | 'POLITENESS' | 'QUALITY' | 'PROFESSIONALISM' | 'CLEANLINESS';

function createReviewScoreMap() {
  return {
    speed: 0,
    politeness: 0,
    quality: 0,
    professionalism: 0,
    cleanliness: 0,
  };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiGuard<{ id: string }>(
    async ({ companyId, params }) => {
      try {
        const location = await prisma.location.findFirst({
          where: {
            slug: params.id,
            companyId: companyId!,
          },
          select: {
            id: true,
            name: true,
            slug: true,
            address: true,
          },
        });

        if (!location) {
          return ApiErrors.notFound('Location not found');
        }

        const reviews = await prisma.review.findMany({
          where: {
            companyId: companyId!,
            locationId: location.id,
          },
          select: {
            id: true,
            comment: true,
            createdAt: true,
            employee: {
              select: {
                id: true,
                fullName: true,
              },
            },
            scores: {
              select: {
                category: true,
                value: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        const totalReviews = reviews.length;
        const totalRatingsSum = reviews.reduce((sum, review) => {
          if (!review.scores.length) {
            return sum;
          }

          const avg = review.scores.reduce((acc, score) => acc + score.value, 0) / review.scores.length;
          return sum + avg;
        }, 0);
        const averageRating = totalReviews ? Number((totalRatingsSum / totalReviews).toFixed(2)) : 0;

        const reviewRows = reviews.map((review) => {
          const scores = createReviewScoreMap();

          for (const score of review.scores) {
            const category = score.category as ScoreCategory;
            if (category === 'SPEED') scores.speed = score.value;
            if (category === 'POLITENESS') scores.politeness = score.value;
            if (category === 'QUALITY') scores.quality = score.value;
            if (category === 'PROFESSIONALISM') scores.professionalism = score.value;
            if (category === 'CLEANLINESS') scores.cleanliness = score.value;
          }

          const average = review.scores.length
            ? Number((review.scores.reduce((sum, score) => sum + score.value, 0) / review.scores.length).toFixed(2))
            : 0;

          return {
            id: review.id,
            employeeId: review.employee.id,
            employeeName: review.employee.fullName,
            comment: review.comment,
            createdAt: review.createdAt.toISOString(),
            averageRating: average,
            scores,
          };
        });

        return NextResponse.json(
          {
            location,
            kpi: {
              totalReviews,
              averageRating,
            },
            reviews: reviewRows,
          },
          { status: 200 },
        );
      } catch (error) {
        console.error('Error fetching location stats:', error);
        return ApiErrors.internal('Internal server error');
      }
    },
    {
      requireActiveCompany: true,
      requireActiveEmployee: true,
    },
  )(req, { params });
}
