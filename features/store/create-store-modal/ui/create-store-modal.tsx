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
import { CreateStoreForm } from './create-store-form';

interface CreateStoreModalProps {
  children?: React.ReactNode;
}

export const CreateStoreModal = ({ children }: CreateStoreModalProps) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    // Here we could trigger a list refresh or show a toast
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Store</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new store to your dashboard.
          </DialogDescription>
        </DialogHeader>
        <CreateStoreForm 
          onSuccess={handleSuccess} 
          onCancel={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};
