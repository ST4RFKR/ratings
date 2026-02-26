import { EmployeeRole, EmployeeStatus } from '@/prisma/generated/prisma/enums';
import prisma from '@/prisma/prisma-client';
import { ApiErrors } from '@/shared/lib/server/api-error';
import { generateJoinCode } from '@/shared/lib/server/generate-join-code';
import { slug } from '@/shared/lib/server/slugify';
import { withApiGuard } from '@/shared/lib/server/with-api-guard';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return withApiGuard(async ({ user }) => {
    try {
      const companies = await prisma.company.findMany({
        where: {
          OR: [{ ownerId: user.id }, { employees: { some: { userId: user.id } } }],
        },
      });
      return NextResponse.json(companies, { status: 200 });
    } catch (error) {
      console.error('Error fetching companies:', error);
      return ApiErrors.internal('Internal server error');
    }
  })(req);
}

export async function POST(req: NextRequest) {
  return withApiGuard(async ({ req, user }) => {
    try {
      const body = await req.json();
      const { name, industry, address, description } = body;

      if (!name || !industry) {
        return ApiErrors.badRequest('Name and industry are required');
      }

      const existingCompany = await prisma.company.findFirst({
        where: {
          ownerId: user.id,
          name,
        },
      });

      if (existingCompany) {
        return ApiErrors.conflict('Company with this name already exists');
      }

      const company = await prisma.$transaction(async (tx) => {
        const createdCompany = await tx.company.create({
          data: {
            name,
            industry,
            address,
            description,
            ownerId: user.id,
            joinCode: generateJoinCode(),
            slug: slug(name),
          },
        });

        const fullName = user.name || `Owner ${user.id.slice(0, 8)}`;

        await tx.employee.create({
          data: {
            userId: user.id,
            companyId: createdCompany.id,
            fullName,
            slug: slug(`${fullName}-${user.id.slice(0, 8)}`),
            role: EmployeeRole.OWNER,
            status: EmployeeStatus.ACTIVE,
          },
        });

        await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            activeCompanyId: createdCompany.id,
          },
        });

        return createdCompany;
      });

      return NextResponse.json(company, { status: 201 });
    } catch (error) {
      console.error('Error creating company:', error);
      return ApiErrors.internal('Failed to create company');
    }
  })(req);
}
