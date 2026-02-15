'use client';

import { LogOut, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/components/ui';
import { ROUTES } from '@/shared/config/routes';

export function UserNav() {
  const t = useTranslations('dashboard.user-nav');
  const session = useSession();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='icon'
        >
          <User className='text-primary h-[1.2rem] w-[1.2rem]' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-56'
        align='end'
        forceMount
      >
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{t('role')}</p>
            <p className='text-muted-foreground text-xs leading-none'>
              {session.data?.user?.email || t('email-placeholder')}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className='mr-2 h-4 w-4' />
            <span>{t('profile')}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='text-destructive focus:bg-destructive/10 dark:focus:bg-destructive/20'
          onClick={() => setOpen(true)}
        >
          <LogOut className='mr-2 h-4 w-4' />
          <span>{t('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>

      <AlertDialog
        open={open}
        onOpenChange={setOpen}
      >
        <AlertDialogContent size='sm'>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirm-logout-title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('confirm-logout-description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('confirm-logout-cancel')}</AlertDialogCancel>
            <AlertDialogAction
              variant='destructive'
              onClick={() => signOut({ callbackUrl: ROUTES.HOME })}
            >
              {t('confirm-logout-action')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenu>
  );
}
