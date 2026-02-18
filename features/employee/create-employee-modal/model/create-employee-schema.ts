import { z } from 'zod/v3';

export const assignableEmployeeRoles = [
  'SUPERVISOR',
  'REVIEWER',
  'CASHIER',
  'SALES',
  'WAITER',
  'COOK',
  'STAFF',
] as const;

export const assignableEmployeeStatuses = ['PENDING', 'ACTIVE'] as const;

export const createEmployeeSchema = z.object({
  fullName: z.string().trim().min(2, { message: 'Employee name must be at least 2 characters.' }),
  email: z.string().trim().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  role: z.enum(assignableEmployeeRoles, {
    errorMap: () => ({ message: 'Please select a valid role.' }),
  }),
  status: z.enum(assignableEmployeeStatuses, {
    errorMap: () => ({ message: 'Please select a valid status.' }),
  }),
});

export type CreateEmployeeFormValues = z.infer<typeof createEmployeeSchema>;
