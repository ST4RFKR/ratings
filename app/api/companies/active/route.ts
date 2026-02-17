import prisma from '@/prisma/prisma-client';
import { nextAuthOptions } from '@/shared/auth/next-auth-options';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(nextAuthOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { companyId } = body;

    if (!companyId) {
      return NextResponse.json({ message: 'companyId is required' }, { status: 400 });
    }

    const employee = await prisma.employee.findFirst({
      where: {
        companyId,
        userId: session.user.id,
        status: 'ACTIVE',
      },
      select: { companyId: true },
    });

    if (!employee) {
      return NextResponse.json({ message: 'Company not found or access denied' }, { status: 404 });
    }

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        activeCompanyId: employee.companyId,
      },
    });

    return NextResponse.json({ ok: true, companyId: employee.companyId }, { status: 200 });
  } catch (error) {
    console.error('Error updating active company:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
