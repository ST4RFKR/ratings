import prisma from '@/prisma/prisma-client';
import { ApiErrors } from '@/shared/lib/server/api-error';
import { withApiGuard } from '@/shared/lib/server/with-api-guard';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return withApiGuard(async ({ req }) => {
    try {
      const { joinCode } = await req.json();

      if (!joinCode) return ApiErrors.badRequest('joinCode is required');

      const company = await prisma.company.findUnique({
        where: { joinCode },
        include: { locations: true },
      });

      if (!company) return ApiErrors.notFound('Company not found');

      return NextResponse.json({
        companyId: company.id,
        companyName: company.name,
        locations: company.locations.map((loc) => ({
          id: loc.id,
          name: loc.name,
          address: loc.address,
        })),
      });
    } catch (error) {
      console.log(error);
      return ApiErrors.internal('Internal server error');
    }
  })(req);
}
