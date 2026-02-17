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
import { useState } from 'react';
import { CreateEmployeeForm } from './create-employee-form';

interface CreateEmployeeModalProps {
  children?: React.ReactNode;
}

export const CreateEmployeeModal = ({ children }: CreateEmployeeModalProps) => {
  const t = useTranslations('dashboard.forms.employee.modal');
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[520px]'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <CreateEmployeeForm
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
