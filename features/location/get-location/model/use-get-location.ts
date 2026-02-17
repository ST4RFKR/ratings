import { useQuery } from '@tanstack/react-query';
import { getLocation } from '../api/get-location';

export function useGetLocation() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: getLocation,
  });
}
