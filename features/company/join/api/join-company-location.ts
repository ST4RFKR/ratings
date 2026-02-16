import { apiInstance } from '@/shared/api/api-instance';

export const joinCompanyLocation = async ({ companyId, locationId }: { companyId: string; locationId: string }) => {
  const response = await apiInstance.post('/companies/join/location', { companyId, locationId });

  return response.data;
};
