import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { ROUTES } from '@/shared/config/routes';
import { cn } from '@/shared/lib/utils';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
    const t = useTranslations('auth');
    return (
        <div
            className={cn('flex flex-col gap-6', className)}
            {...props}
        >
            <Card>
                <CardHeader className='text-center'>
                    <CardTitle className='text-xl'>{t('sign-up.title')}</CardTitle>
                    <CardDescription>{t('sign-up.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor='name'>Full Name</FieldLabel>
                                <Input
                                    id='name'
                                    type='text'
                                    placeholder='John Doe'
                                    required
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor='email'>Email</FieldLabel>
                                <Input
                                    id='email'
                                    type='email'
                                    placeholder='m@example.com'
                                    required
                                />
                            </Field>
                            <Field>
                                <Field className='grid grid-cols-2 gap-4'>
                                    <Field>
                                        <FieldLabel htmlFor='password'>Password</FieldLabel>
                                        <Input
                                            id='password'
                                            type='password'
                                            required
                                        />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor='confirm-password'>Confirm Password</FieldLabel>
                                        <Input
                                            id='confirm-password'
                                            type='password'
                                            required
                                        />
                                    </Field>
                                </Field>
                                <FieldDescription>Must be at least 8 characters long.</FieldDescription>
                            </Field>
                            <Field>
                                <Button type='submit'>{t('sign-up.title')}</Button>
                                <FieldDescription className='text-center'>
                                    {t('sign-up.sign-in-link')} <Link href={ROUTES.LOGIN}>{t('sign-up.sign-in-text')}</Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className='px-6 text-center'>
                By clicking continue, you agree to our <a href='#'>Terms of Service</a> and <a href='#'>Privacy Policy</a>.
            </FieldDescription>
        </div>
    );
}
