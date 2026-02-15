import z from 'zod/v3';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6, { message: 'Password is required' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
