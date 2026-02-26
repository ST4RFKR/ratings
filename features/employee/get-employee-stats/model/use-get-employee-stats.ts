import { useQuery } from '@tanstack/react-query';
import { getEmployeeStats } from '../api/get-employee-stats.api';

export function useGetEmployeeStats(employeeId: string) {
  return useQuery({
    queryKey: ['employee-stats', employeeId],
    queryFn: () => getEmployeeStats(employeeId),
    enabled: Boolean(employeeId),
  });
}
