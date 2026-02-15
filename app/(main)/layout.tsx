import { getUserSession } from '@/shared/lib/server/get-user-session';
import { Header } from '@/widget/header';

export default async function MainPageLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserSession();

  return (
    <>
      <Header isSignedIn={!!user} />
      {children}
    </>
  );
}
