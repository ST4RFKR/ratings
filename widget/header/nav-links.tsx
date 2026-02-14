'use client';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/shared/components/ui/navigation-menu';
import { cn } from '@/shared/lib/utils';
import { useCallback, useEffect, useState } from 'react';

export type NavigationSection = {
  title: string;
  href: string;
};

const navigationData: NavigationSection[] = [
  {
    title: 'About us',
    href: '#',
  },
  {
    title: 'Services',
    href: '#',
  },
  {
    title: 'Work',
    href: '#',
  },
  {
    title: 'Team',
    href: '#',
  },
  {
    title: 'Pricing',
    href: '#',
  },
  {
    title: 'Awards',
    href: '#',
  },
];

const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const handleScroll = useCallback(() => {
    setSticky(window.scrollY >= 50);
  }, []);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 768) setIsOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleScroll, handleResize]);

  return (
    <div>
      <nav
        className={cn(
          'w-full max-w-6xl flex items-center h-fit justify-between gap-3.5 lg:gap-6 transition-all duration-500',
          sticky
            ? 'p-1.5 bg-primary/50 backdrop-blur-lg border border-border/40 shadow-2xl shadow-primary/5 rounded-full'
            : 'bg-transparent border-transparent',
        )}
      >
        <div>
          <NavigationMenu className='max-md:hidden bg-muted p-0.5 rounded-full'>
            <NavigationMenuList className='flex gap-0'>
              {navigationData.map((navItem) => (
                <NavigationMenuItem key={navItem.title}>
                  <NavigationMenuLink
                    href={navItem.href}
                    className='px-2 lg:px-4 py-2 text-sm font-medium rounded-full text-muted-foreground hover:text-foreground hover:bg-background outline outline-transparent hover:outline-border hover:shadow-xs transition tracking-normal'
                  >
                    {navItem.title}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
