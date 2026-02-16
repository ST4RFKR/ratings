'use client';
import { CreateCompanyForm } from '@/features/company/create-company-form';
import { JoinCompanyTab } from '@/features/company/join/ui/join-company-tab';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui';
import { cn } from '@/shared/lib';
import { Building2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function OnboardingPage() {
  const t = useTranslations('auth');

  return (
    <div className='min-h-[calc(100vh-4rem)] bg-muted/30 p-4'>
      <div className='mx-auto flex w-full max-w-3xl flex-col gap-6'>
        <Tabs
          defaultValue='create-company'
          className='w-full'
        >
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger
              className={cn('data-[state=active]:!bg-primary/10')}
              value='create-company'
            >
              {t('onboarding.tabs.create-company')}
            </TabsTrigger>
            <TabsTrigger
              className={cn('data-[state=active]:!bg-primary/10')}
              value='join-company'
            >
              {t('onboarding.tabs.join-company')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value='create-company'>
            <Card className='border-none bg-background/80 shadow-lg backdrop-blur-sm'>
              <CardHeader className='space-y-2 text-center'>
                <div className='mx-auto w-fit rounded-full bg-primary/10 p-3'>
                  <Building2 className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='text-2xl font-bold'>{t('create-company.welcome')}</CardTitle>
                <CardDescription>{t('create-company.description')}</CardDescription>
              </CardHeader>
              <CardContent className='flex items-center justify-center'>
                <CreateCompanyForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='join-company'>
            <JoinCompanyTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
