# Thai Quotation & Receipt Generator - Next.js Migration

## 🎯 Project Status

**Current Phase**: Phase 1 Complete ✓ - Ready for Phase 2 🚀

### What's Been Done ✅

- ✅ Project structure created (`.github/tasks/`, `.github/memory/`)
- ✅ Copilot instructions updated for this project
- ✅ Prisma schema designed with all models
- ✅ Migration task file created with detailed plan
- ✅ Memory entities created (Quotation Management, Database Schema)
- ✅ Comprehensive migration guide written
- ✅ Quick start guide prepared

### What's Next 🚧

- Database initialization with Prisma
- Next.js 15 setup with App Router
- API routes implementation (Companies, Quotations, Receipts)
- Component migration from Vite to Next.js
- PDF generation integration with database

---

## 📋 Overview

This project is migrating a **React + Vite** Thai Quotation & Receipt Generator to **Next.js 15** with **PostgreSQL backend** and **Prisma ORM** for document storage, retrieval, and management.

### Why This Migration?

**Current Limitations (Vite App)**:
- ❌ No data persistence (all in-memory)
- ❌ No document history
- ❌ No company management
- ❌ Cannot edit past documents
- ❌ Client-side only

**New Capabilities (Next.js + PostgreSQL)**:
- ✅ PostgreSQL database storage
- ✅ RESTful API for CRUD operations
- ✅ Server-side rendering (SSR)
- ✅ Multi-company support
- ✅ Document history and search
- ✅ Edit and delete documents
- ✅ Auto-number generation
- ✅ All existing PDF features preserved

---

## 🛠️ Technology Stack

### Current (Working)
- React 18.2.0
- Vite 5.0.8
- TypeScript 5.2.2
- Tailwind CSS 3.3.6
- @react-pdf/renderer 3.1.14
- Thai fonts (Sarabun, NotoSansThai)
- Bahttext conversion
- Bilingual support (Thai/English)

### Target (Migration)
- **Next.js 15.x** (App Router, Server Components)
- **React 19.x**
- **TypeScript 5.7+** (Strict mode)
- **PostgreSQL** with **Prisma ORM**
- **Tailwind CSS 4.x**
- Keep: @react-pdf/renderer, lucide-react, Thai fonts, bahttext

---

## 🚀 Quick Start

### Prerequisites

- Node.js 22.x LTS
- PostgreSQL database running
- npm package manager

### Installation Steps

```bash
# 1. Install Next.js dependencies
npm install next@latest react@latest react-dom@latest

# 2. Install Prisma
npm install @prisma/client
npm install -D prisma

# 3. Install TypeScript
npm install -D typescript @types/react @types/node

# 4. Install Tailwind CSS 4.x
npm install -D tailwindcss@next @tailwindcss/postcss postcss

# 5. Install utilities
npm install zod clsx
```

### Database Setup

```bash
# 1. Create .env file with your database URL
echo 'DATABASE_URL="postgresql://user:password@localhost:5432/quotation_db?schema=public"' > .env

# 2. Generate Prisma Client
npx prisma generate

# 3. Run migrations
npx prisma migrate dev --name init

# 4. Seed database with default company
npm run prisma:seed
```

### Start Development

```bash
# Start Next.js dev server
npm run dev

# Open in browser
# http://localhost:3000

# View database (in another terminal)
npx prisma studio
```

---

## 📂 Project Structure

```
quotation-generator/
├── .github/
│   ├── copilot-instructions.md      # Updated for this project ✅
│   ├── tasks/
│   │   └── task-2024-01-migrate-to-nextjs.md  # Migration task ✅
│   └── memory/
│       ├── entities/
│       │   ├── quotation-management.md   # ✅
│       │   └── database-schema.md        # ✅
│       ├── observations/
│       └── relations/
│
├── src/                             # Original Vite app (keep for reference)
│   ├── components/
│   ├── utils/
│   └── types/
│
├── app/                             # Next.js App Router (NEW)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── quotation/
│   │   ├── page.tsx                # List quotations
│   │   ├── new/page.tsx            # Create quotation
│   │   └── [id]/page.tsx           # View/edit quotation
│   ├── receipt/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/page.tsx
│   └── api/
│       ├── companies/
│       ├── quotations/
│       └── receipts/
│
├── components/                      # Next.js components (NEW)
│   ├── ui/
│   ├── quotation/
│   └── receipt/
│
├── lib/                            # Utilities (NEW)
│   ├── prisma.ts                   # Prisma client
│   ├── fonts.ts                    # Font registration
│   ├── bahttext.ts                 # Thai amount converter
│   └── types.ts                    # TypeScript types
│
├── prisma/
│   ├── schema.prisma               # Database schema ✅
│   ├── migrations/
│   └── seed.ts                     # Seed script
│
├── public/
│   └── fonts/                      # Thai fonts (Sarabun, NotoSansThai)
│
├── MIGRATION_GUIDE.md              # Detailed migration steps ✅
├── QUICKSTART_NEXTJS.md            # Quick setup guide ✅
└── README_NEXTJS.md                # This file ✅
```

