'use client';
import { CreateCompanyForm } from '@/features/company/create-company-form';
import { useGetAllCompanyByUser } from '@/features/company/get-user-company/model/use-get-user-all-company';
import { Company } from '@/prisma/generated/prisma/client';
import { apiInstance } from '@/shared/api/api-instance';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ROUTES } from '@/shared/config/routes';
import { useMutation } from '@tanstack/react-query';
import { Building2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function CreateCompanyPage() {
  const t = useTranslations('auth');
  const session = useSession();
  const { data: companies, isLoading } = useGetAllCompanyByUser();
  const router = useRouter();

  const selectCompanyMutation = useMutation({
    mutationFn: async (companyId: string) => {
      const response = await apiInstance.patch('/companies/active', { companyId });
      return response.data;
    },
    onSuccess: () => {
      router.replace(ROUTES.DASHBOARD.HOME);
    },
  });

  if (session.status === 'authenticated') {
    const hasCompanies = (companies?.length ?? 0) > 1;

    return (
      <div className='min-h-[calc(100vh-4rem)] p-4 bg-muted/30'>
        <div className='mx-auto flex w-full max-w-5xl flex-col gap-6'>
          {hasCompanies && (
            <div className='space-y-4'>
              <div>
                <h2 className='text-xl font-semibold'>{t('companies.title')}</h2>
                <p className='text-sm text-muted-foreground'>{t('companies.subtitle')}</p>
              </div>
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {companies?.map((company: Company) => (
                  <Card
                    key={company.id}
                    className='border-none bg-background/80 shadow-lg backdrop-blur-sm'
                  >
                    <CardHeader className='space-y-1'>
                      <CardTitle className='text-lg font-semibold'>{company.name}</CardTitle>
                      <CardDescription>{company.industry}</CardDescription>
                    </CardHeader>
                    <CardContent className='text-sm text-muted-foreground'>
                      {company.description || t('companies.no-description')}
                    </CardContent>
                    <CardFooter className='flex items-center justify-between'>
                      <span className='text-xs text-muted-foreground'>
                        {company.address || t('companies.no-address')}
                      </span>
                      <Button
                        variant='secondary'
                        size='sm'
                        onClick={() => selectCompanyMutation.mutate(company.id)}
                        disabled={selectCompanyMutation.isPending}
                      >
                        {t('companies.select')}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <Card className='border-none bg-background/80 shadow-lg backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='text-base'>{t('companies.loading')}</CardTitle>
                <CardDescription>{t('companies.loading-subtitle')}</CardDescription>
              </CardHeader>
            </Card>
          )}

          <Card className='w-full max-w-md self-center shadow-lg border-none bg-background/80 backdrop-blur-sm'>
            <CardHeader className='text-center space-y-2'>
              <div className='mx-auto bg-primary/10 p-3 rounded-full w-fit'>
                <Building2 className='h-6 w-6 text-primary' />
              </div>
              <CardTitle className='text-2xl font-bold'>{t('create-company.welcome')}</CardTitle>
              <CardDescription>{t('create-company.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateCompanyForm />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
