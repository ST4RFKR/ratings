import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';
import { ROUTES } from '@/shared/config/routes';

export default function NotAuthPage() {
  return (
    <main className='mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-xl flex-col items-center justify-center gap-6 px-4 text-center'>
      <h1 className='text-3xl font-semibold tracking-tight'>Access denied</h1>
      <p className='text-sm text-muted-foreground'>
        You need to sign in to open this page.
      </p>
      <div className='flex flex-wrap items-center justify-center gap-3'>
        <Button asChild>
          <Link href={ROUTES.LOGIN}>Sign in</Link>
        </Button>
        <Button
          asChild
          variant='outline'
        >
          <Link href={ROUTES.HOME}>Go home</Link>
        </Button>
      </div>
    </main>
  );
}
