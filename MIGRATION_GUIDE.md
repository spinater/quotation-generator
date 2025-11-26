# Migration Guide: Thai Quotation Generator to Next.js with PostgreSQL

## Overview

This guide outlines the migration from the current React + Vite application to a Next.js 15 application with PostgreSQL backend, enabling server-side rendering, document storage, and future retrieval capabilities.

## Current State

### Existing Technology Stack
- ✅ React 18.2.0 + Vite 5.0.8
- ✅ TypeScript 5.2.2
- ✅ Tailwind CSS 3.3.6
- ✅ @react-pdf/renderer 3.1.14 (Thai fonts working)
- ✅ Bilingual support (Thai/English)
- ✅ Bahttext conversion
- ✅ Sub-items support
- ✅ Client-side only (no persistence)

### Current Features (Working)
1. ✅ Quotation PDF generation with Thai fonts
2. ✅ Receipt PDF generation with Thai fonts
3. ✅ Multi-line item descriptions
4. ✅ Hierarchical sub-items with quantities and units
5. ✅ VAT calculations (7%)
6. ✅ Thai amount-in-words (bahttext)
7. ✅ Language switching (Thai/English)
8. ✅ Signature support
9. ✅ Bank details display
10. ✅ Optional fields (phone, tax ID)
11. ✅ Postal code workaround (2 trailing spaces)

### Current Limitations
- ❌ No data persistence (everything in-memory)
- ❌ No document history
- ❌ No company management
- ❌ No ability to edit past documents
- ❌ No search/filter capabilities
- ❌ Client-side only (no SSR)

## Target State

### New Technology Stack
- Next.js 15.x (App Router)
- React 19.x
- TypeScript 5.7+
- Tailwind CSS 4.x
- PostgreSQL + Prisma ORM
- Keep: @react-pdf/renderer, lucide-react, Thai fonts

### New Features
1. ✅ PostgreSQL database for document storage
2. ✅ RESTful API endpoints
3. ✅ Server-side rendering (SSR)
4. ✅ Company management (multiple companies)
5. ✅ Default company selection
6. ✅ Document history and retrieval
7. ✅ Edit existing documents
8. ✅ Delete documents
9. ✅ Search and filter
10. ✅ Pagination for large datasets
11. ✅ Auto-number generation (QT-2024-0001, RC-2024-0001)
12. ✅ All existing PDF features preserved

## Migration Steps

### Phase 1: Setup (COMPLETED ✓)

#### What We've Done
- ✅ Created `.github/tasks/` directory for task management
- ✅ Created `.github/memory/` directory structure for knowledge base
- ✅ Updated `copilot-instructions.md` for Thai Quotation Generator
- ✅ Created memory entity for Quotation Management
- ✅ Created comprehensive migration task file
- ✅ Created Prisma schema with all models

#### Project Structure Created
```
.github/
├── copilot-instructions.md (UPDATED)
├── tasks/
│   └── task-2024-01-migrate-to-nextjs.md
└── memory/
    ├── entities/
    │   └── quotation-management.md
    ├── observations/
    └── relations/

prisma/
└── schema.prisma (CREATED)
```

### Phase 2: Next.js Initialization (NEXT STEPS)

#### 1. Install Next.js Dependencies

```bash
cd quotation-generator

# Install Next.js and React 19
npm install next@latest react@latest react-dom@latest

# Install TypeScript types
npm install -D typescript @types/react @types/node

# Install Tailwind CSS 4.x
npm install -D tailwindcss@next @tailwindcss/postcss postcss autoprefixer

# Install Prisma
npm install @prisma/client
npm install -D prisma

# Optional but recommended
npm install zod        # For API validation
npm install clsx       # For conditional CSS classes
```

#### 2. Update package.json Scripts

Add/update these scripts:

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

#### 3. Create Next.js Configuration

Create `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure fonts are accessible
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
```

#### 4. Create TypeScript Configuration

Update `tsconfig.json` for Next.js:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "isolatedModules": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### 5. Update Tailwind Configuration

Create `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

#### 6. Create App Directory Structure

```bash
mkdir -p app/api/companies
mkdir -p app/api/quotations
mkdir -p app/api/receipts
mkdir -p app/quotation/new
mkdir -p app/quotation/[id]
mkdir -p app/receipt/new
mkdir -p app/receipt/[id]
mkdir -p components/ui
mkdir -p components/quotation
mkdir -p components/receipt
mkdir -p lib
```

#### 7. Create Root Layout

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
      <body>{children}</body>
    </html>
  );
}
```

#### 8. Create Global Styles

Create `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Phase 3: Database Setup

#### 1. Set Up Environment Variables

Create `.env`:

```env
# Database Connection
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

Create `.env.example` (commit this):

```env
# Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/quotation_db?schema=public"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

#### 2. Initialize Prisma

```bash
# Generate Prisma Client
npx prisma generate

# Create initial migration (schema.prisma already exists)
npx prisma migrate dev --name init

# This will:
# - Create the database if it doesn't exist
# - Run the migration
# - Generate Prisma Client
```

#### 3. Create Prisma Client Singleton

Create `lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

#### 4. Create Seed Script

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a default company
  const company = await prisma.company.upsert({
    where: { taxId: '0123456789012' },
    update: {},
    create: {
      name: 'บริษัท ตัวอย่าง จำกัด',
      nameEn: 'Example Company Limited',
      taxId: '0123456789012',
      address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110  ',
      phone: '02-123-4567',
      email: 'info@example.com',
      bankName: 'ธนาคารกรุงเทพ',
      bankAccountNumber: '123-4-56789-0',
      bankAccountName: 'บริษัท ตัวอย่าง จำกัด',
      isDefault: true,
    },
  });

  console.log('✅ Created default company:', company.name);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

