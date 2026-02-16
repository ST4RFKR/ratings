import prisma from '@/prisma/prisma-client';
import { nextAuthOptions } from '@/shared/auth/next-auth-options';
import { ApiErrors } from '@/shared/lib/server/api-error';
import { generateJoinCode } from '@/shared/lib/server/generate-join-code';
import { getUserSession } from '@/shared/lib/server/get-user-session';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const user = await getUserSession();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const companies = await prisma.company.findMany({
      where: {
        ownerId: user.id,
      },
    });
    return NextResponse.json(companies, { status: 200 });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(nextAuthOptions);

    if (!session || !session.user) {
      return ApiErrors.unauthorized('Unauthorized');
    }

    const body = await req.json();
    const { name, industry, address, description } = body;

    if (!name || !industry) {
      return ApiErrors.badRequest('Name and industry are required');
    }

    const existingCompany = await prisma.company.findFirst({
      where: {
        ownerId: session.user.id,
        name,
      },
    });

    if (existingCompany) {
      return ApiErrors.conflict('Company with this name already exists');
    }

    const company = await prisma.company.create({
      data: {
        name,
        industry,
        address,
        description,
        ownerId: session.user.id,
        joinCode: generateJoinCode(),
      },
    });

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        activeCompanyId: company.id,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return ApiErrors.internal('Failed to create company');
  }
}
