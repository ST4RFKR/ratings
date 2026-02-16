import { redirect } from 'next/navigation';

import { ROUTES } from '@/shared/config/routes';
import { getUserSession } from '@/shared/lib/server/get-user-session';

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserSession();

  if (!user) {
    redirect(ROUTES.NOT_AUTH);
  }

  return children;
}
