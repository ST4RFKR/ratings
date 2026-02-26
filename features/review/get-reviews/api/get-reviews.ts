import { apiInstance } from '@/shared/api/api-instance';

export interface ReviewDto {
  id: string;
  comment: string | null;
  createdAt: string;
  rating: number;
  employee: {
    id: string;
    slug: string;
    fullName: string;
  };
  location: {
    id: string;
    slug: string;
    name: string;
  };
}

export interface GetReviewsParams {
  employeeId?: string;
  locationId?: string;
  search?: string;
}

export async function getReviews(params: GetReviewsParams = {}): Promise<ReviewDto[]> {
  const searchParams = new URLSearchParams();

  if (params.employeeId) {
    searchParams.set('employeeId', params.employeeId);
  }

  if (params.locationId) {
    searchParams.set('locationId', params.locationId);
  }

  if (params.search) {
    searchParams.set('search', params.search);
  }

  const query = searchParams.toString();
  const endpoint = query ? `/reviews?${query}` : '/reviews';

  const response = await apiInstance.get<ReviewDto[]>(endpoint);

  return response.data;
}
