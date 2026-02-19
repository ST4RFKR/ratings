import { apiInstance } from '@/shared/api/api-instance';

export interface EmployeeDto {
  id: string;
  fullName: string;
  role: string;
  status: 'PENDING' | 'ACTIVE' | 'BLOCKED';
  rating: number;
  locationId: string | null;
  location: {
    name: string;
  } | null;
  user: {
    email: string;
  };
  _count: {
    reviews: number;
  };
}

export async function getEmployees(): Promise<EmployeeDto[]> {
  const response = await apiInstance.get<EmployeeDto[]>('/employees');

  return response.data;
}
