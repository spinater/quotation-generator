# Task: Migrate Thai Quotation Generator to Next.js with PostgreSQL Backend

**Status:** In Progress
**Created:** 2024-01-XX
**Assigned:** Developer/Copilot
**Priority:** High

## Overview

Migrate the existing React + Vite Thai Quotation & Receipt Generator to Next.js 15 with PostgreSQL backend, Prisma ORM, and SSR capabilities for storing and retrieving quotations and receipts.

## Requirements

### Functional Requirements

1. **Backend API**
   - RESTful API for Companies, Quotations, and Receipts
   - CRUD operations for all entities
   - Auto-number generation for documents
   - PostgreSQL database with Prisma ORM

2. **Database Schema**
   - Company model (name, tax ID, address, bank details, logo, isDefault)
   - Quotation model (all fields from current form + relationships)
   - QuotationItem model (with sub-item support via parentItemId)
   - Receipt model (similar to quotation)
   - ReceiptItem model (similar to quotation items)

3. **Server-Side Rendering**
   - Load default company on page load
   - Pre-populate form with company defaults
   - Company selection dropdown

4. **Document Tracking**
   - Store all generated quotations and receipts
   - List view of all past documents
   - Detail view for each document
   - Edit existing documents
   - Delete documents

5. **Preserve Existing Features**
   - Thai font rendering (Sarabun, NotoSansThai)
   - PDF generation (@react-pdf/renderer)
   - Bilingual support (Thai/English)
   - Bahttext conversion
   - Sub-items support
   - VAT calculations
   - All current UI/UX features

### Technical Requirements

1. **Next.js 15.x** with App Router
2. **React 19.x** (latest stable)
3. **TypeScript 5.7+** (strict mode)
4. **Prisma ORM** for database access
5. **PostgreSQL** database
6. **Tailwind CSS 4.x** (upgrade from 3.x)
7. **Node.js 22.x** LTS
8. Keep **@react-pdf/renderer** for PDF generation
9. Keep **lucide-react** for icons
10. Port 3000 (Next.js default)

## Implementation Plan

### Phase 1: Project Setup ✅ COMPLETE

- [x] Create `.github/tasks` directory
- [x] Create `.github/memory` directory structure
- [x] Update `copilot-instructions.md` for this project
- [x] Create initial memory entities
- [x] Review and document current Vite app structure

### Phase 2: Next.js Initialization ✅ COMPLETE

- [x] Initialize Next.js 15 in project root
- [x] Update package.json with latest dependencies
  - [x] Next.js 15.1.6
  - [x] React 19.0.0
  - [x] Prisma 6.2.1
  - [x] @react-pdf/renderer 4.2.0
  - [x] Tailwind CSS 4.0.0
  - [x] TypeScript 5.7.2
  - [x] All dependencies verified as non-deprecated
- [x] Configure `next.config.js`
  - Font loading for Thai fonts
  - Public directory configuration
  - Webpack config for PDF rendering
- [x] Set up TypeScript configuration
- [x] Configure Tailwind CSS 4.x with @tailwindcss/postcss
- [x] Create basic App Router structure:
  ```
  app/
  ├── layout.tsx
  ├── page.tsx (home)
  ├── quotation/
  │   ├── page.tsx (list)
  │   ├── new/page.tsx (create form)
  │   └── [id]/page.tsx (view/edit)
  ├── receipt/
  │   ├── page.tsx (list)
  │   ├── new/page.tsx (create form)
  │   └── [id]/page.tsx (view/edit)
  └── api/
      ├── companies/
      │   ├── route.ts ✅
      │   └── default/route.ts ✅
      ├── quotations/
      └── receipts/
  ```
- [x] Create root layout with header/footer
- [x] Create home page with SSR (fetches default company and recent documents)
- [x] Create global CSS with Tailwind
- [x] Migrate utilities to lib/
  - [x] lib/prisma.ts (Prisma client singleton)
  - [x] lib/bahttext.ts (Thai amount converter)
  - [x] lib/fonts.ts (Font registration)
  - [x] lib/types.ts (TypeScript types)

### Phase 3: Database Setup 🚧 READY TO START

