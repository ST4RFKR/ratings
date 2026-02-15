'use client';

import { SidebarGroup, SidebarMenu } from '@/shared/components/ui';
import { type LucideIcon } from 'lucide-react';
import { SidebarItem } from './sidebar-item';

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: {
    title: string;
    url: string;
  }[];
};

export function SidebarList({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarMenu className='space-y-4'>
        {items.map((group) => (
          <div
            key={group.title}
            className='space-y-1'
          >
            {/* родитель */}
            <SidebarItem item={group} />

            {/* подпункты */}
            {group.items && (
              <div className='ml-6 space-y-1'>
                {group.items.map((sub) => (
                  <SidebarItem
                    key={sub.url}
                    item={sub}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
