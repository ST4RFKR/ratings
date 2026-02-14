import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z.string().min(2, {
    message: 'Company name must be at least 2 characters.',
  }),
  address: z.string().min(2, {
    message: 'Address must be at least 2 characters.',
  }),
  industry: z.string().min(2, {
    message: 'Industry must be at least 2 characters.',
  }),
  description: z.string().optional(),
});

export type CreateCompanyFormValues = z.infer<typeof createCompanySchema>;
