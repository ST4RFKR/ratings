import { apiInstance } from '@/shared/api/api-instance';
import { SignupFormValues } from '../model/sign-up.schema';

export type SignUpResponse = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  verified: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function signUp(data: SignupFormValues) {
  const response = await apiInstance.post<SignUpResponse>('/auth/sign-up', data);

  return response.data;
}
