import { useQuery } from '@tanstack/react-query';
import { getAllCompany } from '../api/get-user-all-company';

export function useGetAllCompanyByUser() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: () => getAllCompany(),
  });
}
