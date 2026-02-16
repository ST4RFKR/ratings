'use client';

import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';
import { ROUTES } from '@/shared/config/routes';

export function Wrapper() {
  return (
    <div className='flex flex-col items-center justify-center gap-8 py-10'>
      <div className='flex flex-wrap justify-center gap-4'>
        <Button
          variant='outline'
          asChild
          className='min-w-56'
        >
          <Link href={ROUTES.DASHBOARD.HOME}>OPEN DASHBOARD (TEST)</Link>
        </Button>
        <Button
          variant='default'
          asChild
          className='min-w-56'
        >
          <Link href={ROUTES.ONBOARDING}>OPEN ONBOARDING (TEST)</Link>
        </Button>
      </div>
    </div>
  );
}
