'use client';

import { useGetAllCompanyByUser } from '@/features/company/get-user-company/model/use-get-user-all-company';
import { useGetEmployees } from '@/features/employee/get-employes';
import { useGetLocation } from '@/features/location/get-location/model/use-get-location';
import { useGetReviews } from '@/features/review/get-reviews';
import { JoinCodeBadge } from '@/shared/components/common/join-code-badge';
import { Badge, Card, ChartContainer, ChartTooltip, ChartTooltipContent, Skeleton } from '@/shared/components/ui';
import { CircleDotDashed, LayoutDashboard, MapPin, MessageSquareMore, Star, TrendingUp, Trophy, Users } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const REVIEW_WAVE_COLOR = 'var(--primary)';

function toDayKey(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function toPercent(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function toSharePercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getAverage(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

export default function Page() {
  const t = useTranslations('dashboard.main');
  const td = useTranslations('dashboard');
  const locale = useLocale();
  const session = useSession();
  const reviewsQuery = useGetReviews({});
  const employeesQuery = useGetEmployees();
  const locationsQuery = useGetLocation();
  const companiesQuery = useGetAllCompanyByUser();

  const inviteCode = useMemo(() => {
    type CompanyLike = { id: string; joinCode?: string | null };
    const companies = (companiesQuery.data ?? []) as CompanyLike[];
    const activeCompanyId = session.data?.user?.activeCompanyId;
    const activeCompany = activeCompanyId ? companies.find((item) => item.id === activeCompanyId) : null;

    return activeCompany?.joinCode ?? companies[0]?.joinCode ?? null;
  }, [companiesQuery.data, session.data?.user?.activeCompanyId]);

  const isLoading = reviewsQuery.isLoading || employeesQuery.isLoading || locationsQuery.isLoading;

  const {
    reviewWave,
    categoryStats,
    totalReviews,
    avgLocationRating,
    avgEmployeeRating,
    activeLocations,
    activeEmployees,
    reviewsDeltaPercent,
    bestLocation,
    bestEmployee,
  } = useMemo(() => {
    const reviews = reviewsQuery.data ?? [];
    const employees = employeesQuery.data ?? [];
    const locations = locationsQuery.data ?? [];

    const totalReviewsCount = reviews.length;
    const activeLocationItems = locations.filter((item) => item.status === 'ACTIVE');
    const activeEmployeeItems = employees.filter((item) => item.status === 'ACTIVE');
    const activeLocationsCount = activeLocationItems.length;
    const activeEmployeesCount = activeEmployeeItems.length;

    const averageLocationRating = getAverage(activeLocationItems.map((item) => item.rating));
    const averageEmployeeRating = getAverage(activeEmployeeItems.map((item) => item.rating));

    const today = startOfDay(new Date());
    const dayMs = 1000 * 60 * 60 * 24;
    const latestReviewTs =
      reviews.length > 0 ? Math.max(...reviews.map((review) => new Date(review.createdAt).getTime())) : today.getTime();
    const latestReviewDay = startOfDay(new Date(latestReviewTs));
    const chartEndDate = latestReviewDay;

    const dailyTemplate = Array.from({ length: 7 }).map((_, offset) => {
      const date = new Date(chartEndDate.getFullYear(), chartEndDate.getMonth(), chartEndDate.getDate() - (6 - offset));
      return {
        key: toDayKey(date),
        day: date.toLocaleDateString(locale, { weekday: 'short' }),
        reviews: 0,
      };
    });
    const dailyMap = new Map(dailyTemplate.map((item) => [item.key, item]));

    let currentWeekReviews = 0;
    let previousWeekReviews = 0;
    const windowEndTs = chartEndDate.getTime();

    const locationReviewsMap = new Map<string, number>();
    const ratingBuckets = [
      { label: t('rating_distribution.buckets.five'), min: 4.5, max: 5.01, count: 0 },
      { label: t('rating_distribution.buckets.four'), min: 3.5, max: 4.5, count: 0 },
      { label: t('rating_distribution.buckets.three'), min: 2.5, max: 3.5, count: 0 },
      { label: t('rating_distribution.buckets.two'), min: 1.5, max: 2.5, count: 0 },
      { label: t('rating_distribution.buckets.one'), min: 0, max: 1.5, count: 0 },
    ];

    for (const review of reviews) {
      const created = new Date(review.createdAt);
      const ageInDays = Math.floor((windowEndTs - startOfDay(created).getTime()) / dayMs);
      const day = dailyMap.get(toDayKey(created));
      if (day) {
        day.reviews += 1;
      }
      if (ageInDays >= 0 && ageInDays <= 6) {
        currentWeekReviews += 1;
      } else if (ageInDays >= 7 && ageInDays <= 13) {
        previousWeekReviews += 1;
      }

      locationReviewsMap.set(review.location.id, (locationReviewsMap.get(review.location.id) ?? 0) + 1);

      const bucket = ratingBuckets.find((item) => review.rating >= item.min && review.rating < item.max);
      if (bucket) {
        bucket.count += 1;
      }
    }

    const reviewsDelta =
      previousWeekReviews > 0
        ? ((currentWeekReviews - previousWeekReviews) / previousWeekReviews) * 100
        : currentWeekReviews > 0
          ? 100
          : 0;

    const bestLocationByReviews =
      locations
        .map((location) => ({
          id: location.id,
          name: location.name,
          rating: Number(location.rating.toFixed(2)),
          reviews: locationReviewsMap.get(location.id) ?? 0,
        }))
        .sort((a, b) => b.reviews - a.reviews || b.rating - a.rating)[0] ?? null;

    const bestEmployeeByReviews =
      employees
        .map((employee) => ({
          id: employee.id,
          name: employee.fullName,
          role: employee.role,
          rating: Number(employee.rating.toFixed(2)),
          reviews: employee._count.reviews,
        }))
        .sort((a, b) => b.reviews - a.reviews || b.rating - a.rating)[0] ?? null;

    const bucketStats = ratingBuckets.map((item) => {
      const sharePercent = totalReviewsCount > 0 ? (item.count / totalReviewsCount) * 100 : 0;

      return {
        label: item.label,
        count: item.count,
        sharePercent,
        shareLabel: toSharePercent(sharePercent),
      };
    });

    return {
      reviewWave: dailyTemplate,
      categoryStats: bucketStats,
      totalReviews: totalReviewsCount,
      avgLocationRating: averageLocationRating,
      avgEmployeeRating: averageEmployeeRating,
      activeLocations: activeLocationsCount,
      activeEmployees: activeEmployeesCount,
      reviewsDeltaPercent: reviewsDelta,
      bestLocation: bestLocationByReviews,
      bestEmployee: bestEmployeeByReviews,
    };
  }, [employeesQuery.data, locale, locationsQuery.data, reviewsQuery.data, t]);

  const reviewsDeltaLabel = toPercent(reviewsDeltaPercent);
  const isError = reviewsQuery.isError || employeesQuery.isError || locationsQuery.isError;

  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
      <div className='grid gap-6 p-6 lg:grid-cols-[1.5fr_1fr]'>
        <div className='space-y-4'>
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <LayoutDashboard className='h-6 w-6' />
                <h1 className='text-2xl font-semibold'>{t('title')}</h1>
              </div>
              <p className='max-w-xl text-sm text-muted-foreground'>{t('description')}</p>
            </div>
            <div className='flex items-center gap-2 rounded-xl border bg-background/80 px-3 py-2 backdrop-blur'>
              <span className='text-xs font-medium text-muted-foreground'>{t('invite_code')}</span>
              {companiesQuery.isLoading ? <Skeleton className='h-6 w-20 rounded-full' /> : null}
              {!companiesQuery.isLoading && inviteCode ? <JoinCodeBadge code={inviteCode} /> : null}
              {!companiesQuery.isLoading && !inviteCode ? (
                <Badge variant='outline' className='text-xs'>
                  {t('not_available')}
                </Badge>
              ) : null}
            </div>
          </div>

          <div className='grid gap-2 sm:grid-cols-2 xl:grid-cols-5'>
            <div className='rounded-xl border border-border/60 bg-background/70 p-3'>
              <div className='mb-2 flex items-center justify-between text-muted-foreground'>
                <MessageSquareMore className='h-4 w-4' />
                <span className='text-xs'>{t('kpi.review_period_short')}</span>
              </div>
              {isLoading ? <Skeleton className='h-7 w-14' /> : <div className='text-xl font-semibold'>{totalReviews}</div>}
              <div className='text-xs text-muted-foreground'>{t('total_reviews')}</div>
            </div>

            <div className='rounded-xl border border-border/60 bg-background/70 p-3'>
              <div className='mb-2 flex items-center justify-between text-muted-foreground'>
                <Star className='h-4 w-4' />
                <span className='text-xs'>{t('kpi.average_short')}</span>
              </div>
              {isLoading ? (
                <Skeleton className='h-7 w-16' />
              ) : (
                <div className='text-xl font-semibold'>{avgLocationRating.toFixed(2)}</div>
              )}
              <div className='text-xs text-muted-foreground'>{`${t('avg_rating')} (${td('nav.locations')})`}</div>
            </div>

            <div className='rounded-xl border border-border/60 bg-background/70 p-3'>
              <div className='mb-2 flex items-center justify-between text-muted-foreground'>
                <Star className='h-4 w-4' />
                <span className='text-xs'>{t('kpi.average_short')}</span>
              </div>
              {isLoading ? (
                <Skeleton className='h-7 w-16' />
              ) : (
                <div className='text-xl font-semibold'>{avgEmployeeRating.toFixed(2)}</div>
              )}
              <div className='text-xs text-muted-foreground'>{`${t('avg_rating')} (${td('nav.employees')})`}</div>
            </div>

            <div className='rounded-xl border border-border/60 bg-background/70 p-3'>
              <div className='mb-2 flex items-center justify-between text-muted-foreground'>
                <MapPin className='h-4 w-4' />
                <span className='text-xs'>{t('kpi.live_short')}</span>
              </div>
              {isLoading ? <Skeleton className='h-7 w-12' /> : <div className='text-xl font-semibold'>{activeLocations}</div>}
              <div className='text-xs text-muted-foreground'>{t('active_locations')}</div>
            </div>

            <div className='rounded-xl border border-border/60 bg-background/70 p-3'>
              <div className='mb-2 flex items-center justify-between text-muted-foreground'>
                <Users className='h-4 w-4' />
                <span className='text-xs'>{t('kpi.team_short')}</span>
              </div>
              {isLoading ? (
                <Skeleton className='h-7 w-14' />
              ) : (
                <div className='text-xl font-semibold'>{activeEmployees}</div>
              )}
              <div className='text-xs text-muted-foreground'>{t('total_employees')}</div>
            </div>
          </div>
        </div>

        <div className='rounded-2xl border border-border/70 bg-card/90 p-4'>
          <div className='mb-4 flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium'>{t('review_wave.title')}</p>
              <p className='text-xs text-muted-foreground'>{t('last-7-days')}</p>
            </div>
            <Badge variant='secondary' className='gap-1'>
              <TrendingUp className='h-3 w-3' />
              {reviewsDeltaLabel}
            </Badge>
          </div>
          {isLoading ? (
            <div className='flex h-36 items-end gap-2'>
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className='flex flex-1 flex-col items-center gap-1'>
                  <Skeleton className='h-full w-full rounded-md' />
                  <Skeleton className='h-2 w-7' />
                </div>
              ))}
            </div>
          ) : (
            <ChartContainer
              className='h-36 w-full'
              config={{
                reviews: { label: t('total_reviews'), color: REVIEW_WAVE_COLOR },
              }}
            >
              <AreaChart data={reviewWave}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey='day' tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Area
                  type='monotone'
                  dataKey='reviews'
                  fill='var(--color-reviews)'
                  fillOpacity={0.25}
                  stroke='var(--color-reviews)'
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          )}
        </div>
      </div>

      <div className='grid gap-4 xl:grid-cols-[1fr_1.3fr]'>
        <Card className='gap-4 p-5'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-lg font-semibold'>{td('stats.title')}</h2>
              <p className='text-sm text-muted-foreground'>{t('last-7-days')}</p>
            </div>
            <Trophy className='h-5 w-5 text-muted-foreground animate-[trophy_1.9s_ease-in-out_infinite]' />
          </div>

          <div className='space-y-3'>
            <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400/20 via-transparent to-sky-400/20 p-[1px] shadow-[0_0_0_1px_rgba(148,163,184,0.2)]'>
              <div className='pointer-events-none absolute inset-0 [mask:linear-gradient(120deg,transparent,white,transparent)] animate-[shine_6s_linear_infinite] opacity-70'>
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent' />
              </div>
              <div className='rounded-2xl border bg-background/95 p-3'>
                <div className='flex items-center justify-between'>
                  <p className='text-sm font-medium'>{td('locations.analytics.top_location')}</p>
                  <Badge variant='secondary' className='text-[10px] uppercase tracking-wide'>
                    {td('locations.title')}
                  </Badge>
                </div>
                {!isLoading && bestLocation ? (
                  <div className='mt-2 space-y-1'>
                    <p className='text-sm font-semibold'>{bestLocation.name}</p>
                    <div className='flex items-center justify-between text-xs text-muted-foreground'>
                      <span>{t('total_reviews')}</span>
                      <span>{bestLocation.reviews}</span>
                    </div>
                    <div className='flex items-center justify-between text-xs text-muted-foreground'>
                      <span>{t('avg_rating')}</span>
                      <span>{bestLocation.rating.toFixed(2)}</span>
                    </div>
                  </div>
                ) : null}
                {isLoading ? <Skeleton className='mt-2 h-12 w-full' /> : null}
                {!isLoading && !bestLocation ? (
                  <p className='mt-2 text-sm text-muted-foreground'>{t('not_available')}</p>
                ) : null}
              </div>
            </div>

            <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400/20 via-transparent to-indigo-400/20 p-[1px] shadow-[0_0_0_1px_rgba(148,163,184,0.2)]'>
              <div className='pointer-events-none absolute inset-0 [mask:linear-gradient(120deg,transparent,white,transparent)] animate-[shine_6s_linear_infinite] opacity-70'>
                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent' />
              </div>
              <div className='rounded-2xl border bg-background/95 p-3'>
                <div className='flex items-center justify-between'>
                  <p className='text-sm font-medium'>{td('employees.analytics.top_employee')}</p>
                  <Badge variant='secondary' className='text-[10px] uppercase tracking-wide'>
                    {td('employees.title')}
                  </Badge>
                </div>
                {!isLoading && bestEmployee ? (
                  <div className='mt-2 space-y-1'>
                    <p className='text-sm font-semibold'>{bestEmployee.name}</p>
                    <p className='text-xs text-muted-foreground'>{bestEmployee.role}</p>
                    <div className='flex items-center justify-between text-xs text-muted-foreground'>
                      <span>{t('total_reviews')}</span>
                      <span>{bestEmployee.reviews}</span>
                    </div>
                    <div className='flex items-center justify-between text-xs text-muted-foreground'>
                      <span>{t('avg_rating')}</span>
                      <span>{bestEmployee.rating.toFixed(2)}</span>
                    </div>
                  </div>
                ) : null}
                {isLoading ? <Skeleton className='mt-2 h-12 w-full' /> : null}
                {!isLoading && !bestEmployee ? (
                  <p className='mt-2 text-sm text-muted-foreground'>{t('not_available')}</p>
                ) : null}
              </div>
            </div>
          </div>
        </Card>

        <Card className='gap-4 p-5'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-lg font-semibold'>{t('rating_distribution.title')}</h2>
              <p className='text-sm text-muted-foreground'>{t('rating_distribution.description')}</p>
            </div>
            <CircleDotDashed className='h-5 w-5 text-muted-foreground' />
          </div>
          <div className='space-y-3'>
            {categoryStats.map((item) => (
              <div key={item.label} className='space-y-1'>
                <div className='flex items-center justify-between gap-3'>
                  <p className='text-sm font-medium'>{item.label}</p>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-muted-foreground'>{item.count}</span>
                    <Badge variant='secondary'>{item.shareLabel}</Badge>
                  </div>
                </div>
                <div className='h-2 rounded-full bg-muted'>
                  <div
                    className='h-full rounded-full bg-gradient-to-r from-chart-2 to-primary'
                    style={{ width: `${Math.max(0, Math.min(item.sharePercent, 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {isError ? <p className='text-sm text-destructive'>{t('error')}</p> : null}
    </div>
  );
}
