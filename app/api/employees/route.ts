import { EmployeeRole, EmployeeStatus, UserRole } from '@/prisma/generated/prisma/enums';
import prisma from '@/prisma/prisma-client';
import { ApiErrors } from '@/shared/lib/server/api-error';
import { slug } from '@/shared/lib/server/slugify';
import { withApiGuard } from '@/shared/lib/server/with-api-guard';
import { hash } from 'argon2';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v3';

const getEmployeesQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
});

export async function GET(req: NextRequest) {
  return withApiGuard(
    async ({ req, companyId }) => {
      try {
        const parsedQuery = getEmployeesQuerySchema.safeParse({
          search: req.nextUrl.searchParams.get('search') ?? undefined,
        });

        if (!parsedQuery.success) {
          return ApiErrors.badRequest('Invalid employees filters');
        }

        const search = parsedQuery.data.search;
        const employees = await prisma.employee.findMany({
          where: {
            companyId: companyId!,
            ...(search
              ? {
                  OR: [
                    { fullName: { contains: search, mode: 'insensitive' } },
                    { user: { email: { contains: search, mode: 'insensitive' } } },
                    { location: { name: { contains: search, mode: 'insensitive' } } },
                  ],
                }
              : {}),
          },
          select: {
            id: true,
            fullName: true,
            role: true,
            status: true,
            rating: true,
            locationId: true,
            location: {
              select: {
                name: true,
              },
            },
            user: {
              select: {
                email: true,
              },
            },
            _count: {
              select: {
                reviews: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(employees, { status: 200 });
      } catch (error) {
        console.error('Error fetching employees:', error);
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
    async ({ req, employee }) => {
      try {
        const rawBody = await req.json();
        const parsedBody = createEmployeeBodySchema.safeParse(rawBody);
        if (!parsedBody.success) {
          return ApiErrors.badRequest('Invalid employee payload');
        }
        const body = parsedBody.data;

        const existingUser = await prisma.user.findUnique({
          where: { email: body.email },
        });
        if (existingUser) {
          return ApiErrors.conflict('User already exists');
        }

        const location = await prisma.location.findFirst({
          where: {
            id: body.locationId,
            companyId: employee!.companyId,
          },
          select: { id: true },
        });
        if (!location) {
          return ApiErrors.badRequest('Invalid location');
        }

        const newEmployee = await prisma.$transaction(async (tx) => {
          const user = await tx.user.create({
            data: {
              email: body.email,
              fullName: body.fullName,
              role: UserRole.USER,
              activeCompanyId: employee!.companyId,
              verified: new Date(),
              password: await hash(body.password),
            },
          });

          const emp = await tx.employee.create({
            data: {
              userId: user.id,
              fullName: user.fullName,
              slug: slug(user.fullName),
              role: body.role,
              status: body.status,
              companyId: employee!.companyId,
              locationId: body.locationId,
            },
          });
          return emp;
        });

        return NextResponse.json({ employee: newEmployee }, { status: 201 });
      } catch (error) {
        console.error('Error adding employee:', error);
        return ApiErrors.internal('Internal server error');
      }
    },
    {
      requireActiveCompany: true,
      requireActiveEmployee: true,
      allowedEmployeeRoles: [EmployeeRole.OWNER, EmployeeRole.MANAGER],
      forbiddenMessage: 'You do not have permission to add employees',
    },
  )(req);
}

const assignableRoles = [
  EmployeeRole.SUPERVISOR,
  EmployeeRole.REVIEWER,
  EmployeeRole.CASHIER,
  EmployeeRole.SALES,
  EmployeeRole.WAITER,
  EmployeeRole.COOK,
  EmployeeRole.STAFF,
] as const;

const assignableStatuses = [EmployeeStatus.PENDING, EmployeeStatus.ACTIVE] as const;
const createEmployeeBodySchema = z.object({
  fullName: z.string().trim().min(2),
  email: z.string().trim().email(),
  password: z.string().min(6),
  role: z.enum(assignableRoles),
  status: z.enum(assignableStatuses),
  locationId: z.string().trim().min(1),
});
