'use client';

import { useGetEmployees } from '@/features/employee/get-employes';
import { useGetLocation } from '@/features/location/get-location/model/use-get-location';
import {
  Button,
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Textarea,
} from '@/shared/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CreateReviewFormValues, createReviewSchema, reviewScoreRange } from '../model/create-review-schema';
import { useCreateReview } from '../model/use-create-review';

interface CreateReviewFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface ReviewComboboxItem {
  id: string;
  label: string;
}

export function CreateReviewForm({ onSuccess, onCancel }: CreateReviewFormProps) {
  const t = useTranslations('dashboard.forms.review');
  const { mutate: createReview, isPending } = useCreateReview();
  const employeesQuery = useGetEmployees();
  const locationsQuery = useGetLocation();

  const employees = useMemo(
    () =>
      (employeesQuery.data ?? [])
        .filter((employee) => employee.status === 'ACTIVE')
        .map((employee) => ({ id: employee.id, label: employee.fullName })),
    [employeesQuery.data],
  );
  const locations = useMemo(
    () =>
      (locationsQuery.data ?? [])
        .filter((location) => location.status === 'ACTIVE')
        .map((location) => ({ id: location.id, label: location.name })),
    [locationsQuery.data],
  );

  const hasAvailableEmployees = employees.length > 0;
  const hasAvailableLocations = locations.length > 0;

  const form = useForm<CreateReviewFormValues>({
    resolver: zodResolver(createReviewSchema),
    mode: 'onChange',
    defaultValues: {
      employeeId: '',
      locationId: '',
      speed: 5,
      politeness: 5,
      quality: 5,
      professionalism: 5,
      cleanliness: 5,
      comment: '',
    },
  });

  const onSubmit = (values: CreateReviewFormValues) => {
    createReview(values, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  };

  const {
    register,
    control,
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
          <FieldLabel htmlFor='employeeId'>{t('fields.employee.label')}</FieldLabel>
          <Controller
            control={control}
            name='employeeId'
            render={({ field }) => {
              const selected = employees.find((employee) => employee.id === field.value) ?? null;

              return (
                <Combobox<ReviewComboboxItem>
                  items={employees}
                  value={selected}
                  onValueChange={(item) => field.onChange(item?.id ?? '')}
                >
                  <ComboboxInput
                    placeholder={t('fields.employee.placeholder')}
                    disabled={isPending || employeesQuery.isLoading || !hasAvailableEmployees}
                    showClear
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>{t('fields.employee.empty')}</ComboboxEmpty>
                    <ComboboxList>
                      {(employee) => (
                        <ComboboxItem
                          key={employee.id}
                          value={employee}
                        >
                          {employee.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              );
            }}
          />
          {employeesQuery.isLoading && <FieldDescription>{t('fields.employee.loading')}</FieldDescription>}
          {!employeesQuery.isLoading && !hasAvailableEmployees && (
            <FieldDescription className='text-destructive'>{t('fields.employee.empty')}</FieldDescription>
          )}
          {errors.employeeId && (
            <FieldDescription className='text-destructive'>{errors.employeeId.message}</FieldDescription>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor='locationId'>{t('fields.location.label')}</FieldLabel>
          <Controller
            control={control}
            name='locationId'
            render={({ field }) => {
              const selected = locations.find((location) => location.id === field.value) ?? null;

              return (
                <Combobox<ReviewComboboxItem>
                  items={locations}
                  value={selected}
                  onValueChange={(item) => field.onChange(item?.id ?? '')}
                >
                  <ComboboxInput
                    placeholder={t('fields.location.placeholder')}
                    disabled={isPending || locationsQuery.isLoading || !hasAvailableLocations}
                    showClear
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>{t('fields.location.empty')}</ComboboxEmpty>
                    <ComboboxList>
                      {(location) => (
                        <ComboboxItem
                          key={location.id}
                          value={location}
                        >
                          {location.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              );
            }}
          />
          {locationsQuery.isLoading && <FieldDescription>{t('fields.location.loading')}</FieldDescription>}
          {!locationsQuery.isLoading && !hasAvailableLocations && (
            <FieldDescription className='text-destructive'>{t('fields.location.empty')}</FieldDescription>
          )}
          {errors.locationId && (
            <FieldDescription className='text-destructive'>{errors.locationId.message}</FieldDescription>
          )}
        </Field>

        <div className='space-y-2 rounded-md border p-3'>
          <p className='text-sm font-medium'>{t('modal.description')}</p>
          <div className='space-y-1'>
            <Controller
              control={control}
              name='speed'
              render={({ field }) => (
                <ScoreRow
                  label={t('fields.speed.label')}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPending}
                />
              )}
            />
            <Controller
              control={control}
              name='politeness'
              render={({ field }) => (
                <ScoreRow
                  label={t('fields.politeness.label')}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPending}
                />
              )}
            />
            <Controller
              control={control}
              name='quality'
              render={({ field }) => (
                <ScoreRow
                  label={t('fields.quality.label')}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPending}
                />
              )}
            />
            <Controller
              control={control}
              name='professionalism'
              render={({ field }) => (
                <ScoreRow
                  label={t('fields.professionalism.label')}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPending}
                />
              )}
            />
            <Controller
              control={control}
              name='cleanliness'
              render={({ field }) => (
                <ScoreRow
                  label={t('fields.cleanliness.label')}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isPending}
                />
              )}
            />
          </div>
          {(errors.speed || errors.politeness || errors.quality || errors.professionalism || errors.cleanliness) && (
            <FieldDescription className='text-destructive'>
              {errors.speed?.message ||
                errors.politeness?.message ||
                errors.quality?.message ||
                errors.professionalism?.message ||
                errors.cleanliness?.message}
            </FieldDescription>
          )}
        </div>

        <Field>
          <FieldLabel htmlFor='comment'>{t('fields.comment.label')}</FieldLabel>
          <Textarea
            id='comment'
            placeholder={t('fields.comment.placeholder')}
            disabled={isPending}
            rows={3}
            {...register('comment')}
          />
          {errors.comment && <FieldDescription className='text-destructive'>{errors.comment.message}</FieldDescription>}
        </Field>

        <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              if (onCancel) {
                onCancel();
                return;
              }

              form.reset();
            }}
            disabled={isPending}
            className='w-full sm:w-auto'
          >
            {t('actions.cancel')}
          </Button>
          <Button
            type='submit'
            disabled={
              isPending ||
              employeesQuery.isLoading ||
              locationsQuery.isLoading ||
              !hasAvailableEmployees ||
              !hasAvailableLocations
            }
            className='w-full sm:w-auto'
          >
            {isPending ? t('actions.create_loading') : t('actions.create')}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}

function ScoreRow({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
}) {
  const normalizedValue = Math.min(reviewScoreRange.max, Math.max(reviewScoreRange.min, Number(value) || 0));
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const previewValue = hoveredValue ?? normalizedValue;

  return (
    <div className='flex items-center justify-between gap-3'>
      <span className='text-sm text-muted-foreground'>{label}</span>
      <div className='flex items-center gap-1'>
        {Array.from({ length: reviewScoreRange.max }, (_, index) => {
          const scoreValue = index + reviewScoreRange.min;
          const isActive = scoreValue <= previewValue;

          return (
            <button
              key={scoreValue}
              type='button'
              onMouseEnter={() => setHoveredValue(scoreValue)}
              onMouseLeave={() => setHoveredValue(null)}
              onFocus={() => setHoveredValue(scoreValue)}
              onBlur={() => setHoveredValue(null)}
              onClick={() => onChange(scoreValue)}
              disabled={disabled}
              className='rounded-sm p-0.5 transition disabled:cursor-not-allowed disabled:opacity-50'
              aria-label={`${label}: ${scoreValue}`}
            >
              <Star
                className={isActive ? 'h-4 w-4 fill-yellow-400 text-yellow-400' : 'h-4 w-4 text-muted-foreground/50'}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
