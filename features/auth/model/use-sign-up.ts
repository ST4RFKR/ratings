'use client';
import { ROUTES } from '@/shared/config';
import { getApiErrorMessage } from '@/shared/lib';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signUp } from '../api/sign-up.api';
import { SignupFormValues } from './sign-up.schema';

export function useSignUp() {
  const router = useRouter();
  return useMutation({
    mutationFn: (data: SignupFormValues) => signUp(data),
    onSuccess: () => {
      toast.success('Sign up successful');
      router.push(ROUTES.LOGIN);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to sign up'));
    },
  });
}
