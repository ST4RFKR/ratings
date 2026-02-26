import { EmployeeRole } from '@/prisma/generated/prisma/enums';
import prisma from '@/prisma/prisma-client';
import { ApiErrors } from '@/shared/lib/server/api-error';
import { slug } from '@/shared/lib/server/slugify';
import { withApiGuard } from '@/shared/lib/server/with-api-guard';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v3';

const getLocationsQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
});

export async function GET(req: NextRequest) {
  return withApiGuard(
    async ({ req, companyId }) => {
      try {
        const parsedQuery = getLocationsQuerySchema.safeParse({
          search: req.nextUrl.searchParams.get('search') ?? undefined,
        });

        if (!parsedQuery.success) {
          return ApiErrors.badRequest('Invalid locations filters');
        }

        const search = parsedQuery.data.search;
        const locations = await prisma.location.findMany({
          where: {
            companyId: companyId!,
            ...(search
              ? {
                  OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { slug: { contains: search, mode: 'insensitive' } },
                  ],
                }
              : {}),
          },
          orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(locations, { status: 200 });
      } catch (error) {
        console.error('Error fetching locations:', error);
        return ApiErrors.internal('Internal server error');
      }
    },
    {
      requireActiveCompany: true,
      requireActiveEmployee: true,
    },
  )(req);
}

export async function POST(req: NextRequest) {
  return withApiGuard(
    async ({ req, companyId }) => {
      try {
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
            companyId: companyId!,
          },
        });
        return NextResponse.json(location, { status: 201 });
      } catch (error) {
        console.error('Error fetching locations:', error);
        return ApiErrors.internal('Internal server error');
      }
    },
    {
      requireActiveCompany: true,
      requireActiveEmployee: true,
      allowedEmployeeRoles: [EmployeeRole.OWNER, EmployeeRole.MANAGER],
    },
  )(req);
}
