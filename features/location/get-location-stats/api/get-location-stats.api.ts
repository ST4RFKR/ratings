import { apiInstance } from '@/shared/api/api-instance';

export type LocationStatsDto = {
  location: {
    id: string;
    name: string;
    slug: string;
    address: string | null;
  };
  kpi: {
    totalReviews: number;
    averageRating: number;
  };
  reviews: Array<{
    id: string;
    employeeId: string;
    employeeName: string;
    comment: string | null;
    createdAt: string;
    averageRating: number;
    scores: {
      speed: number;
      politeness: number;
      quality: number;
      professionalism: number;
      cleanliness: number;
    };
  }>;
  criteria: Array<{
    category: 'SPEED' | 'POLITENESS' | 'QUALITY' | 'PROFESSIONALISM' | 'CLEANLINESS';
    value: number;
  }>;
  monthlyTrend: Array<{
    key: string;
    reviews: number;
    averageRating: number;
  }>;
  recentRatings: Array<{
    label: string;
    rating: number;
  }>;
};

export async function getLocationStats(locationSlug: string): Promise<LocationStatsDto> {
  const response = await apiInstance.get<LocationStatsDto>(`/locations/${locationSlug}/stats`);

  return response.data;
}
