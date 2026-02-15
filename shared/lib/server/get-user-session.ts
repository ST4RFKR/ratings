import { nextAuthOptions } from '@/shared/auth/next-auth-options';
import { getServerSession } from 'next-auth';

export const getUserSession = async () => {
  const session = await getServerSession(nextAuthOptions);

  return session?.user ?? null;
};
