import { useQuery } from '@tanstack/react-query';
import { getEmployees, type GetEmployeesParams } from '../api/get-employees.api';

export function useGetEmployees(params: GetEmployeesParams = {}) {
  return useQuery({
    queryKey: ['employees', params.search ?? ''],
    queryFn: () => getEmployees(params),
  });
}
