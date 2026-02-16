import prisma from '@/prisma/prisma-client';
import { getUserSession } from '@/shared/lib/server/get-user-session';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const user = await getUserSession();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { joinCode } = await req.json();

  if (!joinCode) return NextResponse.json({ error: 'Join code required' }, { status: 400 });

  const company = await prisma.company.findUnique({
    where: { joinCode },
    include: { locations: true },
  });

  if (!company) return NextResponse.json({ error: 'Company not found' }, { status: 404 });

  return NextResponse.json({
    companyId: company.id,
    companyName: company.name,
    locations: company.locations.map((loc) => ({
      id: loc.id,
      name: loc.name,
      address: loc.address,
    })),
  });
}
