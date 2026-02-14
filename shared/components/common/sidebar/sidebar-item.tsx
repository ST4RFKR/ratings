'use client';

import { type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
};

export function SidebarItem({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const t = useTranslations('dashboard.nav');
  const Icon = item.icon;

  const isActive = pathname === item.url;

  return (
    <Link
      href={item.url}
      className={`
        flex items-center gap-3 rounded-lg px-3 py-2 text-sm
        transition-colors
        ${
          isActive
            ? 'bg-muted font-medium text-foreground'
            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
        }
      `}
    >
      {Icon && <Icon className='h-4 w-4 shrink-0' />}
      <span>{t(item.title)}</span>
    </Link>
  );
}
