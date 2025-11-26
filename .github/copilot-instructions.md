# GitHub Copilot Instructions

This file contains specific instructions for GitHub Copilot when working on this **Thai Quotation & Receipt Generator** project - a React/Vite to Next.js migration with PostgreSQL backend. Follow these guidelines consistently for all development work.

---

## 🚨🚨🚨 ABSOLUTE LAW: YOU MUST TEST EVERYTHING 🚨🚨🚨

**IF YOU DID NOT PERSONALLY TEST IT BY CLICKING BUTTONS, IT IS BROKEN.**
**IF YOU DID NOT SEE IT WORK WITH YOUR OWN EYES, IT DOES NOT WORK.**
**IF YOU CANNOT SHOW A VIDEO OF IT WORKING, YOU DID NOT TEST IT.**

### THE ONLY ACCEPTABLE WORKFLOW:

1. Write code
2. **`npm run build`** (MUST pass - if fails, FIX IT IMMEDIATELY!)
   - This catches TypeScript errors, type mismatches, and build-time issues
   - This catches database connection errors during static generation
   - **NEVER skip this step - it's your first line of defense**
3. `npm run test` (MUST pass - if fails, FIX IT)
4. Open browser to http://localhost:4000
5. Navigate to the EXACT page you changed
6. **CLICK THE ACTUAL BUTTON/LINK YOU MODIFIED**
7. **WATCH IT WORK** - Does the PDF open? Does the form submit? Does the link go somewhere?
8. Check browser console (F12) - Are there errors? If YES, FIX THEM!
9. Only AFTER steps 1-8 succeed: Commit your code

**ANY OTHER WORKFLOW IS FORBIDDEN AND WILL RESULT IN BROKEN CODE.**

### 🚨 BUILD FAILURES ARE CRITICAL 🚨

If `npm run build` fails:
- **Database connection errors**: Add `export const dynamic = 'force-dynamic';` to pages that fetch data
- **TypeScript errors**: Fix type mismatches immediately
- **Module errors**: Check imports and dependencies
- **NEVER commit code that fails to build**

---

## ⚠️ CRITICAL: Testing Requirements

**🚨 MANDATORY: ALWAYS test your changes before declaring them complete! 🚨**

**NO EXCEPTIONS. Testing is NOT optional. Every code change MUST be tested.**

**⚠️ NEVER declare work complete without actually testing it yourself first! ⚠️**

**🚨 CRITICAL: YOU MUST CLICK THE ACTUAL BUTTONS AND VERIFY THEY WORK! 🚨**

**"It compiles" ≠ "It works" | "Tests pass" ≠ "Buttons work" | "No errors" ≠ "Feature works"**

### YOU ARE FORBIDDEN FROM:
- ❌ Saying "it's fixed" without testing
- ❌ Saying "it works" without clicking buttons
- ❌ Saying "it's done" without verifying in browser
- ❌ Assuming code is correct because it looks right
- ❌ Assuming tests passing means feature works
- ❌ Making the USER test your code for you
- ❌ Being lazy and not opening the browser

### The Testing Promise:
- ✅ "I will run `npm run build` first to catch TypeScript errors"
- ✅ "I will run automated tests (`npm run test`)"
- ✅ "I will open the browser and navigate to the page"
- ✅ "I will CLICK THE ACTUAL BUTTONS/LINKS that I changed"
- ✅ "I will verify the buttons DO WHAT THEY'RE SUPPOSED TO DO"
- ✅ "I will check browser console (F12) for errors AFTER clicking"
- ✅ "I will confirm the feature ACTUALLY WORKS by using it"
- ❌ "I assume it works because the code looks correct" - THIS IS FORBIDDEN!
- ❌ "I assume it works because tests pass" - THIS IS FORBIDDEN!
- ❌ "I assume it works because it compiles" - THIS IS FORBIDDEN!

### Golden Rules:
1. **"If you didn't CLICK it, it doesn't work!"**
2. **"If you didn't SEE it work, it doesn't work!"**
3. **"If you didn't test it, it's BROKEN!"**

Even if:
- The code compiles successfully ✅
- All automated tests pass ✅
- The build succeeds ✅

