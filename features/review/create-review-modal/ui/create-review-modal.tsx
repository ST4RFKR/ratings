'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { useTranslations } from 'next-intl';
import { CreateReviewForm } from './create-review-form';

interface CreateReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode;
}

export function CreateReviewModal({ open, onOpenChange, children }: CreateReviewModalProps) {
  const t = useTranslations('dashboard.forms.review.modal');

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogContent className='sm:max-w-[620px]'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <CreateReviewForm
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
