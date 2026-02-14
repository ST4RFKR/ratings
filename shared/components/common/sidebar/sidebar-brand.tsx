'use client';

import { SidebarMenuButton } from '@/shared/components/ui/sidebar';
import { BarChart3 } from 'lucide-react';
import Link from 'next/link';

type SidebarBrandProps = {
  title?: string;
  version?: string;
  href?: string;
};

export function SidebarBrand({ title = 'Ratings', version = 'v1.0.0', href = '/' }: SidebarBrandProps) {
  return (
    <SidebarMenuButton
      size='lg'
      asChild
    >
      <Link href={href}>
        {/* icon */}
        <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
          <BarChart3 className='size-4' />
        </div>

        {/* text */}
        <div className='flex flex-col gap-0.5 leading-none'>
          <span className='font-semibold'>{title}</span>
          <span className='text-xs text-muted-foreground'>{version}</span>
        </div>
      </Link>
    </SidebarMenuButton>
  );
}
