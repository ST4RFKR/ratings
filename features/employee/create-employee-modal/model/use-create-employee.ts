import { getApiErrorMessage } from '@/shared/lib';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createEmployee } from '../api/create-employee.api';
import { CreateEmployeeFormValues } from './create-employee-schema';

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateEmployeeFormValues) => createEmployee(data),
    onSuccess: () => {
      toast.success('Employee created successfully');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error) || 'Failed to create employee');
    },
  });
}
