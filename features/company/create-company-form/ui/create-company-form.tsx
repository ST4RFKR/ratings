'use client';

import {
  Button,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
  Textarea,
} from '@/shared/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { CreateCompanyFormValues, createCompanySchema } from '../model/create-company-schema';
import { useCreateCompany } from '../model/use-create-company';

export const CreateCompanyForm = () => {
  const t = useTranslations('auth');
  const { mutate: createCompany, isPending } = useCreateCompany();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCompanyFormValues>({
    resolver: zodResolver(createCompanySchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      industry: '',
      address: '',
      description: '',
    },
  });

  function onSubmit(values: CreateCompanyFormValues) {
    createCompany(values);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='w-full max-w-2xl space-y-3'
    >
      <FieldGroup className='gap-4 sm:gap-5'>
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <Field>
            <FieldLabel htmlFor='name'>Company Name</FieldLabel>
            <Input
              id='name'
              placeholder='Enter company name'
              disabled={isPending}
              {...register('name')}
            />
            {errors.name && <FieldDescription className='text-destructive'>{errors.name.message}</FieldDescription>}
          </Field>

          <Field>
            <FieldLabel htmlFor='industry'>Industry</FieldLabel>
            <Input
              id='industry'
              placeholder='e.g. Retail, Tech, Hospitality'
              disabled={isPending}
              {...register('industry')}
            />
            {errors.industry && (
              <FieldDescription className='text-destructive'>{errors.industry.message}</FieldDescription>
            )}
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor='email'>Email</FieldLabel>
          <Input
            id='email'
            type='email'
            placeholder='e.g. company@company.com'
            disabled={isPending}
            {...register('email')}
          />
          {errors.email && <FieldDescription className='text-destructive'>{errors.email.message}</FieldDescription>}
        </Field>

        <Field>
          <FieldLabel htmlFor='address'>Address</FieldLabel>
          <Input
            id='address'
            placeholder='e.g. 123 Main St, Anytown, USA'
            disabled={isPending}
            {...register('address')}
          />
          {errors.address && <FieldDescription className='text-destructive'>{errors.address.message}</FieldDescription>}
        </Field>

        <Field>
          <FieldLabel htmlFor='description'>Description</FieldLabel>
          <Textarea
            id='description'
            placeholder='Tell us a bit about your company'
            className='resize-none'
            disabled={isPending}
            {...register('description')}
          />
          <FieldDescription>Briefly describe what your company does.</FieldDescription>
          {errors.description && (
            <FieldDescription className='text-destructive'>{errors.description.message}</FieldDescription>
          )}
        </Field>

        <Button
          type='submit'
          className='w-full sm:w-auto'
          disabled={isPending}
        >
          {isPending ? 'Creating...' : t('create-company.title')}
        </Button>
      </FieldGroup>
    </form>
  );
};
