import type { UserRole } from '@prisma/client';
import { DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      name: string;
      image: string;
      activeCompanyId?: string | null;
      email?: string | null;
    };
  }

  interface User extends DefaultUser {
    id: number;
    role: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: UserRole;
    activeCompanyId?: string | null;
  }
}