**YOU MUST STILL:**
- Open the application in a browser 🌐
- Navigate to the exact page you changed 🗺️
- CLICK THE ACTUAL BUTTONS/LINKS YOU MODIFIED 🖱️
- WATCH THE RESULT - does it do what it should? 👀
- If it's a PDF button - DOES THE PDF OPEN? Is Thai text correct? 📄
- If it's a form - DOES IT SUBMIT? Do you see the result? 📝
- If it's a link - DOES IT GO TO THE RIGHT PAGE? 🔗
- Verify it actually works as expected ✓
- Check browser console for errors (F12) AFTER clicking 🔍
- If there are errors - FIX THEM before declaring complete! 🔧

### Before Declaring Work Complete:

1. **Run Production Build** (MANDATORY - catches TypeScript AND build-time errors):
   ```bash
   npm run build       # MUST succeed before anything else!
   ```
   
   **Why this is critical:**
   - Catches TypeScript compilation errors
   - Catches database connection issues during static generation
   - Catches module resolution problems
   - Catches type mismatches that might not show in dev mode
   - **If this fails, STOP and FIX IT before proceeding!**

2. **Run Full Test Suite** (MANDATORY):
   ```bash
   npm run test        # Run ALL tests (env, db, unit, pages)
   ```

3. **Individual Test Commands** (for debugging):
   ```bash
   npm run verify:env   # Verify environment configuration
   npm run test:db      # Test database connection
   npm run test:all     # Run all unit tests (42+ tests)
   npm run test:pages   # Test all pages return 200 OK
   ```

4. **Clear Cache & Restart Dev Server** (after code changes):
   ```bash
   # Stop dev server
   lsof -ti:4000 | xargs kill -9
   
   # Clear Next.js cache
   rm -rf .next
   
   # Restart dev server
   npm run dev
   ```

5. **Manual Verification Checklist**:
   - [ ] **Production build succeeds** (`npm run build` - MOST IMPORTANT!)
   - [ ] App starts without errors (`npm run dev`)
   - [ ] All pages load correctly (no 404 or 500 errors)
   - [ ] Test the specific feature you changed
   - [ ] Check browser console for JavaScript errors (F12)
   - [ ] Test API endpoints with curl or browser
   - [ ] Verify database operations in Prisma Studio if applicable

6. **Database Pages Configuration**:
   - **CRITICAL**: Pages that fetch data from database MUST use `export const dynamic = 'force-dynamic';`
   - This prevents build-time database connection errors
   - Without this, `npm run build` will fail with "Can't reach database server" errors
   - Apply to all list pages, detail pages, and pages with server-side data fetching
   - Example:
     ```typescript
     // Force dynamic rendering to skip build-time database access
     export const dynamic = 'force-dynamic';
     
     export default async function MyPage() {
       const data = await prisma.model.findMany();
       // ...
     }
     ```

7. **Configuration File Formats**:
   - If `package.json` has `"type": "module"`, config files must use `.cjs` extension
   - `postcss.config.js` → `postcss.config.cjs` (use `module.exports`)
   - `tailwind.config.js` → `tailwind.config.cjs` (use `module.exports`)
   - `next.config.js` → use `export default` (ESM format)

8. **Common Issues to Check**:
   - ESM vs CommonJS module conflicts
   - Missing environment variables
   - Database connection issues (add `export const dynamic = 'force-dynamic';`)
   - Build-time database access errors (see Database Pages Configuration above)
   - TypeScript compilation errors
   - Missing dependencies
   - Webpack/Next.js cache issues (clear `.next` folder)
   - Port conflicts (kill process on port 4000)

### Complete Testing Workflow (REQUIRED):

```bash
# Step 1: Build verification (catches ALL compilation and build-time errors)
npm run build
# ❗ If this fails with database errors, add 'export const dynamic = "force-dynamic";'
# ❗ If this fails with TypeScript errors, fix type mismatches
# ❗ NEVER proceed if build fails - FIX IT FIRST!

# Step 2: Run automated tests
npm run test

# Step 3: Clear cache and restart dev server
lsof -ti:4000 | xargs kill -9
rm -rf .next
npm run dev

# Step 4: Manual verification (MOST IMPORTANT!)
# - Visit http://localhost:4000 in browser
# - Navigate to the EXACT page you changed
# - CLICK THE BUTTONS YOU MODIFIED (don't just look at them!)
# - WATCH what happens - does it work?
# - For PDF buttons: Does PDF open? Is content correct?
# - For forms: Does it submit? Do you see success message?
# - For links: Does it navigate correctly?
# - Check browser console (F12) for errors AFTER clicking
# - If errors appear - READ THEM and FIX THEM!
# - Navigate between pages to ensure no 404s
# - Verify data displays correctly
# - Test edge cases (empty data, long text, special characters)

# Step 5: Only AFTER all tests pass and manual verification succeeds:
# - Commit your changes
# - Update documentation
# - Mark task as complete
```