---

## 📊 Database Schema

### Models

1. **Company** - Store company information
   - name, nameEn, taxId, address, phone, email
   - bankName, bankAccountNumber, bankAccountName
   - logo, isDefault
   - Relations: → Quotations, → Receipts

2. **Quotation** - Store quotation documents (ใบเสนอราคา)
   - quotationNumber (QT-YYYY-NNNN)
   - Company reference
   - Customer info (name, address, taxId, phone)
   - Dates (issueDate, validUntil)
   - Financial (subtotal, vatAmount, total, hasVat)
   - Notes, language, signature, status
   - Relations: → QuotationItems

3. **QuotationItem** - Quotation line items with hierarchy
   - description, quantity, unit, pricePerUnit, amount
   - order, parentItemId (for sub-items)
   - Self-referential for sub-items

4. **Receipt** - Store receipt documents (ใบเสร็จรับเงิน)
   - receiptNumber (RC-YYYY-NNNN)
   - Similar structure to Quotation
   - paymentMethod, paymentDate
   - Relations: → ReceiptItems

5. **ReceiptItem** - Receipt line items with hierarchy
   - Same structure as QuotationItem

### Key Features

- UUID primary keys
- Auto-generated document numbers
- Soft delete support (deletedAt)
- Hierarchical items (main + sub-items)
- Foreign key constraints with cascade delete
- Optimized indexes for performance

---

## 🔌 API Structure

### Companies API (`/api/companies`)
- `GET /api/companies` - List all
- `GET /api/companies/default` - Get default company
- `POST /api/companies` - Create
- `PUT /api/companies/[id]` - Update
- `DELETE /api/companies/[id]` - Delete
- `PATCH /api/companies/[id]/set-default` - Set default

### Quotations API (`/api/quotations`)
- `GET /api/quotations` - List (paginated)
- `GET /api/quotations/[id]` - Get by ID (with items)
- `POST /api/quotations` - Create
- `PUT /api/quotations/[id]` - Update
- `DELETE /api/quotations/[id]` - Delete
- `GET /api/quotations/next-number` - Get next number

### Receipts API (`/api/receipts`)
- Similar to Quotations API

---

## ✨ Features

### Preserved from Vite App
- ✅ Thai font rendering (Sarabun, NotoSansThai)
- ✅ PDF generation (@react-pdf/renderer)
- ✅ Bilingual support (Thai/English)
- ✅ Thai bahttext conversion (amount in words)
- ✅ Multi-line item descriptions
- ✅ Hierarchical sub-items with quantities
- ✅ VAT calculations (7%)
- ✅ Signature support
- ✅ Bank details display
- ✅ Optional fields (phone, tax ID)
- ✅ Postal code workaround (2 trailing spaces)

### New Features
- ✅ PostgreSQL database storage
- ✅ RESTful API endpoints
- ✅ Server-side rendering (SSR)
- ✅ Multi-company management
- ✅ Company selection with defaults
- ✅ Document history
- ✅ Search and filter
- ✅ Edit existing documents
- ✅ Delete documents
- ✅ Pagination
- ✅ Auto-number generation

---

## 📚 Documentation

### Essential Reading

1. **[QUICKSTART_NEXTJS.md](./QUICKSTART_NEXTJS.md)** - 5-minute setup guide
2. **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Detailed migration steps
3. **[.github/copilot-instructions.md](./.github/copilot-instructions.md)** - Development guidelines
4. **[.github/tasks/](./github/tasks/)** - Task tracking files
5. **[.github/memory/entities/](./.github/memory/entities/)** - Knowledge base

### Key Documents

- **Quotation Management**: `.github/memory/entities/quotation-management.md`
- **Database Schema**: `.github/memory/entities/database-schema.md`
- **Migration Task**: `.github/tasks/task-2024-01-migrate-to-nextjs.md`
- **Prisma Schema**: `prisma/schema.prisma`

---

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start Next.js dev server
npm run dev:vite         # Start old Vite app (reference)

# Database
npx prisma studio        # Open database GUI
npx prisma generate      # Generate Prisma Client
npx prisma migrate dev   # Create migration
npx prisma migrate reset # Reset database (CAUTION!)
npm run prisma:seed      # Seed default data

