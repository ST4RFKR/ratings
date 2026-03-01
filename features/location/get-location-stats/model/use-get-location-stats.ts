import { useQuery } from '@tanstack/react-query';
import { getLocationStats } from '../api/get-location-stats.api';

export function useGetLocationStats(locationSlug: string) {
  return useQuery({
    queryKey: ['location-stats', locationSlug],
    queryFn: () => getLocationStats(locationSlug),
    enabled: Boolean(locationSlug),
  });
}