### 🚨 CRITICAL RULES:

1. **NEVER** declare work complete without CLICKING THE ACTUAL BUTTONS
2. **NEVER** assume it works because it compiles or tests pass
3. **NEVER** declare work complete without running `npm run build` first
4. **NEVER** skip the production build - it catches TypeScript AND build-time errors
5. **NEVER** commit code that fails `npm run build`
6. **NEVER** skip the full test suite (`npm run test`)
7. **NEVER** skip manual browser testing - CLICK THE BUTTONS!
8. **ALWAYS** fix build errors before proceeding to other tests
9. **ALWAYS** add `export const dynamic = 'force-dynamic';` to pages with database queries
10. **ALWAYS** clear `.next` cache after code changes
11. **ALWAYS** restart dev server after modifying server-side code
12. **ALWAYS** verify pages load (not just compile)
13. **ALWAYS** CLICK the buttons/links you changed and VERIFY they work
14. **ALWAYS** check browser console (F12) for JavaScript errors AFTER clicking
15. **ALWAYS** manually test the actual feature in the browser by USING it
16. **ALWAYS** verify the output is correct (PDF opens, form submits, etc.)
17. **DOCUMENT** any test failures and fix them before proceeding

### 🎯 THE ULTIMATE TEST:
**Can you demonstrate the feature working by screen recording yourself clicking the button and showing it works?**
If NO → It's not complete!
If YES → Good, now check console for errors!

### Common Test Failures & Solutions:

| Error | Cause | Solution |
|-------|-------|----------|
| Build fails | TypeScript/compilation errors | Fix errors shown in build output |
| Can't reach database server | Build tries to fetch data at build time | Add `export const dynamic = 'force-dynamic';` to page |
| Port in use | Dev server already running | `lsof -ti:4000 \| xargs kill -9` |
| 500 errors | Webpack cache outdated | `rm -rf .next && npm run dev` |
| Module not found | Missing dependency or import | Check imports and run `npm install` |
| TypeScript errors | Type mismatches | Run `npm run build` to see all errors |
| Database errors (runtime) | Connection issues | Run `npm run test:db` |
| P1001 error | Prisma can't connect during build | Add `export const dynamic = 'force-dynamic';` to page |

**Never skip testing!** Broken code is worse than no code.
**Untested code is considered broken code.**
**Un-clicked buttons are considered broken buttons.**
**If you can't show me a video of it working, it doesn't work.**

---

---

## Project Overview

This is a **Thai Quotation & Receipt Generator** - migrating from a React + Vite application to a modern **Next.js 15** application with **PostgreSQL backend**, **Prisma ORM**, and **SSR capabilities** for Thai/English bilingual document generation.

### Technology Stack

**Original (React + Vite):**
- React 18.2.0
- Vite 5.0.8
- TypeScript 5.2.2
- Tailwind CSS 3.3.6
- @react-pdf/renderer 3.1.14
- Client-side only

**Target (Next.js + Backend):**
- **Frontend**: Next.js 15.x (App Router, Server Components)
- **React**: 19.x (Latest stable)
- **Runtime**: Node.js 22.x LTS
- **TypeScript**: 5.7+ (Strict mode)
- **Database**: PostgreSQL with Prisma ORM
- **API**: RESTful API with Next.js API Routes
- **Styling**: Tailwind CSS 4.x or latest stable version
- **PDF Generation**: @react-pdf/renderer (existing, keep)
- **Icons**: lucide-react (existing, keep)
- **Port**: 3000 (Next.js default)
- **Package Manager**: npm (current project uses npm)

### Version Requirements

- **Node.js**: 22.x (required)
- **Next.js**: 15.x latest stable
- **All Dependencies**: Use latest stable versions only
- **Deprecated Dependencies**: Forbidden - must use actively maintained alternatives
- **Security Updates**: Keep all dependencies updated for security patches

### Core Features

