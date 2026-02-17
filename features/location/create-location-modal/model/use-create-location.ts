import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createLocation } from '../api/create-location.api';
import { CreateLocationFormValues } from './create-location-schema';

export function useCreateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateLocationFormValues) => createLocation(data),
    onSuccess: () => {
      toast.success('Location created successfully');
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create location');
    },
  });
}
