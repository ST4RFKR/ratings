import prisma from '@/prisma/prisma-client';
import { ApiErrors } from '@/shared/lib/server/api-error';
import { withApiGuard } from '@/shared/lib/server/with-api-guard';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  return withApiGuard(async ({ req, user }) => {
    try {
      const body = await req.json();
      const { companyId } = body;

      if (!companyId) {
        return ApiErrors.badRequest('companyId is required');
      }

      const employee = await prisma.employee.findFirst({
        where: {
          companyId,
          userId: user.id,
          status: 'ACTIVE',
        },
        select: { companyId: true },
      });

      if (!employee) {
        return ApiErrors.notFound('Company not found or access denied');
      }

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          activeCompanyId: employee.companyId,
        },
      });

      return NextResponse.json({ ok: true, companyId: employee.companyId }, { status: 200 });
    } catch (error) {
      console.error('Error updating active company:', error);
      return ApiErrors.internal('Internal server error');
    }
  })(req);
}
