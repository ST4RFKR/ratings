'use client';

import { useGetLocationStats } from '@/features/location/get-location-stats';
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
import { MapPin, MessageSquare, Star, Store, Target } from 'lucide-react';
import { useLocale } from 'next-intl';
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

type StoreReviewRow = {
  id: string;
  employeeName: string;
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

export default function StoreDetailPage() {
  const locale = useLocale();
  const params = useParams<{ id: string }>();
  const locationSlug = Array.isArray(params.id) ? params.id[0] : params.id;
  const statsQuery = useGetLocationStats(locationSlug ?? '');

  const location = statsQuery.data?.location;
  const totalReviews = statsQuery.data?.kpi.totalReviews ?? 0;
  const averageRating = statsQuery.data?.kpi.averageRating ?? 0;

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
    const labels: Record<string, string> = {
      SPEED: 'Speed',
      POLITENESS: 'Politeness',
      QUALITY: 'Quality',
      PROFESSIONALISM: 'Professionalism',
      CLEANLINESS: 'Cleanliness',
    };

    return (statsQuery.data?.criteria ?? []).map((item) => ({
      subject: labels[item.category] ?? item.category,
      value: item.value,
      fullMark: 5,
    }));
  }, [statsQuery.data?.criteria]);

  const reviewRows = useMemo<StoreReviewRow[]>(() => {
    return (statsQuery.data?.reviews ?? []).map((review) => ({
      id: review.id,
      employeeName: review.employeeName,
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

  const reviewColumns = useMemo<ColumnDef<StoreReviewRow>[]>(
    () => [
      {
        accessorKey: 'employeeName',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title='Employee'
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
            title='Speed'
          />
        ),
      },
      {
        accessorKey: 'politeness',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title='Politeness'
          />
        ),
      },
      {
        accessorKey: 'quality',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title='Quality'
          />
        ),
      },
      {
        accessorKey: 'professionalism',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title='Professionalism'
          />
        ),
      },
      {
        accessorKey: 'cleanliness',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title='Cleanliness'
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
    [locale],
  );

  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
      <div className='flex items-center gap-3'>
        <Store className='h-6 w-6' />
        <h1 className='text-2xl font-semibold'>{location?.name ?? 'Store details'}</h1>
      </div>

      {statsQuery.isLoading ? <p className='text-sm text-muted-foreground'>Loading store stats...</p> : null}
      {statsQuery.isError ? (
        <p className='text-sm text-destructive'>{(statsQuery.error as Error)?.message ?? 'Failed to load stats'}</p>
      ) : null}

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <Card className='shadow-none'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Rating</CardTitle>
            <Star className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{averageRating.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className='shadow-none'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Reviews</CardTitle>
            <MessageSquare className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalReviews}</div>
          </CardContent>
        </Card>
        <Card className='shadow-none'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Location</CardTitle>
            <MapPin className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{location?.name ?? '-'}</div>
            <p className='text-xs text-muted-foreground'>{location?.address ?? 'Address is not specified'}</p>
          </CardContent>
        </Card>
      </div>

      <Card className='shadow-none'>
        <CardContent className='pt-4'>
          <Accordion
            type='single'
            collapsible
            defaultValue='store-reviews'
          >
            <AccordionItem value='store-reviews'>
              <AccordionTrigger className='py-2 text-base'>Employee Reviews ({totalReviews})</AccordionTrigger>
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
            <CardTitle>Store Rating Trend</CardTitle>
            <CardDescription>Monthly reviews and average rating over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className='h-[320px] w-full rounded-xl border border-border bg-card/70 p-2 dark:bg-card/60'
              config={{
                averageRating: { label: 'Average rating', color: LINE_COLOR },
              }}
            >
              <AreaChart
                data={trendData}
                accessibilityLayer
              >
                <defs>
                  <linearGradient
                    id='locationTrendAreaFill'
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
                  fill='url(#locationTrendAreaFill)'
                  strokeWidth={2.75}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className='shadow-none'>
          <CardHeader>
            <CardTitle>Latest Ratings</CardTitle>
            <CardDescription>Rating changes across the latest 10 reviews.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className='h-[320px] w-full rounded-xl border border-border bg-card/70 p-2 dark:bg-card/60'
              config={{
                rating: { label: 'Average rating', color: LINE_COLOR },
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
              Rating Criteria
            </CardTitle>
            <CardDescription className='text-center'>Radar profile across 5 service quality criteria.</CardDescription>
          </CardHeader>
          <CardContent className='pb-2'>
            <ChartContainer
              className='mx-auto aspect-square max-h-[320px] w-full rounded-xl border border-border bg-card/70 p-2 dark:bg-card/60'
              config={{
                value: { label: 'Average rating', color: LINE_COLOR },
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
            <CardTitle>No reviews yet</CardTitle>
            <CardDescription>Add reviews for this store to see analytics and trends.</CardDescription>
          </CardHeader>
        </Card>
      ) : null}
    </div>
  );
}
