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
    const { name, industry, address, description } = body;

    const company = await prisma.company.findFirst({
      where: {
        id: companyId,
        ownerId: session.user.id,
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
      },
    });

    return NextResponse.json(updatedCompany, { status: 200 });
  } catch (error) {
    console.error('Error updating company:', error);
    return ApiErrors.internal('Internal server error');
  }
}