#### 5. Run Seed

```bash
npm run prisma:seed
```

#### 6. Verify Database

```bash
# Open Prisma Studio to view your data
npx prisma studio
```

### Phase 4: API Development (Example)

#### Company API Example

Create `app/api/companies/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/companies - List all companies
export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { isDefault: 'desc' },
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

    const company = await prisma.company.create({
      data: body,
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Failed to create company' },
      { status: 500 }
    );
  }
}
```

Create `app/api/companies/default/route.ts`:

```typescript
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
```

### Phase 5: Component Migration

#### Copy Existing Utilities

```bash
# Copy utilities to lib/
cp src/utils/fonts.ts lib/fonts.ts
cp src/utils/bahttext.ts lib/bahttext.ts
cp src/types/index.ts lib/types.ts

# Update imports in these files to work with Next.js
```

#### Migrate Components

```bash
# Keep src/ for reference
# Create new components in components/

# Copy and adapt:
cp src/components/QuotationForm.tsx components/quotation/QuotationForm.tsx
cp src/components/QuotationPDF.tsx components/quotation/QuotationPDF.tsx
cp src/components/ReceiptForm.tsx components/receipt/ReceiptForm.tsx
cp src/components/ReceiptPDF.tsx components/receipt/ReceiptPDF.tsx
```

**Important**: Add `'use client'` directive to form components as they use React hooks.

### Phase 6: Page Development

#### Home Page Example

Create `app/page.tsx`:

```typescript
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function HomePage() {
  // Fetch recent documents (SSR)
  const recentQuotations = await prisma.quotation.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { company: true },
  });

  const recentReceipts = await prisma.receipt.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { company: true },
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">
        Thai Quotation & Receipt Generator
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link
          href="/quotation/new"
          className="p-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <h2 className="text-2xl font-bold">สร้างใบเสนอราคา</h2>
          <p>Create New Quotation</p>
        </Link>

        <Link
          href="/receipt/new"
          className="p-6 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          <h2 className="text-2xl font-bold">สร้างใบเสร็จ</h2>
          <p>Create New Receipt</p>
        </Link>
      </div>

      {/* Recent documents sections */}
    </div>
  );
}
```

## Testing Strategy

### Manual Testing Checklist

- [ ] Database connection works
- [ ] Can create company via API
- [ ] Can retrieve default company
- [ ] Can create quotation with items
- [ ] Can create receipt with items
- [ ] PDF generation works with database data
- [ ] Thai fonts render correctly in PDFs
- [ ] Postal code displays correctly (with 2-space workaround)
- [ ] Sub-items display correctly
- [ ] VAT calculations are correct
- [ ] Bahttext conversion works
- [ ] Language switching works
- [ ] Can edit existing documents
- [ ] Can delete documents
- [ ] Pagination works
- [ ] Search/filter works

## Known Issues & Workarounds

### 1. Postal Code Truncation in PDFs

**Issue**: Thai addresses ending with postal codes may show truncated numbers in PDFs.
- Example: `40000` appears as `400`

**Workaround**: Add 2 trailing spaces to address fields.

**Code Location**: When saving to database, append spaces:
```typescript
customerAddress: customerAddress + '  ' // Add 2 trailing spaces
```

**Root Cause**: @react-pdf/renderer has word-break issues at Thai/number boundaries.

**Future Fix**: Consider server-side PDF generation or alternative PDF library.

### 2. Font Registration

**Issue**: Fonts must be registered before PDF generation.

**Solution**: Register fonts in `lib/fonts.ts` and import early in the application.

## Development Workflow

### Running the Application

```bash
# Start Next.js development server (ALWAYS use isBackground: true when using terminal tool)
npm run dev

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Create a migration after schema changes
npm run prisma:migrate

# Generate Prisma Client after schema changes
npm run prisma:generate
```

### Database Commands

```bash
# View database in GUI
npx prisma studio

# Create migration
npx prisma migrate dev --name description_of_change

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (CAUTION: deletes all data)
npx prisma migrate reset

# Seed database
npm run prisma:seed
```

## Important Reminders

### From Copilot Instructions

1. **Use sequential thinking** for complex tasks
2. **Update tasks and memory** as you progress
3. **Document all decisions** in memory entities
4. **Follow development guidelines** in copilot-instructions.md
6. **Test thoroughly** before considering complete

## Next Immediate Steps

1. **Install Dependencies**
   ```bash
   npm install next@latest react@latest react-dom@latest
   npm install @prisma/client
   npm install -D prisma typescript @types/react @types/node
   ```

2. **Configure Environment**
   - Create `.env` with database connection string
   - Update `.gitignore` to exclude `.env`

3. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```

4. **Create Basic Structure**
   - Create `app/` directory
   - Create `layout.tsx` and `page.tsx`
   - Create API routes for companies

5. **Test Connection**
   - Start Next.js dev server
   - Test API endpoints
   - Verify database connection

## Resources

### Documentation Links
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React 19 Documentation](https://react.dev)
- [@react-pdf/renderer](https://react-pdf.org/)
- [Tailwind CSS 4.x](https://tailwindcss.com/docs)

### Project Files
- Task File: `.github/tasks/task-2024-01-migrate-to-nextjs.md`
- Copilot Instructions: `.github/copilot-instructions.md`
- Memory Entities: `.github/memory/entities/`
- Database Schema: `prisma/schema.prisma`

## Questions?

If you encounter any issues:

1. Check the copilot instructions
2. Review the task file
3. Check memory entities for context
4. Use sequential thinking to plan solutions
5. Document any new learnings in memory

---

**Migration Status**: Phase 1 Complete ✓ | Phase 2 Ready to Start 🚀

**Last Updated**: 2024-01-XX