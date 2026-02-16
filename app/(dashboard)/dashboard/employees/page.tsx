'use client';
import { SearchInput } from '@/shared/components/common/search-input';
import { DashboardAnalyticCard } from '@/shared/components/common/sidebar/dashboard-analytic-card';
import { DataTable } from '@/shared/components/tables/data-table';
import { columnsEmployees, mockEmployees } from '@/shared/components/tables/employees/columns';
import { Button } from '@/shared/components/ui';
import { Award, MessageSquare, Plus, Star, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function EmployeesPage() {
  const t = useTranslations('dashboard.employees');
  const a = useTranslations('dashboard.employees.analytics');

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
      icon: <Award className='h-4 w-4' />,
    },
  ];

  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <Users className='h-6 w-6' />
          <h1 className='text-2xl font-semibold'>{t('title')}</h1>
        </div>
        <div className='flex items-center gap-3'>
          <SearchInput placeholder={t('search')} />
          <Button>
            <Plus className='mr-1' />
            {'Add Employee'}
          </Button>
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
          columns={columnsEmployees}
          data={mockEmployees}
          filterPlaceholder='Filter employees...'
        />
      </div>
    </div>
  );
}
