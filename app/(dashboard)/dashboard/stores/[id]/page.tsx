'use client';

import { useGetLocationStats } from '@/features/location/get-location-stats';
import { DataTable, DataTableColumnHeader } from '@/shared/components/tables/data-table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ColumnDef } from '@tanstack/react-table';
import { MapPin, Star, Store, Users } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

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

function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export default function StoreDetailPage() {
  const params = useParams<{ id: string }>();
  const locationSlug = Array.isArray(params.id) ? params.id[0] : params.id;
  const statsQuery = useGetLocationStats(locationSlug ?? '');

  const location = statsQuery.data?.location;
  const totalReviews = statsQuery.data?.kpi.totalReviews ?? 0;
  const averageRating = statsQuery.data?.kpi.averageRating ?? 0;

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
        cell: ({ row }) => formatReviewDate(row.original.createdAt),
      },
    ],
    [],
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
            <Users className='h-4 w-4 text-muted-foreground' />
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

      <Card className='mt-4 shadow-none'>
        <CardHeader>
          <CardTitle>Historical Performance</CardTitle>
        </CardHeader>
        <CardContent className='flex h-[300px] items-center justify-center rounded-lg border-2 border-dashed'>
          <p className='text-muted-foreground'>Analytics Chart Placeholder</p>
        </CardContent>
      </Card>
    </div>
  );
}
