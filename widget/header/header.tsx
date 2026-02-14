'use client';

import { LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { LanguageSwitcher } from '@/shared/components/common/language-switcher/language-switcher';
import { ModeToggle } from '@/shared/components/common/mode-toggle';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

import { ROUTES } from '@/shared/config/routes';
import Link from 'next/link';
import { MobileNav } from './mobile-nav';
import Navbar from './nav-links';

export function Header() {
    const [scrolled, setScrolled] = useState(false);
    const t = useTranslations('header');

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 0);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            data-scrolled={scrolled || undefined}
            className={cn(
                'sticky top-0 z-50 w-full transition-all duration-300',
                'bg-header text-header-foreground',
                scrolled ? 'border-b border-border bg-header/80 shadow-sm backdrop-blur-md' : 'border-b border-transparent',
            )}
        >
            <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6'>
                {/* Logo */}
                <div className='flex items-center gap-2'>
                    <div className='flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-bold'>
                        R
                    </div>
                    <span className='font-display text-lg tracking-tight'>{t('brand')}</span>
                </div>

                {/* Desktop nav */}
                <div className='hidden md:flex md:items-center md:gap-1'>
                    <Navbar />
                </div>

                {/* Desktop actions */}
                <div className='hidden md:flex md:items-center md:gap-2'>
                    <ModeToggle />
                    <LanguageSwitcher />
                    <Button
                        asChild
                        size='sm'
                        className='ml-1'
                    >
                        <Link href={ROUTES.LOGIN}>
                            <LogIn className='size-4' />
                            {t('login')}
                        </Link>
                    </Button>
                </div>

                {/* Mobile hamburger */}
                <MobileNav />
            </div>
        </header>
    );
}
