import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema
const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  nameEn: z.string().optional(),
  taxId: z.string().min(1, 'Tax ID is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email().optional().or(z.literal('')),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankAccountName: z.string().optional(),
  logo: z.string().optional(),
  isDefault: z.boolean().default(false),
});

// GET /api/companies - List all companies
export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: [
        { isDefault: 'desc' },
        { name: 'asc' },
      ],
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}

// POST /api/companies - Create new company
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = companySchema.parse(body);

    // Add 2 trailing spaces to address for postal code workaround
    const addressWithSpaces = validatedData.address.trim() + '  ';

    // If this company is set as default, unset all other defaults
    if (validatedData.isDefault) {
      await prisma.company.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      });
    }

    const company = await prisma.company.create({
      data: {
        ...validatedData,
        address: addressWithSpaces,
        email: validatedData.email || null,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}
