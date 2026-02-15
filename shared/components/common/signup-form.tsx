'use client';
import { SignupFormValues, signUpSchema } from '@/features/auth/model/sign-up.schema';
import { useSignUp } from '@/features/auth/model/use-sign-up';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
} from '@/shared/components/ui';
import { ROUTES } from '@/shared/config';
import { cn } from '@/shared/lib';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
  const t = useTranslations('auth');
  const signUp = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

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
          <form onSubmit={handleSubmit((data) => signUp.mutate(data))}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='name'>Full Name</FieldLabel>
                <Input
                  id='name'
                  {...register('fullName')}
                  type='text'
                  placeholder='John Doe'
                  autoComplete='name'
                  disabled={signUp.isPending}
                />
                {errors.fullName && (
                  <FieldDescription className='text-destructive'>{errors.fullName.message}</FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input
                  id='email'
                  {...register('email')}
                  type='email'
                  placeholder='m@example.com'
                  autoComplete='email'
                  disabled={signUp.isPending}
                />
                {errors.email && (
                  <FieldDescription className='text-destructive'>{errors.email.message}</FieldDescription>
                )}
              </Field>
              <Field>
                <Field className='grid grid-cols-2 gap-4'>
                  <Field>
                    <FieldLabel htmlFor='password'>Password</FieldLabel>
                    <Input
                      id='password'
                      {...register('password')}
                      type='password'
                      autoComplete='new-password'
                      disabled={signUp.isPending}
                    />
                    {errors.password && (
                      <FieldDescription className='text-destructive'>{errors.password.message}</FieldDescription>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor='confirm-password'>Confirm Password</FieldLabel>
                    <Input
                      id='confirm-password'
                      {...register('confirmPassword')}
                      type='password'
                      autoComplete='new-password'
                      disabled={signUp.isPending}
                    />
                    {errors.confirmPassword && (
                      <FieldDescription className='text-destructive'>
                        {errors.confirmPassword?.message}
                      </FieldDescription>
                    )}
                  </Field>
                </Field>
                <FieldDescription>Must be at least 6 characters long.</FieldDescription>
              </Field>
              <Field>
                <Button
                  type='submit'
                  disabled={signUp.isPending}
                >
                  {signUp.isPending ? 'Creating account...' : t('sign-up.title')}
                </Button>
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