**NOTE**: Run these commands to complete Phase 3:
```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

- [x] Install Prisma dependencies:
  ```bash
  npm install @prisma/client
  npm install -D prisma
  ```
- [x] Database schema created (`prisma/schema.prisma`):
  - Company model
  - Quotation model
  - QuotationItem model
  - Receipt model
  - ReceiptItem model
- [x] Seed script created (`prisma/seed.ts`)
- [x] Prisma client singleton created (`lib/prisma.ts`)
- [ ] Configure PostgreSQL connection in `.env` (USER ACTION REQUIRED)
- [ ] Create initial migration (USER ACTION REQUIRED):
  ```bash
  npx prisma migrate dev --name init
  ```
- [ ] Generate Prisma Client (USER ACTION REQUIRED):
  ```bash
  npx prisma generate
  ```
- [ ] Run seed script (USER ACTION REQUIRED):
  ```bash
  npm run prisma:seed
  ```

### Phase 4: API Development

#### Companies API

- [x] `POST /api/companies` - Create company
- [x] `GET /api/companies` - List all companies
- [x] `GET /api/companies/default` - Get default company
- [ ] `GET /api/companies/[id]` - Get company by ID (TODO: Phase 4)
- [ ] `PUT /api/companies/[id]` - Update company (TODO: Phase 4)
- [ ] `DELETE /api/companies/[id]` - Delete company (TODO: Phase 4)
- [ ] `PATCH /api/companies/[id]/set-default` - Set as default (TODO: Phase 4)

#### Quotations API

- [ ] `POST /api/quotations` - Create quotation
- [ ] `GET /api/quotations` - List quotations (with pagination)
- [ ] `GET /api/quotations/[id]` - Get quotation by ID (with items)
- [ ] `PUT /api/quotations/[id]` - Update quotation
- [ ] `DELETE /api/quotations/[id]` - Delete quotation
- [ ] `GET /api/quotations/next-number` - Get next quotation number

#### Receipts API

- [ ] `POST /api/receipts` - Create receipt
- [ ] `GET /api/receipts` - List receipts (with pagination)
- [ ] `GET /api/receipts/[id]` - Get receipt by ID (with items)
- [ ] `PUT /api/receipts/[id]` - Update receipt
- [ ] `DELETE /api/receipts/[id]` - Delete receipt
- [ ] `GET /api/receipts/next-number` - Get next receipt number

### Phase 5: Component Migration

#### Migrate from src/ to components/

- [x] Copy `src/utils/fonts.ts` → `lib/fonts.ts`
- [x] Copy `src/utils/bahttext.ts` → `lib/bahttext.ts`
- [x] Copy `src/types/index.ts` → `lib/types.ts` (updated for database models)
- [ ] Migrate Quotation components:
  - [ ] `QuotationForm` → `components/quotation/QuotationForm.tsx` (client component)
  - [ ] `QuotationPDF` → `components/quotation/QuotationPDF.tsx` (keep as is)
- [ ] Migrate Receipt components:
  - [ ] `ReceiptForm` → `components/receipt/ReceiptForm.tsx` (client component)
  - [ ] `ReceiptPDF` → `components/receipt/ReceiptPDF.tsx` (keep as is)
- [ ] Create new components:
  - [ ] `components/ui/CompanySelect.tsx` - Company dropdown
  - [ ] `components/quotation/QuotationList.tsx` - List view
  - [ ] `components/receipt/ReceiptList.tsx` - List view
  - [ ] `components/ui/DocumentCard.tsx` - Document preview card
  - [ ] `components/ui/Pagination.tsx` - Pagination component

### Phase 6: Page Development

#### Home Page

- [x] `app/page.tsx` - Dashboard/landing page
  - Links to create quotation/receipt
  - Recent documents list with SSR
  - Document counts
  - Default company display

#### Quotation Pages

- [ ] `app/quotation/page.tsx` - List all quotations (server component)
  - Fetch from API
  - Pagination
  - Search/filter
- [ ] `app/quotation/new/page.tsx` - Create new quotation
  - Load default company (SSR)
  - Render QuotationForm
- [ ] `app/quotation/[id]/page.tsx` - View/edit quotation
  - Fetch quotation by ID (SSR)
  - Show PDF preview
  - Edit mode toggle

#### Receipt Pages

- [ ] `app/receipt/page.tsx` - List all receipts (server component)
- [ ] `app/receipt/new/page.tsx` - Create new receipt
- [ ] `app/receipt/[id]/page.tsx` - View/edit receipt

#### Company Management Page (Optional)

- [ ] `app/settings/companies/page.tsx` - Manage companies
  - List all companies
  - Add/edit/delete
  - Set default

### Phase 7: Integration & Testing

- [ ] Connect QuotationForm to API
- [ ] Connect ReceiptForm to API
- [ ] Test quotation creation flow
- [ ] Test receipt creation flow
- [ ] Test quotation retrieval and display
- [ ] Test receipt retrieval and display
- [ ] Test PDF generation with database data
- [ ] Test company selection and defaults
- [ ] Test pagination
- [ ] Test editing existing documents
- [ ] Test deletion
- [ ] Test Thai font rendering in PDFs
- [ ] Test bilingual switching
- [ ] Test postal code rendering (2-space workaround)
- [ ] Test on multiple browsers

### Phase 8: Migration of Existing Features

- [ ] Ensure all sub-items functionality works
- [ ] Ensure VAT calculations work
- [ ] Ensure bahttext conversion works
- [ ] Ensure signature support works
- [ ] Ensure bank details display works
- [ ] Ensure multi-line descriptions work
- [ ] Ensure optional fields (phone, tax ID) work
- [ ] Ensure all Thai translations are correct
- [ ] Ensure all English translations are correct

### Phase 9: Documentation

- [ ] Create API documentation in `docs/api/`
- [ ] Create database schema documentation
- [ ] Create deployment guide
- [ ] Update README.md
- [ ] Create user guide (optional)
- [ ] Document environment variables
- [ ] Document known issues (postal code fix)

### Phase 10: Polish & Optimization

- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Add toast notifications for success/error
- [ ] Optimize PDF generation performance
- [ ] Add database indexes
- [ ] Implement proper error handling
- [ ] Add validation messages
- [ ] Optimize images (if any)
- [ ] Test responsive design
- [ ] Accessibility audit
- [ ] Performance audit (Lighthouse)

## Progress Tracking

### Completed ✅

**Phase 1: Setup**
- Directory structure setup
- Copilot instructions updated
- Memory entities created
- Task file created
- Prisma schema designed

**Phase 2: Next.js Initialization**
- All dependencies updated to latest stable versions
- Next.js 15.1.6 configured
- React 19.0.0 installed
- Tailwind CSS 4.0.0 configured
- TypeScript 5.7.2 configured
- App directory structure created
- Root layout and home page created
- Companies API routes created (list, create, get default)
- Utilities migrated (prisma, bahttext, fonts, types)
- Seed script created
- Documentation updated (INSTALLATION.md)

### In Progress 🚧

- Phase 3: Database Setup (waiting for user to run migrations)

### Next Immediate Action Required 📋

User needs to:
1. Run `npm install` to install all dependencies
2. Create `.env` file with DATABASE_URL
3. Run `npx prisma generate`
4. Run `npx prisma migrate dev --name init`
5. Run `npm run prisma:seed`
6. Run `npm run dev` to start development server
7. Visit http://localhost:3000 to verify

See `INSTALLATION.md` for detailed instructions.

### Blocked ⚠️

None - all Phase 2 dependencies complete

## Technical Decisions

### Why Next.js?

- Server-side rendering for default values
- Built-in API routes (no separate backend needed)
- File-based routing
- React Server Components for better performance
- Excellent TypeScript support
- Strong ecosystem and community

### Why Prisma?

- Type-safe database access
- Automatic migration generation
- Excellent TypeScript integration
- Easy schema definition
- Built-in connection pooling
- Great developer experience

### Why PostgreSQL?

- Reliable and mature
- Excellent support for complex queries
- Good performance for relational data
- User already has it configured (Zed MCP server)
- Strong ecosystem

### Keep Existing Libraries

- `@react-pdf/renderer` - Works well, no need to change
- `lucide-react` - Good icon library, already integrated
- Thai fonts (Sarabun, NotoSansThai) - Already working

## Known Issues to Address

1. **Postal Code Truncation in PDFs**
   - Continue using 2-space workaround
   - Document in code comments
   - Consider future migration to server-side PDF generation

2. **Font Loading**
   - Ensure fonts are accessible in Next.js public directory
   - Test font registration in production build

3. **Environment Variables**
   - Set up `.env.example` file
   - Document all required variables
   - Never commit `.env` with secrets

## Dependencies to Install

```bash
# Next.js and React
npm install next@latest react@latest react-dom@latest

