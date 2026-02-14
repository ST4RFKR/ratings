'use client';

import { Button } from '@/shared/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useTranslations } from 'next-intl';
import { CreateCompanyFormValues, createCompanySchema } from '../model/create-company-schema';

import { useCreateCompany } from '../model/use-create-company';

export const CreateCompanyForm = () => {
  const t = useTranslations('auth');
  const { mutate: createCompany, isPending } = useCreateCompany();
  const form = useForm<CreateCompanyFormValues>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: '',
      industry: '',
      address: '',
      description: '',
    },
  });

  function onSubmit(values: CreateCompanyFormValues) {
    createCompany(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4 w-full max-w-md'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter company name'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='industry'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
              <FormControl>
                <Input
                  placeholder='e.g. Retail, Tech, Hospitality'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input
                  placeholder='e.g. 123 Main St, Anytown, USA...'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Tell us a bit about your company'
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormDescription>Briefly describe what your company does.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='w-full'
          disabled={isPending}
        >
          {isPending ? 'Creating...' : t('create-company.title')}
        </Button>
      </form>
    </Form>
  );
};
