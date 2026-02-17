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
import { Controller, useForm } from 'react-hook-form';
import { CreateLocationFormValues, createLocationSchema } from '../model/create-location-schema';
import { useCreateLocation } from '../model/use-create-location';

interface CreateLocationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateLocationForm({ onSuccess, onCancel }: CreateLocationFormProps) {
  const { mutate: createLocation, isPending } = useCreateLocation();

  const form = useForm<CreateLocationFormValues>({
    resolver: zodResolver(createLocationSchema),
    defaultValues: {
      name: '',
      email: '',
      address: '',
      description: '',
      industry: '',
      isActive: true,
    },
  });

  const onSubmit = (values: CreateLocationFormValues) => {
    createLocation(values, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });

    console.log(values);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-4'
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='name'>Название локации</FieldLabel>
          <Input
            id='name'
            placeholder='Например: Downtown'
            disabled={isPending}
            {...register('name')}
          />
          {errors.name && <FieldDescription className='text-destructive'>{errors.name.message}</FieldDescription>}
        </Field>

        <Field>
          <FieldLabel htmlFor='email'>Email</FieldLabel>
          <Input
            id='email'
            type='email'
            placeholder='location@company.com'
            disabled={isPending}
            {...register('email')}
          />
          {errors.email && <FieldDescription className='text-destructive'>{errors.email.message}</FieldDescription>}
        </Field>

        <Field>
          <FieldLabel htmlFor='address'>Адрес</FieldLabel>
          <Input
            id='address'
            placeholder='Улица, дом, город'
            disabled={isPending}
            {...register('address')}
          />
          {errors.address && <FieldDescription className='text-destructive'>{errors.address.message}</FieldDescription>}
        </Field>

        <Field>
          <FieldLabel htmlFor='industry'>Индустрия</FieldLabel>
          <Input
            id='industry'
            placeholder='Retail, Food, Services...'
            disabled={isPending}
            {...register('industry')}
          />
          {errors.industry && (
            <FieldDescription className='text-destructive'>{errors.industry.message}</FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor='description'>Описание</FieldLabel>
          <Textarea
            id='description'
            placeholder='Краткое описание локации'
            className='resize-none'
            disabled={isPending}
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
              className='items-start gap-3 rounded-md bg-muted/30 p-3'
            >
              <Checkbox
                id='isActive'
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                disabled={isPending}
              />
              <div className='space-y-1'>
                <FieldLabel htmlFor='isActive'>Активная локация</FieldLabel>
                <FieldDescription>Сразу будет доступна сотрудникам после создания.</FieldDescription>
              </div>
            </Field>
          )}
        />

        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            disabled={isPending}
          >
            Отмена
          </Button>
          <Button
            type='submit'
            disabled={isPending}
          >
            {isPending ? 'Создание...' : 'Создать'}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
