import { Header } from '@/widget/header';

export default function MainPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
