import prisma from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, industry, address, description } = body;

    if (!name || !industry) {
      return NextResponse.json({ message: 'Name and industry are required' }, { status: 400 });
    }

    const company = await prisma.company.create({
      data: {
        name,
        industry,
        address,
        description,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