1. **Quotation Management**: Create, edit, store, and generate Thai quotation PDFs (ใบเสนอราคา)
2. **Receipt Management**: Create, edit, store, and generate Thai receipt PDFs (ใบเสร็จรับเงิน)
3. **Company Management**: Store and select multiple company profiles with default values
4. **Bilingual Support**: Thai (default) and English language switching
5. **PDF Generation**: High-quality Thai font rendering (Sarabun, NotoSansThai)
6. **Thai Bahttext**: Convert amounts to Thai words (bahttext utility)
7. **Item Management**: Line items with sub-items, quantities, units
8. **VAT Support**: Toggle VAT, automatic calculations
9. **Signatures**: Digital signature support for documents
10. **Bank Details**: Store and display bank account information
11. **Document Tracking**: Store all documents in PostgreSQL for future reference
12. **SSR**: Server-side rendering for default values and company selection
13. **History**: Track and retrieve past quotations and receipts

### Project Structure

```
quotation-generator/
├── .github/
│   ├── copilot-instructions.md  # This file
│   ├── tasks/                   # Task management files
│   └── memory/                  # Knowledge base
│       ├── entities/            # Core domain entities
│       ├── observations/        # Project insights
│       └── relations/           # Dependencies
├── src/                         # Original Vite app (keep for reference)
│   ├── components/              # React components
│   ├── types/                   # TypeScript interfaces
│   └── utils/                   # Utilities (fonts, bahttext)
├── app/                         # Next.js App Router (NEW)
│   ├── page.tsx                 # Home page
│   ├── quotation/               # Quotation pages
│   ├── receipt/                 # Receipt pages
│   ├── api/                     # API routes
│   │   ├── companies/           # Company CRUD
│   │   ├── quotations/          # Quotation CRUD
│   │   └── receipts/            # Receipt CRUD
│   └── layout.tsx               # Root layout
├── components/                  # Next.js components (NEW)
│   ├── ui/                      # Reusable UI components
│   ├── quotation/               # Quotation-specific
│   └── receipt/                 # Receipt-specific
├── lib/                         # Utilities (NEW)
│   ├── prisma.ts                # Prisma client
│   ├── fonts.ts                 # Font registration
│   ├── bahttext.ts              # Thai amount converter
│   └── types.ts                 # TypeScript types
├── prisma/
│   ├── schema.prisma            # Database schema
│   ├── migrations/              # Database migrations
│   └── seed.ts                  # Seed data
├── public/
│   └── fonts/                   # Thai fonts (Sarabun, NotoSansThai)
├── package.json
├── next.config.js               # Next.js configuration
├── tsconfig.json
└── tailwind.config.ts
```

---

## 1. Sequential Thinking Requirement

**ALWAYS use sequential thinking for task planning and problem-solving.**

- Use the `sequentialthinking` tool for every significant task
- Break down complex problems into logical thinking steps
- Question and revise previous thoughts when needed
- Generate solution hypotheses and verify them
- Document your thinking process for transparency

Example usage:
```
Before starting any development work, use sequential thinking to:
- Analyze the requirements
- Plan the implementation approach
- Identify potential challenges
- Design the solution architecture
```

---

## 2. Task Management

**Break down all work into manageable tasks stored in `./.github/tasks`**

### Task Organization

- Create individual task files in `./.github/tasks/` directory
- Use descriptive filenames: `task-[date]-[brief-description].md`
- Include task status, requirements, and progress tracking
- Update task files as work progresses

### Task File Structure

```markdown
# Task: [Brief Description]

**Status:** [Not Started | In Progress | Completed | Blocked]
**Created:** [Date]
**Priority:** [High | Medium | Low]

## Requirements

- [Requirement 1]
- [Requirement 2]

## Implementation Plan

1. [Step 1]
2. [Step 2]

## Progress

- [x] Completed item
- [ ] Pending item

## Notes

[Any additional notes or considerations]
```

---

## 3. Memory Simulation

**Simulate MCP memory functionality in `./.github/memory` to prevent data loss**

### Memory Structure

- Create knowledge graphs in `./.github/memory/entities/`
- Store observations in `./.github/memory/observations/`
- Maintain relationships in `./.github/memory/relations/`

### Memory Management

- Document all important decisions and their rationale
- Store code patterns and architectural decisions
- Keep track of dependencies and their versions
- Record API changes and breaking changes
- Maintain a project knowledge base

### Memory File Examples

