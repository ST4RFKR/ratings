import { EmployeeRole, EmployeeStatus } from '@/prisma/generated/prisma/enums';
import prisma from '@/prisma/prisma-client';
import { ApiErrors } from '@/shared/lib/server/api-error';
import { getUserSession } from '@/shared/lib/server/get-user-session';
import { slug } from '@/shared/lib/server/slugify';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const user = await getUserSession();
    if (!user?.id) {
      return ApiErrors.unauthorized('Unauthorized');
    }

    const { companyId, locationId } = await req.json();
    if (!companyId || !locationId) {
      return ApiErrors.badRequest('companyId and locationId required');
    }

    const location = await prisma.location.findFirst({
      where: {
        id: locationId,
        companyId,
      },
      select: { id: true },
    });

    if (!location) {
      return ApiErrors.notFound('Location not found in selected company');
    }

    const existingEmployee = await prisma.employee.findFirst({
      where: { userId: user.id, companyId },
    });

    if (existingEmployee) {
      return ApiErrors.conflict('You are already a member of this company');
    }

    const fullName = user.name || `Employee ${user.id.slice(0, 8)}`;

    await prisma.employee.create({
      data: {
        userId: user.id,
        companyId,
        locationId,
        fullName,
        slug: slug(`${fullName}-${user.id.slice(0, 8)}`),
        status: EmployeeStatus.PENDING,
        role: EmployeeRole.STAFF,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { activeCompanyId: companyId },
    });

    return NextResponse.json({ message: 'Joined company and selected location. Pending approval.' });
  } catch (error) {
    console.error('Error joining company:', error);
    return ApiErrors.internal('Failed to join company');
  }
}
