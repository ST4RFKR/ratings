import { CreateCompanyForm } from '@/features/company/create-company-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Building2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function CreateCompanyPage() {
    const t = useTranslations('auth');
    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-muted/30">
            <Card className="w-full max-w-md shadow-lg border-none bg-background/80 backdrop-blur-sm">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
                        <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">{t('create-company.welcome')}</CardTitle>
                    <CardDescription>
                        {t('create-company.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CreateCompanyForm />
                </CardContent>
            </Card>
        </div>
    );
}
