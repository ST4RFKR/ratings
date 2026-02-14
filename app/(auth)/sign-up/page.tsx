import { SignupForm } from '@/shared/components/common/signup-form';
import { GalleryVerticalEnd } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function SignupPage() {
    const t = await getTranslations();
    return (
        <div className='bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
            <div className='flex w-full max-w-sm flex-col gap-6'>
                <Link
                    href='/'
                    className='flex items-center gap-2 self-center font-medium'
                >
                    <div className='bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md'>
                        <GalleryVerticalEnd className='size-4' />
                    </div>
                    {t('brand')}
                </Link>
                <SignupForm />
            </div>
        </div>
    );
}
