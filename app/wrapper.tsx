'use client';

import { Button } from '@/shared/components/ui/button';

import { ROUTES } from '@/shared/config/routes';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
export function Wrapper() {
    const t = useTranslations('main');
    return (
        <div className='flex items-center justify-center flex-col gap-10'>
            <div> ТУТ БУДЕТ ЛЕНДИНГ</div>
            <div className='flex gap-4'>
                <Button
                    variant={'outline'}
                    asChild
                >
                    <Link href={ROUTES.DASHBOARD.HOME}>ПЕРЕЙТИ НА DASHBOARD</Link>
                </Button>
                <Button
                    variant={'default'}
                    asChild
                >
                    <Link href={ROUTES.CREATE_COMPANY}>СОЗДАТЬ КОМПАНИЮ (ТЕСТ)</Link>
                </Button>
            </div>
        </div>
    );
}
