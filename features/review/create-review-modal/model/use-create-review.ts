import { getApiErrorMessage } from '@/shared/lib';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createReview } from '../api/create-review.api';
import { CreateReviewFormValues } from './create-review-schema';

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReviewFormValues) => createReview(data),
    onSuccess: () => {
      toast.success('Review created successfully');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error) || 'Failed to create review');
    },
  });
}
