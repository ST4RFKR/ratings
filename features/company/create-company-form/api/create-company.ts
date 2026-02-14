import { apiInstance } from '@/shared/api/api-instance';
import { CreateCompanyFormValues } from '../model/create-company-schema';

export const createCompany = async (data: CreateCompanyFormValues) => {
  const response = await apiInstance.post('/companies', data);

  return response.data;
};
