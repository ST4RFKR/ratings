'use client';

import {
  Button,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import {
  assignableEmployeeRoles,
  assignableEmployeeStatuses,
  CreateEmployeeFormValues,
  createEmployeeSchema,
} from '../model/create-employee-schema';
import { useCreateEmployee } from '../model/use-create-employee';

interface CreateEmployeeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateEmployeeForm({ onSuccess, onCancel }: CreateEmployeeFormProps) {
  const t = useTranslations('dashboard.forms.employee');
  const { mutate: createEmployee, isPending } = useCreateEmployee();

  const form = useForm<CreateEmployeeFormValues>({
    resolver: zodResolver(createEmployeeSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: 'STAFF',
      status: 'ACTIVE',
    },
  });

  const onSubmit = (values: CreateEmployeeFormValues) => {
    createEmployee(values, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
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
            disabled={isPending}
            {...register('fullName')}
          />
          {errors.fullName && (
            <FieldDescription className='text-destructive'>{errors.fullName.message}</FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor='email'>{t('fields.email.label')}</FieldLabel>
          <Input
            id='email'
            type='email'
            placeholder={t('fields.email.placeholder')}
            disabled={isPending}
            {...register('email')}
          />
          {errors.email && <FieldDescription className='text-destructive'>{errors.email.message}</FieldDescription>}
        </Field>

        <Field>
          <FieldLabel htmlFor='password'>{t('fields.password.label')}</FieldLabel>
          <Input
            id='password'
            type='password'
            placeholder={t('fields.password.placeholder')}
            disabled={isPending}
            {...register('password')}
          />
          {errors.password && (
            <FieldDescription className='text-destructive'>{errors.password.message}</FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor='role'>{t('fields.role.label')}</FieldLabel>
          <Controller
            control={form.control}
            name='role'
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isPending}
              >
                <SelectTrigger
                  id='role'
                  className='w-full'
                >
                  <SelectValue placeholder={t('fields.role.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {assignableEmployeeRoles.map((role) => (
                    <SelectItem
                      key={role}
                      value={role}
                    >
                      {t(`options.roles.${role}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.role && <FieldDescription className='text-destructive'>{errors.role.message}</FieldDescription>}
        </Field>

        <Field>
          <FieldLabel htmlFor='status'>{t('fields.status.label')}</FieldLabel>
          <Controller
            control={form.control}
            name='status'
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isPending}
              >
                <SelectTrigger
                  id='status'
                  className='w-full'
                >
                  <SelectValue placeholder={t('fields.status.placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {assignableEmployeeStatuses.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                    >
                      {t(`options.statuses.${status}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && <FieldDescription className='text-destructive'>{errors.status.message}</FieldDescription>}
        </Field>

        <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            disabled={isPending}
            className='w-full sm:w-auto'
          >
            {t('actions.cancel')}
          </Button>
          <Button
            type='submit'
            disabled={isPending}
            className='w-full sm:w-auto'
          >
            {isPending ? t('actions.creating') : t('actions.create')}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
