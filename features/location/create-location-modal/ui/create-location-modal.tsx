'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { useState } from 'react';
import { CreateLocationForm } from './create-location-form';

interface CreateLocationModalProps {
  children?: React.ReactNode;
}

export const CreateLocationModal = ({ children }: CreateLocationModalProps) => {
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
          <DialogTitle>Create New Location</DialogTitle>
          <DialogDescription>Fill in the details below to add a new Location to your dashboard.</DialogDescription>
        </DialogHeader>
        <CreateLocationForm
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
