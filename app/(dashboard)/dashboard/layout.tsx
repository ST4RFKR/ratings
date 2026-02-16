import prisma from '@/prisma/prisma-client';
import { nextAuthOptions } from '@/shared/auth/next-auth-options';
import { LanguageSwitcher } from '@/shared/components/common/language-switcher/language-switcher';
import { ModeToggle } from '@/shared/components/common/mode-toggle';
import { AppSidebar } from '@/shared/components/common/sidebar/app-sidebar';
import { DashboardBreadcrumbs } from '@/shared/components/common/sidebar/dashboard-breadcrumbs';
import { UserNav } from '@/shared/components/common/sidebar/user-nav';
import { Badge } from '@/shared/components/ui';
import { Separator } from '@/shared/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/shared/components/ui/sidebar';
import { ROUTES } from '@/shared/config/routes';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user) {
    redirect(ROUTES.NOT_AUTH);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      activeCompanyId: true,
      activeCompany: { select: { name: true } },
    },
  });

  if (!user?.activeCompanyId) {
    redirect(ROUTES.ONBOARDING);
  }

  const activeCompanyName = user.activeCompany?.name ?? '';

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
              {activeCompanyName && (
                <div>
                  <Badge variant={'outline'}>
                    <span className='text-sm font-medium text-muted-foreground'>{activeCompanyName}</span>
                  </Badge>
                </div>
              )}
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
