import prisma from '@/prisma/prisma-client';
import { ApiErrors } from '@/shared/lib/server/api-error';
import { getUserSession } from '@/shared/lib/server/get-user-session';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await getUserSession();

    if (!user || !user.activeCompanyId) {
      return ApiErrors.unauthorized('Unauthorized');
    }

    const employee = await prisma.employee.findFirst({
      where: {
        userId: user.id,
        companyId: user.activeCompanyId,
        status: 'ACTIVE',
      },
    });

    if (!employee) {
      return ApiErrors.forbidden('Forbidden');
    }

    const locations = await prisma.location.findMany({
      where: {
        companyId: employee.companyId,
      },
    });
    return NextResponse.json(locations, { status: 200 });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return ApiErrors.internal('Internal server error');
  }
}
