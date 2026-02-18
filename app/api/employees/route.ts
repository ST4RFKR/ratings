import { EmployeeRole, EmployeeStatus, UserRole } from '@/prisma/generated/prisma/enums';
import prisma from '@/prisma/prisma-client';
import { ApiErrors } from '@/shared/lib/server/api-error';
import { getUserSession } from '@/shared/lib/server/get-user-session';
import { slug } from '@/shared/lib/server/slugify';
import { hash } from 'argon2';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v3';

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
        status: EmployeeStatus.ACTIVE,
        role: {
          in: [EmployeeRole.OWNER, EmployeeRole.MANAGER],
        },
      },
    });
    if (!employee) {
      return ApiErrors.forbidden('You do not have permission to add employees');
    }
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
        companyId: employee.companyId,
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
          activeCompanyId: employee.companyId,
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
          companyId: employee.companyId,
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
