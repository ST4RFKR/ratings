'use client';

import {
  Button,
  Checkbox,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
  Textarea,
} from '@/shared/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { CreateEmployeeFormValues, createEmployeeSchema } from '../model/create-employee-schema';

interface CreateEmployeeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateEmployeeForm({ onSuccess, onCancel }: CreateEmployeeFormProps) {
  const t = useTranslations('dashboard.forms.employee');

  const form = useForm<CreateEmployeeFormValues>({
    resolver: zodResolver(createEmployeeSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      role: '',
      location: '',
      description: '',
      isActive: true,
    },
  });

  const onSubmit = (values: CreateEmployeeFormValues) => {
    console.log(values);
    toast.success(t('messages.success'));
    form.reset();
    onSuccess?.();
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-3'
    >
      <FieldGroup className='gap-4 sm:gap-5'>
        <Field>
          <FieldLabel htmlFor='fullName'>{t('fields.fullName.label')}</FieldLabel>
          <Input
            id='fullName'
            placeholder={t('fields.fullName.placeholder')}
            disabled={isSubmitting}
            {...register('fullName')}
          />
          {errors.fullName && <FieldDescription className='text-destructive'>{errors.fullName.message}</FieldDescription>}
        </Field>

        <Field>
          <FieldLabel htmlFor='email'>{t('fields.email.label')}</FieldLabel>
          <Input
            id='email'
            type='email'
            placeholder={t('fields.email.placeholder')}
            disabled={isSubmitting}
            {...register('email')}
          />
          {errors.email && <FieldDescription className='text-destructive'>{errors.email.message}</FieldDescription>}
        </Field>

        <Field>
          <FieldLabel htmlFor='role'>{t('fields.role.label')}</FieldLabel>
          <Input
            id='role'
            placeholder={t('fields.role.placeholder')}
            disabled={isSubmitting}
            {...register('role')}
          />
          {errors.role && <FieldDescription className='text-destructive'>{errors.role.message}</FieldDescription>}
        </Field>

        <Field>
          <FieldLabel htmlFor='location'>{t('fields.location.label')}</FieldLabel>
          <Input
            id='location'
            placeholder={t('fields.location.placeholder')}
            disabled={isSubmitting}
            {...register('location')}
          />
          {errors.location && <FieldDescription className='text-destructive'>{errors.location.message}</FieldDescription>}
        </Field>

        <Field>
          <FieldLabel htmlFor='description'>{t('fields.description.label')}</FieldLabel>
          <Textarea
            id='description'
            placeholder={t('fields.description.placeholder')}
            className='resize-none'
            disabled={isSubmitting}
            {...register('description')}
          />
          {errors.description && (
            <FieldDescription className='text-destructive'>{errors.description.message}</FieldDescription>
          )}
        </Field>

        <Controller
          control={form.control}
          name='isActive'
          render={({ field }) => (
            <Field
              orientation='horizontal'
              className='items-start gap-2.5 rounded-md bg-muted/30 p-2.5 sm:p-3'
            >
              <Checkbox
                id='isActive'
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                disabled={isSubmitting}
              />
              <div className='space-y-1'>
                <FieldLabel htmlFor='isActive'>{t('fields.isActive.label')}</FieldLabel>
                <FieldDescription>{t('fields.isActive.description')}</FieldDescription>
              </div>
            </Field>
          )}
        />

        <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            disabled={isSubmitting}
            className='w-full sm:w-auto'
          >
            {t('actions.cancel')}
          </Button>
          <Button
            type='submit'
            disabled={isSubmitting}
            className='w-full sm:w-auto'
          >
            {isSubmitting ? t('actions.creating') : t('actions.create')}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
