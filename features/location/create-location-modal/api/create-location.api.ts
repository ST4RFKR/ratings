import { apiInstance } from '@/shared/api/api-instance';
import { CreateLocationFormValues } from '../model/create-location-schema';

export const createLocation = async (data: CreateLocationFormValues) => {
  const response = await apiInstance.post('/locations', data);

  return response.data;
};
