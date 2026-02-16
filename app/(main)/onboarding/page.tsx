'use client';
import { CreateCompanyForm } from '@/features/company/create-company-form';
import { CompanyCodeOtpInput } from '@/shared/components/common/input-otp';
import {
  Button,
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
import { Building2, KeyRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const t = useTranslations('auth');
  const [companyCode, setCompanyCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJoinRequest = async () => {
    if (companyCode.length !== 6) {
      toast.error(t('onboarding.join.invalid-code'));
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success(t('onboarding.join.success'));
      setCompanyCode('');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <Card className='border-none bg-background/80 shadow-lg backdrop-blur-sm'>
              <CardHeader className='space-y-2 text-center'>
                <div className='mx-auto w-fit rounded-full bg-primary/10 p-3'>
                  <KeyRound className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='text-2xl font-bold'>{t('onboarding.join.title')}</CardTitle>
                <CardDescription>{t('onboarding.join.description')}</CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='flex flex-col items-center gap-3'>
                  <CompanyCodeOtpInput
                    value={companyCode}
                    onChange={setCompanyCode}
                    disabled={isSubmitting}
                  />
                  <p className='text-center text-sm text-muted-foreground'>{t('onboarding.join.hint')}</p>
                </div>
                <Button
                  className='w-full'
                  disabled={isSubmitting || companyCode.length !== 6}
                  onClick={handleJoinRequest}
                >
                  {isSubmitting ? t('onboarding.join.submitting') : t('onboarding.join.submit')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
