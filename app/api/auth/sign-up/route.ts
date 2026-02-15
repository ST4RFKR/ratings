import prisma from '@/prisma/prisma-client';
import { signUpSchema } from '@/features/auth/model/sign-up.schema';
import { Prisma } from '@/prisma/generated/prisma/client';
import { hash } from 'argon2';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  try {
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: 'Validation failed',
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const email = parsed.data.email.toLowerCase();

    const findUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (findUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        fullName: parsed.data.fullName,
        email,
        password: await hash(parsed.data.password),
        verified: new Date(), // TODO: добавить по умолчанию null и сделать валидацию через письмо
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        verified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
