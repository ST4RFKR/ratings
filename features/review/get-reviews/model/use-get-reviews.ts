import { useQuery } from '@tanstack/react-query';
import { getReviews, type GetReviewsParams } from '../api/get-reviews';

export function useGetReviews(params: GetReviewsParams) {
  return useQuery({
    queryKey: ['reviews', params.employeeId ?? '', params.locationId ?? '', params.search ?? ''],
    queryFn: () => getReviews(params),
  });
}
