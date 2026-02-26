import { apiInstance } from '@/shared/api/api-instance';

export interface LocationDto {
  id: string;
  slug: string;
  name: string;
  rating: number;
  email: string | null;
  status: 'ACTIVE' | 'PENDING' | 'BLOCKED';
}

export interface GetLocationsParams {
  search?: string;
}

export async function getLocation(params: GetLocationsParams = {}): Promise<LocationDto[]> {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set('search', params.search);
  }

  const query = searchParams.toString();
  const endpoint = query ? `/locations?${query}` : '/locations';

  const response = await apiInstance.get<LocationDto[]>(endpoint);

  return response.data;
}
