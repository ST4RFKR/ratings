import { EmployeeRole } from '@/prisma/generated/prisma/enums';
import prisma from '@/prisma/prisma-client';
import { ApiErrors } from '@/shared/lib/server/api-error';
import { getUserSession } from '@/shared/lib/server/get-user-session';
import { slug } from '@/shared/lib/server/slugify';
import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(req: NextRequest) {
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
        role: {
          in: [EmployeeRole.OWNER, EmployeeRole.MANAGER],
        },
      },
    });

    if (!employee) {
      return ApiErrors.forbidden('Forbidden');
    }

    const { name, address, email, description, industry, isActive } = await req.json();

    const status = isActive ? 'ACTIVE' : 'PENDING';

    const location = await prisma.location.create({
      data: {
        name,
        slug: slug(name),
        email,
        address,
        description,
        industry,
        status,
        companyId: user.activeCompanyId,
      },
    });
    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return ApiErrors.internal('Internal server error');
  }
}
