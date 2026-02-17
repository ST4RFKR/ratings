import { z } from 'zod/v3';

export const createEmployeeSchema = z.object({
  fullName: z.string().trim().min(2, { message: 'Employee name must be at least 2 characters.' }),
  email: z.string().trim().email({ message: 'Please enter a valid email address.' }),
  role: z.string().trim().min(2, { message: 'Role must be at least 2 characters.' }),
  location: z.string().trim().min(2, { message: 'Location must be at least 2 characters.' }),
  description: z.string().trim().optional(),
  isActive: z.boolean().optional(),
});

export type CreateEmployeeFormValues = z.infer<typeof createEmployeeSchema>;
