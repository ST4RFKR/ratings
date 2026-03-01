import prisma from '@/prisma/prisma-client';
import { ApiErrors } from '@/shared/lib/server/api-error';
import { withApiGuard } from '@/shared/lib/server/with-api-guard';
import { NextRequest, NextResponse } from 'next/server';

type ScoreCategory = 'SPEED' | 'POLITENESS' | 'QUALITY' | 'PROFESSIONALISM' | 'CLEANLINESS';
const RADAR_ORDER: ScoreCategory[] = ['SPEED', 'POLITENESS', 'QUALITY', 'PROFESSIONALISM', 'CLEANLINESS'];

function monthKey(date: Date) {
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}`;
}

function createScoreAccumulator() {
  return {
    SPEED: { sum: 0, count: 0 },
    POLITENESS: { sum: 0, count: 0 },
    QUALITY: { sum: 0, count: 0 },
    PROFESSIONALISM: { sum: 0, count: 0 },
    CLEANLINESS: { sum: 0, count: 0 },
  } satisfies Record<ScoreCategory, { sum: number; count: number }>;
}

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
        const scoreAccumulator = createScoreAccumulator();
        const now = new Date();
        const monthlyTemplate = Array.from({ length: 6 }).map((_, index) => {
          const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
          return {
            key: monthKey(date),
            reviews: 0,
            totalRating: 0,
          };
        });
        const monthlyMap = new Map(monthlyTemplate.map((item) => [item.key, item]));

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

        const recentRatings = reviews
          .slice(0, 12)
          .reverse()
          .map((review) => {
            const avg = review.scores.length
              ? Number((review.scores.reduce((acc, score) => acc + score.value, 0) / review.scores.length).toFixed(2))
              : 0;

            return {
              label: review.createdAt.toISOString(),
              rating: avg,
            };
          });

        for (const review of reviews) {
          const reviewAverage = review.scores.length
            ? review.scores.reduce((sum, score) => sum + score.value, 0) / review.scores.length
            : 0;

          const month = monthlyMap.get(monthKey(review.createdAt));
          if (month) {
            month.reviews += 1;
            month.totalRating += reviewAverage;
          }

          for (const score of review.scores) {
            const category = score.category as ScoreCategory;
            scoreAccumulator[category].sum += score.value;
            scoreAccumulator[category].count += 1;
          }
        }

        const monthlyTrend = monthlyTemplate.map((item) => ({
          key: item.key,
          reviews: item.reviews,
          averageRating: item.reviews ? Number((item.totalRating / item.reviews).toFixed(2)) : 0,
        }));

        const criteria = RADAR_ORDER.map((category) => ({
          category,
          value: scoreAccumulator[category].count
            ? Number((scoreAccumulator[category].sum / scoreAccumulator[category].count).toFixed(2))
            : 0,
        }));

        return NextResponse.json(
          {
            location,
            kpi: {
              totalReviews,
              averageRating,
            },
            reviews: reviewRows,
            monthlyTrend,
            recentRatings,
            criteria,
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
