import { apiInstance } from '@/shared/api/api-instance';

export function getLocation() {
  const response = apiInstance.get('/locations');

  return response;
}
