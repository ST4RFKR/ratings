import prisma from '@/prisma/prisma-client';
import { nextAuthOptions } from '@/shared/auth/next-auth-options';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(nextAuthOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const companyId = params.id;
    if (!companyId) {
      return NextResponse.json({ message: 'Company id is required' }, { status: 400 });
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
      return NextResponse.json({ message: 'Company not found' }, { status: 404 });
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
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
