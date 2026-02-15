'use client';

import * as React from 'react';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarRail,
} from '@/shared/components/ui';
import { sidebarNav } from './nav-data';
import { SidebarBrand } from './sidebar-brand';
import { SidebarList } from './sidebar-list';
import { SidebarOptInForm } from './sidebar-opt-in-form';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarBrand />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarList items={sidebarNav} />
      </SidebarContent>
      <SidebarFooter>
        <div className='p-1'>
          <SidebarOptInForm />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
