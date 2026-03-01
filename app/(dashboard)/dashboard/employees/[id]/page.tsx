'use client';

import { useGetEmployeeStats } from '@/features/employee/get-employee-stats';
import { DataTable, DataTableColumnHeader } from '@/shared/components/tables/data-table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ColumnDef } from '@tanstack/react-table';
import { Briefcase, MessageSquare, Star, Target, User } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from 'recharts';

const LINE_COLOR = 'var(--primary)';
const FILL_COLOR = 'var(--primary)';
type EmployeeReviewRow = {
  id: string;
  locationName: string;
  averageRating: number;
  speed: number;
  politeness: number;
  quality: number;
  professionalism: number;
  cleanliness: number;
  comment: string | null;
  createdAt: string;
};

function formatMonthLabel(monthKey: string, locale: string) {
  const [year, month] = monthKey.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);

  return date.toLocaleDateString(locale, { month: 'short' });
}

function formatReviewDate(value: string, locale: string) {
  return new Date(value).toLocaleDateString(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function EmployeeDetailPage() {
  const t = useTranslations('dashboard.employees');
  const locale = useLocale();
  const params = useParams<{ id: string }>();
  const employeeId = Array.isArray(params.id) ? params.id[0] : params.id;
  const statsQuery = useGetEmployeeStats(employeeId ?? '');

  const trendData = useMemo(() => {
    return (statsQuery.data?.monthlyTrend ?? []).map((item) => ({
      label: formatMonthLabel(item.key, locale),
      reviews: item.reviews,
      averageRating: item.averageRating,
    }));
  }, [locale, statsQuery.data?.monthlyTrend]);

  const recentRatingsData = useMemo(() => {
    return (statsQuery.data?.recentRatings ?? []).map((item) => ({
      label: new Date(item.label).toLocaleDateString(locale, { day: '2-digit', month: '2-digit' }),
      rating: item.rating,
    }));
  }, [locale, statsQuery.data?.recentRatings]);

  const radarData = useMemo(() => {
    return (statsQuery.data?.criteria ?? []).map((item) => ({
      subject: t(`details.charts.criteria.${item.category.toLowerCase()}`),
      value: item.value,
      fullMark: 5,
    }));
  }, [statsQuery.data?.criteria, t]);

  const employee = statsQuery.data?.employee;
  const totalReviews = statsQuery.data?.kpi.totalReviews ?? 0;
  const averageRating = statsQuery.data?.kpi.averageRating ?? 0;
  const reviewRows = useMemo<EmployeeReviewRow[]>(() => {
    return (statsQuery.data?.reviews ?? []).map((review) => ({
      id: review.id,
      locationName: review.locationName,
      averageRating: review.averageRating,
      speed: review.scores.speed,
      politeness: review.scores.politeness,
      quality: review.scores.quality,
      professionalism: review.scores.professionalism,
      cleanliness: review.scores.cleanliness,
      comment: review.comment,
      createdAt: review.createdAt,
    }));
  }, [statsQuery.data?.reviews]);
  const reviewColumns = useMemo<ColumnDef<EmployeeReviewRow>[]>(
    () => [
      {
        accessorKey: 'locationName',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title='Location'
          />
        ),
      },
      {
        accessorKey: 'averageRating',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title='Rating'
          />
        ),
        cell: ({ row }) => row.original.averageRating.toFixed(2),
      },
      {
        accessorKey: 'speed',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('details.charts.criteria.speed')}
          />
        ),
      },
      {
        accessorKey: 'politeness',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('details.charts.criteria.politeness')}
          />
        ),
      },
      {
        accessorKey: 'quality',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('details.charts.criteria.quality')}
          />
        ),
      },
      {
        accessorKey: 'professionalism',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('details.charts.criteria.professionalism')}
          />
        ),
      },
      {
        accessorKey: 'cleanliness',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('details.charts.criteria.cleanliness')}
          />
        ),
      },
      {
        accessorKey: 'comment',
        header: 'Comment',
        cell: ({ row }) => row.original.comment ?? '-',
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title='Date'
          />
        ),
        cell: ({ row }) => formatReviewDate(row.original.createdAt, locale),
      },
    ],
    [locale, t],
  );

  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
      <div className='flex items-center gap-3'>
        <User className='h-6 w-6' />
        <h1 className='text-2xl font-semibold'>{employee?.fullName ?? t('details.title_fallback')}</h1>
      </div>

      {statsQuery.isLoading ? <p className='text-sm text-muted-foreground'>{t('details.loading')}</p> : null}
      {statsQuery.isError ? (
        <p className='text-sm text-destructive'>{(statsQuery.error as Error)?.message ?? 'Failed to load stats'}</p>
      ) : null}

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <Card className='shadow-none'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('details.kpi.average_rating')}</CardTitle>
            <Star className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{averageRating.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className='shadow-none'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('details.kpi.total_reviews')}</CardTitle>
            <MessageSquare className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalReviews}</div>
          </CardContent>
        </Card>

        <Card className='shadow-none'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{t('details.kpi.role')}</CardTitle>
            <Briefcase className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-xl font-semibold'>{employee?.role ?? '-'}</div>
            <p className='text-xs text-muted-foreground'>{employee?.locationName ?? t('details.kpi.no_location')}</p>
          </CardContent>
        </Card>
      </div>

      <Card className='shadow-none'>
        <CardContent className='pt-4'>
          <Accordion
            type='single'
            collapsible
            defaultValue='location-scores'
          >
            <AccordionItem value='location-scores'>
              <AccordionTrigger className='py-2 text-base'>
                {t('details.kpi.total_reviews')} ({totalReviews})
              </AccordionTrigger>
              <AccordionContent className='pb-0'>
                <DataTable
                  columns={reviewColumns}
                  data={reviewRows}
                  showFilter={false}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
        <Card className='shadow-none'>
          <CardHeader>
            <CardTitle>{t('details.charts.trend_title')}</CardTitle>
            <CardDescription>{t('details.charts.trend_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className='h-[320px] w-full rounded-xl border border-border bg-card/70 p-2 dark:bg-card/60'
              config={{
                averageRating: { label: t('details.charts.average_rating_label'), color: LINE_COLOR },
              }}
            >
              <AreaChart
                data={trendData}
                accessibilityLayer
              >
                <defs>
                  <linearGradient
                    id='employeeTrendAreaFill'
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop
                      offset='5%'
                      stopColor={FILL_COLOR}
                      stopOpacity={0.45}
                    />
                    <stop
                      offset='95%'
                      stopColor={FILL_COLOR}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='label'
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 5]}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type='monotone'
                  dataKey='averageRating'
                  stroke='var(--color-averageRating)'
                  fill='url(#employeeTrendAreaFill)'
                  strokeWidth={2.75}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className='shadow-none'>
          <CardHeader>
            <CardTitle>{t('details.charts.latest_title')}</CardTitle>
            <CardDescription>{t('details.charts.latest_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className='h-[320px] w-full rounded-xl border border-border bg-card/70 p-2 dark:bg-card/60'
              config={{
                rating: { label: t('details.charts.average_rating_label'), color: LINE_COLOR },
              }}
            >
              <LineChart
                data={recentRatingsData}
                accessibilityLayer
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='label'
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 5]}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type='monotone'
                  dataKey='rating'
                  stroke='var(--color-rating)'
                  strokeWidth={3}
                  dot={{ r: 3, fill: 'var(--color-rating)' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
        <Card className='shadow-none'>
          <CardHeader className='items-center'>
            <CardTitle className='flex items-center gap-2 text-center'>
              <Target className='h-4 w-4' />
              {t('details.charts.criteria_title')}
            </CardTitle>
            <CardDescription className='text-center'>{t('details.charts.criteria_description')}</CardDescription>
          </CardHeader>
          <CardContent className='pb-2'>
            <ChartContainer
              className='mx-auto aspect-square max-h-[320px] w-full rounded-xl border border-border bg-card/70 p-2 dark:bg-card/60'
              config={{
                value: { label: t('details.charts.average_rating_label'), color: LINE_COLOR },
              }}
            >
              <RadarChart
                data={radarData}
                accessibilityLayer
              >
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <PolarAngleAxis dataKey='subject' />
                <PolarGrid />
                <PolarRadiusAxis
                  domain={[0, 5]}
                  tickCount={6}
                  tick={false}
                  axisLine={false}
                  tickLine={false}
                />
                <Radar
                  dataKey='value'
                  fill='var(--color-value)'
                  fillOpacity={0.6}
                  dot={{
                    r: 4,
                    fillOpacity: 1,
                  }}
                />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {totalReviews === 0 ? (
        <Card className='shadow-none'>
          <CardHeader>
            <CardTitle>{t('details.empty_title')}</CardTitle>
            <CardDescription>{t('details.empty_description')}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}
    </div>
  );
}

