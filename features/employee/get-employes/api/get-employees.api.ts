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

export interface GetEmployeesParams {
  search?: string;
}

export async function getEmployees(params: GetEmployeesParams = {}): Promise<EmployeeDto[]> {
  const searchParams = new URLSearchParams();

  if (params.search) {
    searchParams.set('search', params.search);
  }

  const query = searchParams.toString();
  const endpoint = query ? `/employees?${query}` : '/employees';

  const response = await apiInstance.get<EmployeeDto[]>(endpoint);

  return response.data;
}
