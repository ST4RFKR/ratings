import { z } from 'zod';

export const createStoreSchema = z.object({
  name: z.string().min(2, {
    message: 'Store name must be at least 2 characters.',
  }),
  location: z.string().min(2, {
    message: 'Location must be at least 2 characters.',
  }),
  description: z.string().optional(),
});

export type CreateStoreFormValues = z.infer<typeof createStoreSchema>;
