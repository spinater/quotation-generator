# Quick Start Guide: Next.js Migration

## Overview

This guide will help you quickly set up the Next.js version of the Thai Quotation & Receipt Generator with PostgreSQL backend.

## Prerequisites

- Node.js 22.x LTS installed
- PostgreSQL database running
- npm package manager
- Basic knowledge of Next.js and Prisma

## Quick Setup (5 Minutes)

### Step 1: Install Dependencies

```bash
cd quotation-generator

# Install Next.js core dependencies
npm install next@latest react@latest react-dom@latest

# Install Prisma
npm install @prisma/client
npm install -D prisma

# Install TypeScript types
npm install -D typescript @types/react @types/node

# Install Tailwind CSS 4.x
npm install -D tailwindcss@next @tailwindcss/postcss postcss autoprefixer

# Install utilities
npm install zod clsx
```

### Step 2: Set Up Environment Variables

Create `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/quotation_db?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

**Replace with your actual database credentials!**

### Step 3: Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Create database and run migrations
npx prisma migrate dev --name init

# Seed with default company
npm run prisma:seed
```

### Step 4: Update package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:vite": "vite",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:seed": "tsx prisma/seed.ts"
  }
}
```

### Step 5: Create Next.js Configuration

Create `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
```

### Step 6: Create Basic App Structure

```bash
# Create app directory structure
mkdir -p app/api/companies
mkdir -p app/api/quotations
mkdir -p app/api/receipts
mkdir -p app/quotation/new
mkdir -p app/receipt/new
mkdir -p components/ui
mkdir -p components/quotation
mkdir -p components/receipt
mkdir -p lib
```

### Step 7: Create Root Layout

Create `app/layout.tsx`:

```typescript
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Thai Quotation & Receipt Generator',
  description: 'Generate professional Thai quotations and receipts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
```

### Step 8: Create Global Styles

Create `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Sarabun', sans-serif;
}
```

### Step 9: Create Prisma Client Singleton

Create `lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### Step 10: Create Home Page

Create `app/page.tsx`:

```typescript
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function HomePage() {
  const defaultCompany = await prisma.company.findFirst({
    where: { isDefault: true },
  });

  const quotationCount = await prisma.quotation.count({
    where: { deletedAt: null },
  });

  const receiptCount = await prisma.receipt.count({
    where: { deletedAt: null },
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">
        Thai Quotation & Receipt Generator
      </h1>
      <p className="text-gray-600 mb-8">
        ระบบสร้างใบเสนอราคาและใบเสร็จรับเงิน
      </p>

      {defaultCompany && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h2 className="font-semibold text-blue-900">Default Company</h2>
          <p className="text-blue-700">{defaultCompany.name}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          href="/quotation/new"
          className="p-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-lg"
        >
          <h2 className="text-3xl font-bold mb-2">📋 ใบเสนอราคา</h2>
          <p className="text-blue-100">Create New Quotation</p>
          <p className="text-sm mt-2">Total: {quotationCount} documents</p>
        </Link>

        <Link
          href="/receipt/new"
          className="p-8 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-lg"
        >
          <h2 className="text-3xl font-bold mb-2">🧾 ใบเสร็จรับเงิน</h2>
          <p className="text-green-100">Create New Receipt</p>
          <p className="text-sm mt-2">Total: {receiptCount} documents</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/quotation"
          className="p-6 bg-white border-2 border-blue-200 rounded-lg hover:border-blue-400 transition"
        >
          <h3 className="text-xl font-semibold text-blue-900">View All Quotations</h3>
          <p className="text-gray-600">ดูใบเสนอราคาทั้งหมด</p>
        </Link>

        <Link
          href="/receipt"
          className="p-6 bg-white border-2 border-green-200 rounded-lg hover:border-green-400 transition"
        >
          <h3 className="text-xl font-semibold text-green-900">View All Receipts</h3>
          <p className="text-gray-600">ดูใบเสร็จรับเงินทั้งหมด</p>
        </Link>
      </div>
    </div>
  );
}
```

### Step 11: Create First API Endpoint

Create `app/api/companies/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
```

Create `app/api/companies/default/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
```

### Step 12: Start Development Server

