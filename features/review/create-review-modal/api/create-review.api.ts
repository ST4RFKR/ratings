import { apiInstance } from '@/shared/api/api-instance';
import { CreateReviewFormValues } from '../model/create-review-schema';

export async function createReview(data: CreateReviewFormValues) {
  const response = await apiInstance.post('/reviews', data);

  return response.data;
}