# Build & Deploy
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
```

---

## ⚠️ Known Issues & Workarounds

### 1. Postal Code Truncation in PDFs

**Issue**: Thai addresses ending with postal codes may show truncated numbers.
- Example: `40000` appears as `400`

**Workaround**: Add 2 trailing spaces to address fields when saving to database.

**Root Cause**: @react-pdf/renderer has word-break issues at Thai/number boundaries.

**Code Example**:
```typescript
// When saving to database
customerAddress: customerAddress.trim() + '  ' // Add 2 spaces
```

### 2. Font Registration

**Issue**: Thai fonts must be registered before PDF generation.

**Solution**: Register fonts in `lib/fonts.ts` and import early in application.

---

## 🔐 Environment Variables

Required in `.env` file:

```env
# Database Connection (REQUIRED)
DATABASE_URL="postgresql://username:password@localhost:5432/quotation_db?schema=public"

# Application URL (REQUIRED)
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Environment (OPTIONAL)
NODE_ENV="development"
```

**Security**: Never commit `.env` file! Use `.env.example` for reference.

---

## 📈 Migration Progress

### Phase 1: Setup ✅ COMPLETE
- [x] Directory structure
- [x] Copilot instructions
- [x] Prisma schema
- [x] Task files
- [x] Memory entities
- [x] Documentation

### Phase 2: Next.js Initialization 🚧 NEXT
- [ ] Install Next.js dependencies
- [ ] Configure Next.js
- [ ] Create app directory structure
- [ ] Set up TypeScript
- [ ] Configure Tailwind CSS 4.x

### Phase 3: Database Setup
- [ ] Initialize Prisma
- [ ] Run migrations
- [ ] Create seed script
- [ ] Test connections
- [ ] Set up Prisma Studio

### Phase 4: API Development
- [ ] Companies API
- [ ] Quotations API
- [ ] Receipts API
- [ ] Number generation logic

### Phase 5: Component Migration
- [ ] Copy utilities (fonts, bahttext, types)
- [ ] Migrate QuotationForm
- [ ] Migrate ReceiptForm
- [ ] Migrate PDF components
- [ ] Create new UI components

### Phase 6: Integration & Testing
- [ ] Connect forms to API
- [ ] Test PDF generation
- [ ] Test Thai fonts
- [ ] Test all CRUD operations
- [ ] Test pagination
- [ ] Browser testing

---

## 🎯 Success Criteria

### Phase 1 Complete When: ✅
- [x] All directory structures created
- [x] Copilot instructions updated
- [x] Prisma schema designed
- [x] Task and memory files created
- [x] Documentation written

### Final Migration Complete When:
- [ ] All existing features work in Next.js
- [ ] Database stores and retrieves documents
- [ ] API endpoints tested and working
- [ ] PDFs generate correctly with Thai fonts
- [ ] SSR loads company defaults
- [ ] Multi-company selection works
- [ ] Document history accessible
- [ ] Edit/delete operations work
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Both languages work

---

## 🚨 Critical Reminders

### From Copilot Instructions

1. **Use sequential thinking** for complex tasks
2. **Update task files** as you progress
3. **Document learnings** in memory entities
4. **Follow development guidelines** in copilot-instructions.md

### Database Best Practices

1. Always use transactions for multi-table operations
2. Include `deletedAt: null` for active records
3. Use pagination for large result sets
4. Eager load relations to avoid N+1 queries
5. Add 2 trailing spaces to addresses (postal code fix)

---

## 🤝 Contributing

### Development Workflow

1. **Before Starting**: Use sequential thinking to plan approach
2. **During Work**: Update task files with progress
3. **After Completion**: Document learnings in memory entities
4. **Testing**: Test thoroughly before marking complete

### Code Quality

- Write TypeScript with strict mode
- Use Server Components by default
- Add `'use client'` only when needed (hooks, events)
- Follow Tailwind CSS conventions
- Test on multiple browsers
- Ensure mobile responsiveness

---

## 📞 Getting Help

1. **Check Documentation**: Start with QUICKSTART_NEXTJS.md
2. **Review Instructions**: .github/copilot-instructions.md
3. **Check Tasks**: .github/tasks/ for progress tracking
4. **Review Memory**: .github/memory/entities/ for context
5. **Use Sequential Thinking**: Break down complex problems

---

## 📝 License

[Your License Here]

---

## 👥 Team

[Your Team Information]

---

## 🎉 Acknowledgments

- Original Vite app features and Thai font rendering
- @react-pdf/renderer for PDF generation
- Prisma for excellent ORM
- Next.js team for App Router

---

**Current Status**: Phase 1 Complete ✓ | Ready for Phase 2 🚀

**Last Updated**: 2024-01-XX

---

## Quick Links

- 🚀 [Quick Start Guide](./QUICKSTART_NEXTJS.md)
- 📖 [Migration Guide](./MIGRATION_GUIDE.md)
- 📋 [Task File](./.github/tasks/task-2024-01-migrate-to-nextjs.md)
- 🧠 [Memory Entities](./.github/memory/entities/)
- 💻 [Copilot Instructions](./.github/copilot-instructions.md)
- 🗄️ [Database Schema](./prisma/schema.prisma)