```bash
# Start Next.js
npm run dev

# In another terminal, open Prisma Studio to view database
npx prisma studio
```

Visit: http://localhost:3000

## Verify Installation

### Checklist

- [ ] Next.js server starts without errors
- [ ] Home page loads at http://localhost:3000
- [ ] Default company displays on home page
- [ ] Prisma Studio opens at http://localhost:5555
- [ ] You can see the Company table in Prisma Studio
- [ ] API endpoint works: http://localhost:3000/api/companies
- [ ] No console errors in browser or terminal

## Next Steps

Now that the basic structure is working:

1. **Migrate Existing Components**
   - Copy `src/utils/fonts.ts` → `lib/fonts.ts`
   - Copy `src/utils/bahttext.ts` → `lib/bahttext.ts`
   - Copy `src/types/index.ts` → `lib/types.ts`

2. **Create Quotation API**
   - Implement CRUD endpoints in `app/api/quotations/`
   - Add auto-number generation

3. **Create Receipt API**
   - Implement CRUD endpoints in `app/api/receipts/`
   - Add auto-number generation

4. **Migrate Forms**
   - Adapt QuotationForm to use API
   - Adapt ReceiptForm to use API
   - Add `'use client'` directive to form components

5. **Test PDF Generation**
   - Ensure Thai fonts load correctly
   - Test with database data
   - Verify postal code workaround

## Common Commands

```bash
# Development
npm run dev              # Start Next.js dev server
npm run dev:vite         # Start old Vite app (for reference)

# Database
npx prisma studio        # Open database GUI
npx prisma generate      # Regenerate Prisma Client
npx prisma migrate dev   # Create migration
npx prisma migrate reset # Reset database (CAUTION!)
npm run prisma:seed      # Seed default data

# Build
npm run build            # Build for production
npm start                # Start production server
```

## Troubleshooting

### Database Connection Error

**Error**: `Can't reach database server`

**Solution**:
1. Verify PostgreSQL is running
2. Check DATABASE_URL in `.env`
3. Test connection: `psql -U username -d quotation_db`

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Prisma Client Not Found

**Error**: `Cannot find module '@prisma/client'`

**Solution**:
```bash
npm install @prisma/client
npx prisma generate
```

### Thai Fonts Not Rendering

**Issue**: PDFs show boxes instead of Thai text

**Solution**:
1. Verify fonts exist in `public/fonts/`
2. Register fonts in `lib/fonts.ts`
3. Import fonts early in app

## Important Reminders

### From Copilot Instructions

1. 📝 **Use sequential thinking** for complex tasks
2. 📋 **Update task files** as you progress
3. 🧠 **Document learnings** in `.github/memory/`
4. 📚 **Follow development guidelines** in copilot-instructions.md

### Database Best Practices

1. Always use transactions for multi-table operations
2. Include `deletedAt: null` filter for soft-deleted records
3. Use pagination for large result sets
4. Eager load relations to avoid N+1 queries
5. Add 2 trailing spaces to addresses (postal code workaround)

## Files to Review

- **Task File**: `.github/tasks/task-2024-01-migrate-to-nextjs.md`
- **Instructions**: `.github/copilot-instructions.md`
- **Migration Guide**: `MIGRATION_GUIDE.md`
- **Schema**: `prisma/schema.prisma`
- **Memory**: `.github/memory/entities/`

## Getting Help

1. Check the copilot instructions
2. Review task file for progress tracking
3. Check memory entities for context
4. Use sequential thinking for complex problems
5. Document new learnings in memory

## Success Criteria

You've successfully set up Next.js when:

- ✅ Development server runs without errors
- ✅ Database connection works
- ✅ Home page displays default company
- ✅ API endpoints respond correctly
- ✅ Prisma Studio shows seeded data
- ✅ No TypeScript errors
- ✅ No console errors

## What's Next?

Follow the detailed **MIGRATION_GUIDE.md** for:
- Complete API implementation
- Component migration strategy
- PDF generation integration
- Testing procedures
- Deployment preparation

---

**Status**: Phase 1 Complete ✓ | Ready for Phase 2 🚀

**Last Updated**: 2024-01-XX