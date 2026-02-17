import { apiInstance } from '@/shared/api/api-instance';

export interface LocationDto {
  id: string;
  slug: string;
  name: string;
  rating: number;
  email: string | null;
  status: 'ACTIVE' | 'PENDING' | 'BLOCKED';
}

export async function getLocation(): Promise<LocationDto[]> {
  const response = await apiInstance.get<LocationDto[]>('/locations');

  return response.data;
}
