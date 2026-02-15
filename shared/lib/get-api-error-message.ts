import { AxiosError } from 'axios';

type ApiErrorData = {
  message?: string;
};

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong') {
  if (error instanceof AxiosError) {
    return (error.response?.data as ApiErrorData | undefined)?.message || fallback;
  }

  return fallback;
}
