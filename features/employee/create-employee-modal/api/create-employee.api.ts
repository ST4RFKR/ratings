import { apiInstance } from '@/shared/api/api-instance';
import { CreateEmployeeFormValues } from '../model/create-employee-schema';

export async function createEmployee(data: CreateEmployeeFormValues) {
  const response = await apiInstance.post('/employees', data);
  return response.data;
}
