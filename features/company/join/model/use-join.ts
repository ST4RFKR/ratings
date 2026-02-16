import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getApiErrorMessage } from '@/shared/lib';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { joinCompany } from '../api/join-company';

export const useJoin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ joinCode }: { joinCode: string }) => joinCompany({ joinCode }),
    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error) || 'Failed to join company');
    },
  });
};