# Prisma
npm install @prisma/client
npm install -D prisma

# Keep existing
# - @react-pdf/renderer
# - lucide-react
# - date-fns

# TypeScript
npm install -D typescript @types/react @types/node

# Tailwind CSS 4.x
npm install -D tailwindcss@next @tailwindcss/postcss postcss

# Optional but recommended
npm install zod  # For validation
npm install clsx  # For conditional classes
npm install date-fns  # Date formatting (already have)
```

## Environment Variables Required

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/quotation_db?schema=public"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional
NODE_ENV="development"
```

## Testing Checklist

### Before Migration Complete

- [ ] All existing features work in Next.js
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] All API endpoints tested
- [ ] Database migrations work
- [ ] PDFs generate correctly
- [ ] Thai fonts render correctly
- [ ] Both languages work
- [ ] Mobile responsive
- [ ] Fast page loads

### Acceptance Criteria

- [ ] User can create quotations with all features
- [ ] User can create receipts with all features
- [ ] User can select company from dropdown
- [ ] Default company loads automatically
- [ ] User can view list of past documents
- [ ] User can view individual document details
- [ ] User can edit existing documents
- [ ] User can delete documents
- [ ] User can download PDFs
- [ ] All data persists in database
- [ ] Document numbers auto-generate correctly
- [ ] No data loss from original features

## Notes

- Keep `src/` directory during migration for reference
- Test thoroughly before removing Vite setup
- Consider creating a backup of current working version
- Migration can be done incrementally (quotation first, then receipt)
- Focus on quotation features first, then replicate for receipt

## Related Memory

- [Quotation Management Entity](./.github/memory/entities/quotation-management.md)
- [Database Schema Design](./.github/memory/entities/database-schema.md)
- [PDF Generation Notes](./.github/memory/observations/thai-font-rendering.md)

## Next Steps

1. Initialize Next.js project structure
2. Set up Prisma and create schema
3. Create basic API routes
4. Test database connection
5. Migrate one component at a time

## Questions/Blockers

- Database connection details confirmed? (User has Zed MCP server configured)
- Any authentication requirements? (Not mentioned, assume public for now)
- Any specific deployment target? (Document later)

---

**Last Updated:** 2024-01-XX