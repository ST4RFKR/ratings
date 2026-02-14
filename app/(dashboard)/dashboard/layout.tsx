import { LanguageSwitcher } from '@/shared/components/common/language-switcher/language-switcher';
import { ModeToggle } from '@/shared/components/common/mode-toggle';
import { AppSidebar } from '@/shared/components/common/sidebar/app-sidebar';
import { DashboardBreadcrumbs } from '@/shared/components/common/sidebar/dashboard-breadcrumbs';
import { UserNav } from '@/shared/components/common/sidebar/user-nav';
import { Separator } from '@/shared/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/shared/components/ui/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className='flex h-16 shrink-0 items-center justify-between border-b px-4'>
              <div className='flex items-center gap-2'>
                <SidebarTrigger className='-ml-1' />
                <Separator
                  orientation='vertical'
                  className='mr-2 data-[orientation=vertical]:h-4'
                />
                <DashboardBreadcrumbs />
              </div>
              <div className='flex items-center gap-2'>
                <ModeToggle />
                <LanguageSwitcher />
                <Separator
                  orientation='vertical'
                  className='mx-1 data-[orientation=vertical]:h-4'
                />
                <UserNav />
              </div>
            </header>
            {children}
          </SidebarInset>
        </SidebarProvider>
      }
    </>
  );
}
