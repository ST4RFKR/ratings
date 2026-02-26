'use client';

import { useGetEmployees } from '@/features/employee/get-employes';
import { useGetLocation } from '@/features/location/get-location/model/use-get-location';
import { useGetReviews } from '@/features/review/get-reviews';
import { SearchInput } from '@/shared/components/common/search-input';
import { DashboardAnalyticCard } from '@/shared/components/common/sidebar/dashboard-analytic-card';
import { DataTable } from '@/shared/components/tables/data-table';
import { columnsReviews, type ReviewTableRow } from '@/shared/components/tables/reviews/columns';
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui';
import { ROUTES } from '@/shared/config';
import { MessageSquare, Plus, Star, Store, Users } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

export default function ReviewsPage() {
  const t = useTranslations('dashboard.reviews');
  const a = useTranslations('dashboard.employees.analytics');
  const [search, setSearch] = useState<string>('');
  const [employeeId, setEmployeeId] = useState<string>('all');
  const [locationId, setLocationId] = useState<string>('all');
  const employeesQuery = useGetEmployees();
  const locationsQuery = useGetLocation();

  const selectedEmployeeId = employeeId === 'all' ? undefined : employeeId;
  const selectedLocationId = locationId === 'all' ? undefined : locationId;

  const reviewsQuery = useGetReviews({
    employeeId: selectedEmployeeId,
    locationId: selectedLocationId,
    search,
  });

  const reviewRows = useMemo<ReviewTableRow[]>(() => {
    return (reviewsQuery.data ?? []).map((review) => ({
      id: review.id,
      employeeId: review.employee.id,
      employeeName: review.employee.fullName,
      locationSlug: review.location.slug,
      locationName: review.location.name,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    }));
  }, [reviewsQuery.data]);

  const analyticsData = [
    {
      title: a('avg_rating'),
      description: '4.7',
      metrics: [
        {
          label: a('last_30_days'),
          value: '+0.1',
          percentage: '+3%',
          isPositive: true,
        },
      ],
      icon: <Star className='h-4 w-4' />,
    },
    {
      title: a('total_reviews'),
      description: '850',
      metrics: [
        {
          label: a('last_30_days'),
          value: '+45',
          percentage: '+8%',
          isPositive: true,
        },
      ],
      icon: <MessageSquare className='h-4 w-4' />,
    },
    {
      title: a('top_employee'),
      description: 'John Doe',
      metrics: [
        {
          label: a('avg_rating'),
          value: '4.98',
          percentage: 'TOP',
          isPositive: true,
        },
      ],
      icon: <Users className='h-4 w-4' />,
    },
  ];

  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <Star className='h-6 w-6' />
          <h1 className='text-2xl font-semibold'>{t('title')}</h1>
        </div>
        <div className='flex items-center gap-3'>
          <SearchInput
            placeholder={t('search')}
            onDebouncedChange={setSearch}
            className='w-full md:w-[280px]'
          />
          <Button asChild>
            <Link href={ROUTES.DASHBOARD.REVIEWS_NEW}>
              <Plus className='mr-1' />
              {t('new.title')}
            </Link>
          </Button>
        </div>
      </div>
      <p className='text-muted-foreground'>{t('description')}</p>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {analyticsData.map((item, index) => (
          <DashboardAnalyticCard
            key={index}
            mainDashboard={item}
          />
        ))}
      </div>

      <div className='flex flex-col gap-3 md:flex-row md:items-center'>
        <Select
          value={locationId}
          onValueChange={setLocationId}
        >
          <SelectTrigger className='w-full md:w-[260px]'>
            <Store className='text-muted-foreground mr-2 h-4 w-4' />
            <SelectValue placeholder={t('filters.store')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>{t('filters.all_stores')}</SelectItem>
            {(locationsQuery.data ?? []).map((location) => (
              <SelectItem
                key={location.id}
                value={location.id}
              >
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={employeeId}
          onValueChange={setEmployeeId}
        >
          <SelectTrigger className='w-full md:w-[260px]'>
            <Users className='text-muted-foreground mr-2 h-4 w-4' />
            <SelectValue placeholder={t('filters.employee')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>{t('filters.all_employees')}</SelectItem>
            {(employeesQuery.data ?? []).map((employee) => (
              <SelectItem
                key={employee.id}
                value={employee.id}
              >
                {employee.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='mt-2'>
        <DataTable
          columns={columnsReviews}
          data={reviewRows}
          showFilter={false}
        />
      </div>
    </div>
  );
}
