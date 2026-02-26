import { EmployeeRole, EmployeeStatus } from '@/prisma/generated/prisma/enums';
import prisma from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';
import { ApiErrors } from './api-error';
import { getUserSession } from './get-user-session';

type SessionUser = NonNullable<Awaited<ReturnType<typeof getUserSession>>>;

type GuardOptions<TParams extends Record<string, string>> = {
  requireActiveCompany?: boolean;
  requireActiveEmployee?: boolean;
  allowedEmployeeRoles?: EmployeeRole[];
  forbiddenMessage?: string;
  resolveCompanyId?: (ctx: { req: NextRequest; user: SessionUser; params: TParams }) => string | null | undefined;
};

type GuardContext<TParams extends Record<string, string>> = {
  req: NextRequest;
  params: TParams;
  user: SessionUser;
  companyId: string | null;
  employee: {
    id: string;
    companyId: string;
    role: EmployeeRole;
    status: EmployeeStatus;
    locationId: string | null;
  } | null;
};

type GuardHandler<TParams extends Record<string, string>> = (ctx: GuardContext<TParams>) => Promise<NextResponse>;

type RouteContext<TParams extends Record<string, string>> = {
  params?: TParams | Promise<TParams>;
};

function isPromiseLike<TValue>(value: unknown): value is Promise<TValue> {
  return Boolean(value && typeof value === 'object' && 'then' in (value as object));
}

async function resolveParams<TParams extends Record<string, string>>(
  context?: RouteContext<TParams>,
): Promise<TParams> {
  if (!context?.params) {
    return {} as TParams;
  }

  if (isPromiseLike<TParams>(context.params)) {
    return context.params;
  }

  return context.params;
}

export function withApiGuard<TParams extends Record<string, string> = Record<string, string>>(
  handler: GuardHandler<TParams>,
  options: GuardOptions<TParams> = {},
) {
  return async (req: NextRequest, context?: RouteContext<TParams>) => {
    const user = await getUserSession();

    if (!user) {
      return ApiErrors.unauthorized('Unauthorized');
    }

    const params = await resolveParams(context);
    const companyId = options.resolveCompanyId
      ? (options.resolveCompanyId({ req, user, params }) ?? null)
      : (user.activeCompanyId ?? null);

    if (options.requireActiveCompany && !companyId) {
      return ApiErrors.unauthorized('Unauthorized');
    }

    const shouldLoadEmployee = options.requireActiveEmployee || Boolean(options.allowedEmployeeRoles?.length);
    let employee: GuardContext<TParams>['employee'] = null;

    if (shouldLoadEmployee) {
      if (!companyId) {
        return ApiErrors.forbidden(options.forbiddenMessage ?? 'Forbidden');
      }

      employee = await prisma.employee.findFirst({
        where: {
          userId: user.id,
          companyId,
          status: EmployeeStatus.ACTIVE,
        },
        select: {
          id: true,
          companyId: true,
          role: true,
          status: true,
          locationId: true,
        },
      });

      if (!employee) {
        return ApiErrors.forbidden(options.forbiddenMessage ?? 'Forbidden');
      }

      if (options.allowedEmployeeRoles?.length && !options.allowedEmployeeRoles.includes(employee.role)) {
        return ApiErrors.forbidden(options.forbiddenMessage ?? 'Forbidden');
      }
    }

    return handler({
      req,
      params,
      user,
      companyId,
      employee,
    });
  };
}