```
./.github/memory/
├── entities/
│   ├── quotation-management.md
│   ├── receipt-management.md
│   ├── company-management.md
│   ├── pdf-generation.md
│   └── database-schema.md
├── observations/
│   ├── thai-font-rendering.md
│   ├── postal-code-fix.md
│   ├── pdf-optimization.md
│   └── migration-notes.md
└── relations/
    ├── quotation-item-relationships.md
    ├── company-document-dependencies.md
    └── api-frontend-connections.md
```

---

## 4. API Documentation Updates

**Update API specifications in `./docs` after every development task**

### Documentation Requirements

- Maintain up-to-date API endpoint documentation
- Document all database models and relationships
- Include request/response examples for all endpoints
- Update version information
- Document breaking changes

### Documentation Structure

```
./docs/
├── api/
│   ├── companies/
│   │   ├── endpoints.md
│   │   └── models.md
│   ├── quotations/
│   │   ├── endpoints.md
│   │   └── models.md
│   └── receipts/
│       ├── endpoints.md
│       └── models.md
├── guides/
│   ├── getting-started.md
│   ├── database-setup.md
│   ├── pdf-generation.md
│   └── deployment.md
└── changelog.md
```

### Update Process

1. After any code changes affecting the API
2. Update relevant documentation files
3. Validate documentation accuracy
4. Test API endpoints if applicable
5. Commit documentation changes with code changes

---

## 5. Database Schema Design

### Core Models

**Company**
- id (UUID)
- name (Thai & English)
- taxId
- address
- phone
- email
- bankName
- bankAccountNumber
- bankAccountName
- logo (URL or base64)
- isDefault (boolean)
- createdAt
- updatedAt

**Quotation**
- id (UUID)
- quotationNumber (auto-generated)
- companyId (FK)
- customerName
- customerAddress
- customerTaxId
- customerPhone
- issueDate
- validUntil
- subtotal
- vatAmount
- total
- notes
- language (th/en)
- createdAt
- updatedAt

**QuotationItem**
- id (UUID)
- quotationId (FK)
- description
- quantity
- unit
- pricePerUnit
- amount
- order (for sorting)
- parentItemId (FK, nullable - for sub-items)

**Receipt**
- id (UUID)
- receiptNumber (auto-generated)
- companyId (FK)
- customerName
- customerAddress
- customerTaxId
- customerPhone
- issueDate
- subtotal
- vatAmount
- total
- paymentMethod
- notes
- language (th/en)
- createdAt
- updatedAt

**ReceiptItem**
- id (UUID)
- receiptId (FK)
- description
- quantity
- unit
- pricePerUnit
- amount
- order (for sorting)
- parentItemId (FK, nullable - for sub-items)

---

## 6. API Routes Structure

### Company API (`/api/companies`)

- `GET /api/companies` - List all companies
- `GET /api/companies/[id]` - Get company by ID
- `GET /api/companies/default` - Get default company
- `POST /api/companies` - Create new company
- `PUT /api/companies/[id]` - Update company
- `DELETE /api/companies/[id]` - Delete company
- `PATCH /api/companies/[id]/set-default` - Set as default

### Quotation API (`/api/quotations`)

- `GET /api/quotations` - List all quotations (with pagination)
- `GET /api/quotations/[id]` - Get quotation by ID (with items)
- `POST /api/quotations` - Create new quotation
- `PUT /api/quotations/[id]` - Update quotation
- `DELETE /api/quotations/[id]` - Delete quotation
- `GET /api/quotations/next-number` - Get next quotation number

### Receipt API (`/api/receipts`)

- `GET /api/receipts` - List all receipts (with pagination)
- `GET /api/receipts/[id]` - Get receipt by ID (with items)
- `POST /api/receipts` - Create new receipt
- `PUT /api/receipts/[id]` - Update receipt
- `DELETE /api/receipts/[id]` - Delete receipt
- `GET /api/receipts/next-number` - Get next receipt number

---

## 7. Thai Font Management

### Font Files

**Location**: `public/fonts/`
- `Sarabun-Regular.ttf`
- `Sarabun-Bold.ttf`
- `NotoSansThai-Regular.ttf`
- `NotoSansThai-Bold.ttf`

### Font Registration

```typescript
// lib/fonts.ts
import { Font } from '@react-pdf/renderer';

Font.register({
  family: 'Sarabun',
  fonts: [
    { src: '/fonts/Sarabun-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Sarabun-Bold.ttf', fontWeight: 700 }
  ]
});

Font.register({
  family: 'NotoSansThai',
  fonts: [
    { src: '/fonts/NotoSansThai-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/NotoSansThai-Bold.ttf', fontWeight: 700 }
  ]
});
```

