import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/companies/default - Get default company
export async function GET() {
  try {
    const company = await prisma.company.findFirst({
      where: { isDefault: true },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'No default company found' },
        { status: 404 }
      );
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error fetching default company:', error);
    return NextResponse.json(
      { error: 'Failed to fetch default company' },
      { status: 500 }
    );
  }
}
