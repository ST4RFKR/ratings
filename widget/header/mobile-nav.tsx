'use client';

import { LanguageSwitcher } from '@/shared/components/common/language-switcher/language-switcher';
import { ModeToggle } from '@/shared/components/common/mode-toggle';
import { Button } from '@/shared/components/ui/button';
import { Separator } from '@/shared/components/ui/separator';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/shared/components/ui/sheet';
import { LogIn, Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations('header');

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <Button
        variant='ghost'
        size='icon'
        className='md:hidden'
        onClick={() => setOpen(true)}
        aria-label='Open menu'
      >
        <Menu className='size-5' />
      </Button>

      <SheetContent
        side='left'
        className='w-72 flex flex-col'
      >
        <SheetHeader>
          <SheetTitle className='flex items-center gap-2 font-display text-lg'>
            <div className='flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold'>
              R
            </div>
            Ratings
          </SheetTitle>
        </SheetHeader>

        {/* <Separator /> */}

        {/* <div className='flex-1 overflow-y-auto py-2'><Navbar /></div> */}

        <Separator />

        <SheetFooter className='flex-col gap-3'>
          <div className='flex items-center gap-2'>
            <ModeToggle />
            <LanguageSwitcher />
          </div>
          <Button
            className='w-full'
            variant='default'
          >
            <LogIn className='size-4' />
            {t('login')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
