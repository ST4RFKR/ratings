import { SearchInput } from '@/shared/components/common/search-input';
import { DashboardAnalyticCard } from '@/shared/components/common/sidebar/dashboard-analytic-card';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Award, MessageSquare, Plus, Star, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

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

  const employees = [
    { id: '1', name: 'John Doe', role: 'Senior Manager', rating: 4.98, reviews: 120 },
    { id: '2', name: 'Jane Smith', role: 'Store Assistant', rating: 4.85, reviews: 85 },
    { id: '3', name: 'Mike Johnson', role: 'Cashier', rating: 4.6, reviews: 60 },
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

      <div className='mt-6 grid gap-4'>
        {employees.map((employee) => (
          <Card key={employee.id}>
            <CardContent className='p-4 flex items-center justify-between'>
              <div>
                <h3 className='font-semibold'>{employee.name}</h3>
                <p className='text-sm text-muted-foreground'>{employee.role}</p>
              </div>
              <div className='flex items-center gap-6'>
                <div className='text-right'>
                  <p className='text-sm font-medium'>{t('table.rating')}</p>
                  <p className='text-sm text-muted-foreground'>{employee.rating}</p>
                </div>
                <div className='text-right'>
                  <p className='text-sm font-medium'>{t('table.reviews')}</p>
                  <p className='text-sm text-muted-foreground'>{employee.reviews}</p>
                </div>
                <Link href={`/dashboard/employees/${employee.id}`}>
                  <Button variant='outline' size='sm'>
                    {t('table.view')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
