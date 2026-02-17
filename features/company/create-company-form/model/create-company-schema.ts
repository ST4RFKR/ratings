import { z } from 'zod/v3';

export const createCompanySchema = z.object({
  name: z.string().min(2, {
    message: 'Company name must be at least 2 characters.',
  }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  industry: z.string().min(2, {
    message: 'Industry must be at least 2 characters.',
  }),
  address: z.string().min(5, {
    message: 'Address must be at least 5 characters.',
  }),
  description: z.string().optional(),
});

export type CreateCompanyFormValues = z.infer<typeof createCompanySchema>;
