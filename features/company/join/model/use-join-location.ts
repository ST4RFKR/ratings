import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ROUTES } from '@/shared/config';
import { getApiErrorMessage } from '@/shared/lib';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { joinCompanyLocation } from '../api/join-company-location';

export const useJoinLocation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ companyId, locationId }: { companyId: string; locationId: string }) =>
      joinCompanyLocation({ companyId, locationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Company joined successfully');
      router.push(ROUTES.DASHBOARD.HOME);
    },
    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error) || 'Failed to join company');
    },
  });
};
