import { useQuery } from '@tanstack/react-query';
import { getEmployees } from '../api/get-employees.api';

export function useGetEmployees() {
  return useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees,
  });
}
