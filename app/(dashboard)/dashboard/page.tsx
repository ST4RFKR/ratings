import { JoinCodeBadge } from '@/shared/components/common/join-code-badge';
import { StatisticsCard } from '@/shared/components/common/statistic-card';
import { LayoutDashboard } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('dashboard.main');
  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
      <div className='flex items-center justify-between gap-3'>
        <div className='flex flex-col items-center gap-3'>
          <div className='flex items-center gap-3'>
            <LayoutDashboard className='h-6 w-6' />
            <h1 className='text-2xl font-semibold'>{t('title')}</h1>
          </div>
          <p className='text-muted-foreground'>{t('description')}</p>
        </div>
        <div className='flex items-center gap-2'>
          <h1 className='text-md font-semibold'>Company invite code: </h1>
          <JoinCodeBadge code='FRSATD' />
        </div>
      </div>
      <StatisticsCard />
    </div>
  );
}
