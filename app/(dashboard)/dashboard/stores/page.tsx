import { CreateStoreModal } from '@/features/store/create-store-modal';
import { SearchInput } from '@/shared/components/common/search-input';
import { DashboardAnalyticCard } from '@/shared/components/common/sidebar/dashboard-analytic-card';
import { columnsStores, mockStores } from '@/shared/components/tables/stores/columns';
import { DataTable } from '@/shared/components/tables/stores/data-table';
import { Button } from '@/shared/components/ui/button';
import { Award, Plus, Star, Store, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function StoresPage() {
  const t = useTranslations('dashboard.stores');
  const a = useTranslations('dashboard.stores.analytics');

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
          <SearchInput placeholder={t('search')} />
          <CreateStoreModal>
            <Button>
              <Plus className='mr-1' />
              {'Add Store'}
            </Button>
          </CreateStoreModal>
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
          data={mockStores}
        />
      </div>
    </div>
  );
}
