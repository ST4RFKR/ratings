import z from 'zod/v3';

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, { message: 'Full name must contain at least 2 characters' })
      .max(100, { message: 'Full name is too long' }),
    email: z.string().trim().email({ message: 'Invalid email' }),
    password: z
      .string()
      .min(6, { message: 'Password must contain at least 8 characters' })
      .max(64, { message: 'Password is too long' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupFormValues = z.infer<typeof signUpSchema>;
