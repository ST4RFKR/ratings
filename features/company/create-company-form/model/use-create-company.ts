import { ROUTES } from '@/shared/config/routes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createCompany } from '../api/create-company';

export const useCreateCompany = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company created successfully');
      router.push(ROUTES.DASHBOARD.HOME);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create company');
    },
  });
};
