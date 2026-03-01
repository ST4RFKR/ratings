import { apiInstance } from '@/shared/api/api-instance';

export type EmployeeStatsDto = {
  reviews: Array<{
    id: string;
    locationName: string;
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
  employee: {
    id: string;
    fullName: string;
    role: string;
    locationName: string | null;
  };
  kpi: {
    totalReviews: number;
    averageRating: number;
  };
  monthlyTrend: Array<{
    key: string;
    reviews: number;
    averageRating: number;
  }>;
  byLocation: Array<{
    label: string;
    reviews: number;
    averageRating: number;
    criteria: Array<{
      category: 'SPEED' | 'POLITENESS' | 'QUALITY' | 'PROFESSIONALISM' | 'CLEANLINESS';
      value: number;
    }>;
  }>;
  recentRatings: Array<{
    label: string;
    rating: number;
  }>;
};

export async function getEmployeeStats(employeeId: string): Promise<EmployeeStatsDto> {
  const response = await apiInstance.get<EmployeeStatsDto>(`/employees/${employeeId}/stats`);

  return response.data;
}
