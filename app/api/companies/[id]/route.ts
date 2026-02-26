import { EmployeeRole } from '@/prisma/generated/prisma/enums';
import prisma from '@/prisma/prisma-client';
import { ApiErrors } from '@/shared/lib/server/api-error';
import { withApiGuard } from '@/shared/lib/server/with-api-guard';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withApiGuard<{ id: string }>(
    async ({ req, companyId }) => {
      try {
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
    },
    {
      requireActiveCompany: true,
      requireActiveEmployee: true,
      allowedEmployeeRoles: [EmployeeRole.OWNER],
      resolveCompanyId: ({ params }) => params.id,
    },
  )(req, { params });
}
