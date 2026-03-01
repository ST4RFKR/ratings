'use client';

import { useGetAllCompanyByUser } from '@/features/company/get-user-company/model/use-get-user-all-company';
import { useGetEmployees } from '@/features/employee/get-employes';
import { useGetLocation } from '@/features/location/get-location/model/use-get-location';
import { useGetReviews } from '@/features/review/get-reviews';
import { JoinCodeBadge } from '@/shared/components/common/join-code-badge';
import { Badge, Card, ChartContainer, ChartTooltip, ChartTooltipContent, Skeleton } from '@/shared/components/ui';
import {
  AlertTriangle,
  CircleDotDashed,
  LayoutDashboard,
  MapPin,
  MessageSquareMore,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const REVIEW_WAVE_COLOR = 'var(--primary)';

function getDeltaTone(value: number) {
  return value >= 0
    ? 'text-emerald-700 bg-emerald-500/10 dark:text-emerald-400'
    : 'text-amber-700 bg-amber-500/10 dark:text-amber-400';
}

function toDayKey(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function toPercent(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default function Page() {
  const t = useTranslations('dashboard.main');
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
    locationPulse,
    teamWatch,
    totalReviews,
    averageRating,
    activeLocations,
    activeEmployees,
    reviewsDeltaPercent,
  } = useMemo(() => {
    const reviews = reviewsQuery.data ?? [];
    const employees = employeesQuery.data ?? [];
    const locations = locationsQuery.data ?? [];

    const totalReviewsCount = reviews.length;
    const avgRating =
      totalReviewsCount > 0
        ? Number((reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviewsCount).toFixed(2))
        : 0;

    const activeLocationsCount = locations.filter((item) => item.status === 'ACTIVE').length;
    const activeEmployeesCount = employees.filter((item) => item.status === 'ACTIVE').length;

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

    const pulse = locations
      .map((location) => {
        const locationEmployees = employees.filter((employee) => employee.locationId === location.id);
        const locationActiveEmployees = locationEmployees.filter((employee) => employee.status === 'ACTIVE').length;
        return {
          name: location.name,
          rating: Number(location.rating.toFixed(2)),
          reviews: locationReviewsMap.get(location.id) ?? 0,
          activeEmployees: locationActiveEmployees,
        };
      })
      .sort((a, b) => b.reviews - a.reviews)
      .slice(0, 3);

    const watch = employees
      .map((employee) => {
        let alerts = 0;
        if (employee.rating < 4) alerts += 1;
        if (employee.status !== 'ACTIVE') alerts += 1;
        if (employee._count.reviews < 3) alerts += 1;
        return {
          name: employee.fullName,
          role: employee.role,
          rating: Number(employee.rating.toFixed(2)),
          alerts,
        };
      })
      .sort((a, b) => b.alerts - a.alerts || a.rating - b.rating)
      .slice(0, 4);

    const maxBucketCount = Math.max(1, ...ratingBuckets.map((item) => item.count));
    const bucketStats = ratingBuckets.map((item) => ({
      label: item.label,
      score: Math.round((item.count / maxBucketCount) * 100),
      delta: toPercent(reviewsDelta),
    }));

    return {
      reviewWave: dailyTemplate,
      categoryStats: bucketStats,
      locationPulse: pulse,
      teamWatch: watch,
      totalReviews: totalReviewsCount,
      averageRating: avgRating,
      activeLocations: activeLocationsCount,
      activeEmployees: activeEmployeesCount,
      reviewsDeltaPercent: reviewsDelta,
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

          <div className='grid gap-2 sm:grid-cols-2 xl:grid-cols-4'>
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
                <div className='text-xl font-semibold'>{averageRating.toFixed(2)}</div>
              )}
              <div className='text-xs text-muted-foreground'>{t('avg_rating')}</div>
            </div>
            <div className='rounded-xl border border-border/60 bg-background/70 p-3'>
              <div className='mb-2 flex items-center justify-between text-muted-foreground'>
                <MapPin className='h-4 w-4' />
                <span className='text-xs'>{t('kpi.live_short')}</span>
              </div>
              {isLoading ? <Skeleton className='h-7 w-12' /> : <div className='text-xl font-semibold'>{activeLocations}</div>}
              <div className='text-xs text-muted-foreground'>{t('active_stores')}</div>
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
            <Badge
              variant='secondary'
              className='gap-1'
            >
              <TrendingUp className='h-3 w-3' />
              {reviewsDeltaLabel}
            </Badge>
          </div>
          {isLoading ? (
            <div className='flex h-36 items-end gap-2'>
              {Array.from({ length: 7 }).map((_, index) => (
                <div
                  key={index}
                  className='flex flex-1 flex-col items-center gap-1'
                >
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
                <XAxis
                  dataKey='day'
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  width={28}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
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

      <div className='grid gap-4 xl:grid-cols-[1.2fr_1fr]'>
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
              <div
                key={item.label}
                className='space-y-1'
              >
                <div className='flex items-center justify-between gap-3'>
                  <p className='text-sm font-medium'>{item.label}</p>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-semibold'>{item.score}</span>
                    <Badge
                      variant='ghost'
                      className={getDeltaTone(reviewsDeltaPercent)}
                    >
                      {item.delta}
                    </Badge>
                  </div>
                </div>
                <div className='h-2 rounded-full bg-muted'>
                  <div
                    className='h-full rounded-full bg-gradient-to-r from-chart-2 to-primary'
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className='gap-4 p-5'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-lg font-semibold'>{t('team_watchlist.title')}</h2>
              <p className='text-sm text-muted-foreground'>{t('team_watchlist.description')}</p>
            </div>
            <Sparkles className='h-5 w-5 text-muted-foreground' />
          </div>
          <div className='space-y-2'>
            {teamWatch.map((item) => (
              <div
                key={item.name}
                className='rounded-xl border p-3'
              >
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <p className='text-sm font-medium'>{item.name}</p>
                    <p className='text-xs text-muted-foreground'>{item.role}</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-semibold'>{item.rating.toFixed(2)}</p>
                    {item.alerts > 0 ? (
                      <Badge className='mt-1 gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400'>
                        <AlertTriangle className='h-3 w-3' />
                        {item.alerts} {t('team_watchlist.alerts')}
                      </Badge>
                    ) : (
                      <Badge className='mt-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'>
                        {t('team_watchlist.stable')}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {!isLoading && teamWatch.length === 0 ? (
              <p className='rounded-xl border p-3 text-sm text-muted-foreground'>{t('team_watchlist.empty')}</p>
            ) : null}
          </div>
        </Card>
      </div>

      <div className='mb-4 flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-semibold'>{t('location_pulse.title')}</h2>
          <p className='text-sm text-muted-foreground'>{t('location_pulse.description')}</p>
        </div>
        <Badge variant='outline'>{t('location_pulse.realtime')}</Badge>
      </div>
      <div className='grid gap-3 md:grid-cols-3'>
        {locationPulse.map((item) => (
          <div
            key={item.name}
            className='rounded-2xl border border-border/70 bg-muted/40 p-4'
          >
            <p className='text-sm font-medium'>{item.name}</p>
            <div className='mt-3 grid grid-cols-2 gap-3 text-sm'>
              <div>
                <p className='text-muted-foreground'>{t('location_pulse.rating')}</p>
                <p className='font-semibold'>{item.rating.toFixed(2)}</p>
              </div>
              <div>
                <p className='text-muted-foreground'>{t('location_pulse.reviews')}</p>
                <p className='font-semibold'>{item.reviews}</p>
              </div>
              <div className='col-span-2'>
                <p className='text-muted-foreground'>{t('location_pulse.active_employees')}</p>
                <p className='font-semibold'>{item.activeEmployees}</p>
              </div>
            </div>
          </div>
        ))}
        {!isLoading && locationPulse.length === 0 ? (
          <div className='rounded-2xl border border-border/70 bg-muted/40 p-4 text-sm text-muted-foreground'>
            {t('location_pulse.empty')}
          </div>
        ) : null}
      </div>

      {isError ? (
        <p className='text-sm text-destructive'>{t('error')}</p>
      ) : null}
    </div>
  );
}
