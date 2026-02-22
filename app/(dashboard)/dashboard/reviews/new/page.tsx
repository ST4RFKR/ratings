'use client';

import { CreateReviewForm } from '@/features/review/create-review-modal';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function NewReviewPage() {
  const t = useTranslations('dashboard.reviews.new');

  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
      <div className='flex items-center gap-3'>
        <Star className='h-6 w-6' />
        <h1 className='text-2xl font-semibold'>{t('title')}</h1>
      </div>
      <p className='text-muted-foreground'>{t('description')}</p>

      <div className='max-w-2xl rounded-lg border bg-card p-4 sm:p-5'>
        <CreateReviewForm />
      </div>
    </div>
  );
}