### Critical Font Issue

**Postal Code Rendering Problem:**
- Thai addresses with postal codes at the end may truncate in PDF
- Example: `40000` appears as `400`
- **Workaround**: Add 2 trailing spaces to address strings
- **Root Cause**: @react-pdf/renderer Thai/number boundary word-break issue
- **Future Fix**: Consider server-side PDF generation or alternative libraries

---

## 8. Bilingual Support (Thai/English)

### Translation System

**Default Language**: Thai (`th`)
**Supported Languages**: Thai (`th`), English (`en`)

### Translation Structure

```typescript
// lib/translations.ts
export const translations = {
  th: {
    // Quotation
    quotation: 'ใบเสนอราคา',
    quotationNumber: 'เลขที่',
    issueDate: 'วันที่',
    validUntil: 'ใช้ได้ถึง',
    // Receipt
    receipt: 'ใบเสร็จรับเงิน',
    receiptNumber: 'เลขที่',
    // Common
    company: 'บริษัท',
    customer: 'ลูกค้า',
    taxId: 'เลขประจำตัวผู้เสียภาษี',
    address: 'ที่อยู่',
    phone: 'โทรศัพท์',
    // Items
    description: 'รายการ',
    quantity: 'จำนวน',
    unit: 'หน่วย',
    pricePerUnit: 'ราคาต่อหน่วย',
    amount: 'จำนวนเงิน',
    // Totals
    subtotal: 'ยอดรวม',
    vat: 'ภาษีมูลค่าเพิ่ม 7%',
    total: 'รวมทั้งสิ้น',
    totalInWords: 'ตัวอักษร',
    baht: 'บาท'
  },
  en: {
    // Quotation
    quotation: 'Quotation',
    quotationNumber: 'No.',
    issueDate: 'Date',
    validUntil: 'Valid Until',
    // Receipt
    receipt: 'Receipt',
    receiptNumber: 'No.',
    // Common
    company: 'Company',
    customer: 'Customer',
    taxId: 'Tax ID',
    address: 'Address',
    phone: 'Phone',
    // Items
    description: 'Description',
    quantity: 'Quantity',
    unit: 'Unit',
    pricePerUnit: 'Price/Unit',
    amount: 'Amount',
    // Totals
    subtotal: 'Subtotal',
    vat: 'VAT 7%',
    total: 'Total',
    totalInWords: 'In Words',
    baht: 'Baht'
  }
};
```

---

## 9. TypeScript Best Practices

### Strict Mode

- Use strict mode (`"strict": true` in tsconfig.json)
- Define explicit types for all function parameters and return values
- Use interfaces for data structures
- Avoid `any` type - use `unknown` or specific types
- Use optional chaining (`?.`) and nullish coalescing (`??`)

### Type Definitions

```typescript
// lib/types.ts
export interface Company {
  id: string;
  name: string;
  nameEn?: string;
  taxId: string;
  address: string;
  phone: string;
  email?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  logo?: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  companyId: string;
  company?: Company;
  customerName: string;
  customerAddress: string;
  customerTaxId?: string;
  customerPhone?: string;
  issueDate: Date;
  validUntil: Date;
  subtotal: number;
  vatAmount: number;
  total: number;
  notes?: string;
  language: 'th' | 'en';
  items: QuotationItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QuotationItem {
  id: string;
  quotationId: string;
  description: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  amount: number;
  order: number;
  parentItemId?: string;
  subItems?: QuotationItem[];
}
```

---

## 10. Component Best Practices

### Server Components (Default)

- Use Server Components by default (no `'use client'` unless needed)
- Fetch data directly in Server Components
- Keep data fetching close to where it's used

### Client Components

Add `'use client'` only when using:
- React hooks (`useState`, `useEffect`, etc.)
- Browser APIs (`window`, `localStorage`, etc.)
- Event handlers (`onClick`, `onChange`, etc.)
- PDF generation (@react-pdf/renderer requires client-side)

### Component Structure

```typescript
// Server Component (default)
async function QuotationList() {
  const quotations = await prisma.quotation.findMany();
  return <div>{/* render */}</div>;
}

// Client Component
'use client';
function QuotationForm() {
  const [data, setData] = useState({});
  return <form>{/* render */}</form>;
}
```

