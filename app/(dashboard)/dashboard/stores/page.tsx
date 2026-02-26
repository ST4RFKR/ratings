'use client';

import { CreateLocationModal } from '@/features/location/create-location-modal';
import { useGetLocation } from '@/features/location/get-location/model/use-get-location';
import { SearchInput } from '@/shared/components/common/search-input';
import { DashboardAnalyticCard } from '@/shared/components/common/sidebar/dashboard-analytic-card';
import { DataTable } from '@/shared/components/tables/data-table';
import { columnsStores, type LocationTableRow } from '@/shared/components/tables/stores/columns';
import { Button } from '@/shared/components/ui/button';
import { Award, Plus, Star, Store, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

function mapLocationStatus(status: 'ACTIVE' | 'PENDING' | 'BLOCKED'): 'active' | 'inactive' {
  if (status === 'ACTIVE') {
    return 'active';
  }

  return 'inactive';
}

export default function StoresPage() {
  const t = useTranslations('dashboard.stores');
  const a = useTranslations('dashboard.stores.analytics');
  const [search, setSearch] = useState('');
  const locationsQuery = useGetLocation({ search });

  const locations = useMemo<LocationTableRow[]>(() => {
    return (locationsQuery.data ?? []).map((location) => ({
      id: location.id,
      slug: location.slug,
      name: location.name,
      rating: location.rating,
      email: location.email,
      status: mapLocationStatus(location.status),
    }));
  }, [locationsQuery.data]);

  const analyticsData = [
    {
      title: a('avg_rating'),
      description: '4.8',
      metrics: [
        {
          label: a('last_30_days'),
          value: '+0.2',
          percentage: '+5%',
          isPositive: true,
        },
      ],
      icon: <Star className='h-4 w-4' />,
    },
    {
      title: a('total_reviews'),
      description: '1,240',
      metrics: [
        {
          label: a('last_30_days'),
          value: '+180',
          percentage: '+12%',
          isPositive: true,
        },
      ],
      icon: <Users className='h-4 w-4' />,
    },
    {
      title: a('top_store'),
      description: 'Store Central',
      metrics: [
        {
          label: a('avg_rating'),
          value: '4.95',
          percentage: 'TOP',
          isPositive: true,
        },
      ],
      icon: <Award className='h-4 w-4' />,
    },
  ];

  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <Store className='h-6 w-6' />
          <h1 className='text-2xl font-semibold'>{t('title')}</h1>
        </div>
        <div className='flex items-center gap-3'>
          <SearchInput
            placeholder={t('search')}
            onDebouncedChange={setSearch}
            className='w-full md:w-[280px]'
          />
          <CreateLocationModal>
            <Button>
              <Plus className='mr-1' />
              {t('actions.add_location')}
            </Button>
          </CreateLocationModal>
        </div>
      </div>
      <p className='text-muted-foreground'>{t('description')}</p>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {analyticsData.map((item, index) => (
          <DashboardAnalyticCard
            key={index}
            mainDashboard={item}
          />
        ))}
      </div>

      <div className='mt-6'>
        <DataTable
          columns={columnsStores}
          data={locations}
          showFilter={false}
        />
      </div>
    </div>
  );
}
