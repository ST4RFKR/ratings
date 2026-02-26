'use client';
import { CreateEmployeeModal } from '@/features/employee/create-employee-modal';
import { useGetEmployees } from '@/features/employee/get-employes';
import { SearchInput } from '@/shared/components/common/search-input';
import { DashboardAnalyticCard } from '@/shared/components/common/sidebar/dashboard-analytic-card';
import { DataTable } from '@/shared/components/tables/data-table';
import { columnsEmployees, type Employee } from '@/shared/components/tables/employees/columns';
import { Button } from '@/shared/components/ui';
import { Award, MessageSquare, Plus, Star, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

export default function EmployeesPage() {
  const t = useTranslations('dashboard.employees');
  const a = useTranslations('dashboard.employees.analytics');
  const [search, setSearch] = useState('');
  const employeesQuery = useGetEmployees({ search });

  const employees = useMemo<Employee[]>(() => {
    return (employeesQuery.data ?? []).map((employee) => ({
      id: employee.id,
      fullName: employee.fullName,
      role: employee.role,
      locationName: employee.location?.name ?? '-',
      rating: employee.rating,
      reviews: employee._count.reviews,
      email: employee.user.email,
      status: employee.status,
    }));
  }, [employeesQuery.data]);
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
          <SearchInput
            placeholder={t('search')}
            onDebouncedChange={setSearch}
            className='w-full md:w-[280px]'
          />
          <CreateEmployeeModal>
            <Button>
              <Plus className='mr-1' />
              {t('actions.add_employee')}
            </Button>
          </CreateEmployeeModal>
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
          data={employees}
          showFilter={false}
        />
      </div>
    </div>
  );
}