---

## 11. Development Server Management

### Running Development Server

**Port Configuration**: This project uses **port 3000** (Next.js default)

```bash
# ✅ Start development server:
npm run dev

# Server will run at:
# - Local: http://localhost:4000

# For background execution (when using terminal tool):
terminal({
  command: "npm run dev",
  cd: "quotation-generator",
  isBackground: true
})
```

### Available Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev",
  "prisma:studio": "prisma studio",
  "prisma:seed": "tsx prisma/seed.ts"
}
```

---

## 12. Database Management

### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name [migration_name]

# Apply migrations
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Seed database
npm run prisma:seed
```

### Environment Variables

Create `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/quotation_db?schema=public"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:4000"
```

---

## 13. Testing Strategy

### Unit Tests

- Write tests for utility functions (bahttext, formatters)
- Test business logic functions
- Achieve minimum 80% code coverage

### Integration Tests

- Test API endpoints
- Test database operations
- Test PDF generation

### E2E Tests

- Test complete user flows
- Test quotation creation and retrieval
- Test receipt creation and retrieval

---

## 14. Code Quality Standards

### Formatting

- Use Prettier for consistent formatting
- Follow ESLint rules
- Use meaningful variable and function names
- Add comments for complex logic

### Error Handling

- Validate input parameters
- Handle errors gracefully with try-catch
- Return appropriate HTTP status codes
- Log errors for debugging

### Security

- Validate all user inputs
- Sanitize data before database operations
- Use parameterized queries (Prisma handles this)
- Implement authentication (future)
- Keep dependencies updated

---

## 15. General Workflow

### Before Starting Any Work

1. Use sequential thinking to plan the approach
2. Create or update relevant task files
3. Review existing memory/knowledge base
4. Check current API documentation

### During Development

1. Write code following established patterns
2. Write corresponding unit tests
3. Update memory with new learnings
4. Document any architectural decisions
5. Use appropriate tools (edit_file, not cat)

### After Completing Work

1. Update API documentation in ./docs
2. Mark tasks as completed
3. Update memory with final outcomes
4. Ensure all tests pass
5. Run database migrations if schema changed
6. Commit changes with descriptive messages

---

## 16. Migration Strategy

### Phase 1: Setup (Current)

- [x] Create directory structure (.github/tasks, .github/memory)
- [x] Update copilot-instructions.md
- [ ] Initialize Next.js project structure
- [ ] Set up Prisma with PostgreSQL
- [ ] Create database schema

### Phase 2: Database

- [ ] Design complete schema
- [ ] Create Prisma migrations
- [ ] Set up seed data
- [ ] Test database connections

### Phase 3: API Development

- [ ] Create Company API routes
- [ ] Create Quotation API routes
- [ ] Create Receipt API routes
- [ ] Test all endpoints

### Phase 4: Frontend Migration

- [ ] Migrate components to Next.js
- [ ] Create quotation pages
- [ ] Create receipt pages
- [ ] Implement company selection
- [ ] Keep PDF generation working

### Phase 5: Integration

- [ ] Connect frontend to backend APIs
- [ ] Implement SSR for default values
- [ ] Test complete flows
- [ ] Polish UI/UX

### Phase 6: Polish

- [ ] Add authentication (optional)
- [ ] Optimize performance
- [ ] Add error boundaries
- [ ] Complete documentation
- [ ] Deploy to production

---

## Quick Reference Card

```
📋 PROJECT: Thai Quotation & Receipt Generator (React → Next.js + PostgreSQL)
🚀 PORT: 4000
🌐 DEV URL: http://localhost:4000
🔧 DEV COMMAND: npm run dev (with isBackground: true)
🎨 PDF: @react-pdf/renderer with Sarabun & NotoSansThai fonts
🌍 LANGUAGES: Thai (default), English
🗄️ DATABASE: PostgreSQL with Prisma ORM
⚠️ CRITICAL: NEVER use cat command - use edit_file tool
📁 STRUCTURE: Keep src/ (Vite), add app/ (Next.js), lib/, prisma/
🐘 PRISMA: npx prisma studio (open database GUI)
```

---

**Remember: These instructions are tailored for the Thai Quotation & Receipt Generator migration project. Follow them consistently, especially the rules about NEVER using `cat` command and ALWAYS using `isBackground: true` for dev servers.**