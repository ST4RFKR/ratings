import { z } from 'zod/v3';

export const createLocationSchema = z.object({
  name: z.string().trim().min(2, { message: 'Location name must be at least 2 characters.' }),
  email: z.string().trim().email({ message: 'Please enter a valid email address.' }),
  address: z.string().trim().min(2, { message: 'Location must be at least 2 characters.' }),
  description: z.string().trim().optional(),
  industry: z.string().trim().optional(),
  isActive: z.boolean().optional(),
});

export type CreateLocationFormValues = z.infer<typeof createLocationSchema>;
