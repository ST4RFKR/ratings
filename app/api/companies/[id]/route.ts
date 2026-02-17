import { EmployeeRole } from '@/prisma/generated/prisma/enums';
import prisma from '@/prisma/prisma-client';
import { nextAuthOptions } from '@/shared/auth/next-auth-options';
import { ApiErrors } from '@/shared/lib/server/api-error';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getServerSession(nextAuthOptions);

    if (!session || !session.user) {
      return ApiErrors.unauthorized('Unauthorized');
    }

    const companyId = id;
    if (!companyId) {
      return ApiErrors.badRequest('companyId is required');
    }

    const body = await req.json();
    const { name, industry, address, description, status } = body;

    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      return ApiErrors.notFound('Company not found');
    }

    const employee = await prisma.employee.findFirst({
      where: {
        companyId,
        userId: session.user.id,
        status: 'ACTIVE',
        role: EmployeeRole.OWNER,
      },
    });

    if (!employee) {
      return ApiErrors.forbidden('Forbidden');
    }

    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        name: name ?? company.name,
        industry: industry ?? company.industry,
        address: address ?? company.address,
        description: description ?? company.description,
        status: status ?? company.status,
      },
    });

    return NextResponse.json(updatedCompany, { status: 200 });
  } catch (error) {
    console.error('Error updating company:', error);
    return ApiErrors.internal('Internal server error');
  }
}
