import { apiInstance } from '@/shared/api/api-instance';

export const getAllCompany = async () => {
  const response = await apiInstance.get(`/companies`);

  return response.data;
};
