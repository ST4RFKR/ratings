import { useQuery } from '@tanstack/react-query';
import { getLocation, type GetLocationsParams } from '../api/get-location';

export function useGetLocation(params: GetLocationsParams = {}) {
  return useQuery({
    queryKey: ['locations', params.search ?? ''],
    queryFn: () => getLocation(params),
  });
}
