import { apiInstance } from '@/shared/api/api-instance';

export const joinCompany = async ({ joinCode }: { joinCode: string }) => {
  const response = await apiInstance.post('/companies/join', { joinCode });

  return response.data;
};
