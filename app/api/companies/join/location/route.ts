import { EmployeeRole, EmployeeStatus } from '@/prisma/generated/prisma/enums';
import prisma from '@/prisma/prisma-client';
import { getUserSession } from '@/shared/lib/server/get-user-session';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const user = await getUserSession();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { companyId, locationId } = await req.json();
    if (!companyId || !locationId) {
      return NextResponse.json({ error: 'companyId and locationId required' }, { status: 400 });
    }

    const existingEmployee = await prisma.employee.findFirst({
      where: { userId: user.id, companyId },
    });

    if (existingEmployee) {
      return NextResponse.json({ message: 'Already joined' }, { status: 200 });
    }

    await prisma.employee.create({
      data: {
        userId: user.id,
        companyId,
        locationId,
        fullName: user.name,
        status: EmployeeStatus.PENDING,
        role: EmployeeRole.STAFF,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { activeCompanyId: companyId },
    });

    return NextResponse.json({ message: 'Joined company and selected location. Pending approval.' });
  } catch (error) {
    console.error('Error joining company:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
