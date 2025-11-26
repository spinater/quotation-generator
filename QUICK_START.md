# Quick Start Guide - Thai Quotation & Receipt Generator

**Last Updated:** 2025-01-22  
**Port:** 4000  
**Status:** Phase 4 Complete (PDF Generation) ✅

---

## 🚀 Quick Commands

```bash
# Install dependencies
npm install

# Run all tests (recommended before starting)
npm run test

# Start development server
npm run dev
# Server runs at: http://localhost:4000

# Run individual test suites
npm run verify:env      # Verify environment variables
npm run test:db         # Test database connection
npm run test:all        # Run 42 unit tests
npm run test:app        # Test app startup

# Database commands
npx prisma studio       # Open database GUI
npx prisma generate     # Generate Prisma client
npm run prisma:seed     # Seed database with sample data
```

---

## ✅ Test Status

**All Tests Passing:** 42/42 ✅

- Environment verification ✅
- Database connection ✅
- Unit tests (42) ✅
- App startup (port 4000) ✅

```bash
npm run test
# Expected: All tests pass
```

---

## 📁 Project Structure

```
quotation-generator/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page
│   ├── quotation/
│   │   ├── page.tsx              # Quotation list
│   │   ├── [id]/page.tsx         # Quotation detail
│   │   └── new/page.tsx          # Create quotation ✅
│   └── receipt/
│       ├── page.tsx              # Receipt list
│       └── [id]/page.tsx         # Receipt detail
│
├── components/
│   ├── pdf/
│   │   └── QuotationPDF.tsx      # PDF template ✅ NEW
│   ├── PDFDownloadButton.tsx     # Download/preview ✅ NEW
│   ├── QuotationPDFActions.tsx   # PDF integration ✅ NEW
│   ├── QuotationForm.tsx         # Create form ✅
│   └── ui/                       # Reusable UI components
│
├── lib/
│   ├── actions/
│   │   ├── quotations.ts         # Quotation CRUD ✅
│   │   └── pdf.ts                # PDF utilities ✅ NEW
│   ├── prisma.ts                 # Prisma client
│   ├── fonts.ts                  # Font registration
│   └── bahttext.ts               # Thai text conversion
│
├── __tests__/                    # Unit tests
│   └── lib/
│       ├── bahttext.test.ts
│       └── actions/
│           └── pdf.test.ts       # ✅ NEW (33 tests)
│
└── public/
    └── fonts/                    # Thai fonts
        ├── Sarabun-Regular.ttf
        ├── Sarabun-Bold.ttf
        └── NotoSansThai.ttf
```

---

## 🎯 What's Implemented

### ✅ Phase 1: Setup
- Next.js 15 + React 19
- PostgreSQL + Prisma ORM
- Database schema (Company, Quotation, Receipt, Items)
- Thai font support

### ✅ Phase 2: Pages
- Quotation list page
- Quotation detail page
- Receipt list page
- Receipt detail page

### ✅ Phase 3: Forms
- Quotation creation form
- Dynamic items with sub-items
- VAT calculation
- Thai Bahttext conversion
- Form validation
- Server actions

### ✅ Phase 4: PDF Generation (This Session)
- PDF template with Thai fonts
- Bilingual support (Thai/English)
- Download and preview buttons
- 42 comprehensive unit tests
- Port changed to 4000

---

## 🔧 Configuration

### Port
**Default:** 4000 (changed from 3000 to avoid conflicts)

### Environment Variables
Required in `.env`:
```env
DATABASE_URL="postgresql://admin:password@host:port/database?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:4000"
NODE_ENV="development"
```

### Database
- **Host:** 45.136.237.124
- **Port:** 55320
- **Database:** company_management
- **User:** admin

---

## 📊 Current Progress: ~70%

**Completed:**
- ✅ Database setup
- ✅ List & detail pages
- ✅ Quotation create form
- ✅ PDF generation (quotation)
- ✅ 42 passing unit tests

**Next Steps:**
- ⏳ Receipt create form
- ⏳ Edit pages
- ⏳ Receipt PDF
- ⏳ Company management
- ⏳ Settings pages

---

## 🧪 Testing

### Run All Tests
```bash
npm run test
# Runs: env check → DB test → unit tests → app startup
# Expected: All pass
```

### Test Results
```
✅ Environment Verification: PASSED
✅ Database Connection: PASSED
✅ Unit Tests (42/42): PASSED
✅ App Startup: PASSED
```

### Test Coverage
- Bahttext conversion (9 tests)
- PDF validation (7 tests)
- Filename generation (6 tests)
- Address formatting (4 tests)
- Date formatting (4 tests)
- Currency formatting (8 tests)
- Integration (4 tests)

---

## 📝 Key Features

### Quotation Management
- Create quotations with multiple items
- Sub-items support (hierarchical)
- VAT calculation (7%)
- Thai Bahttext conversion
- Automatic quotation numbering

### PDF Generation
- Thai font rendering (Sarabun, NotoSansThai)
- Bilingual (Thai/English)
- Professional layout
- Download and preview
- Postal code workaround

### Database
- PostgreSQL with Prisma ORM
- Company, Quotation, Receipt models
- Items with parent-child relationships
- Soft delete support

---

## 🔍 Common Tasks

### Create a Quotation
1. Visit: `http://localhost:4000/quotation/new`
2. Select company
3. Enter customer details
4. Add items (with optional sub-items)
5. Toggle VAT if needed
6. Click "บันทึก" (Save)

### Generate PDF
1. Visit quotation detail page
2. Click "Preview PDF" or "Download PDF"
3. PDF generates with Thai fonts
4. Download saves to browser downloads folder

### View Database
```bash
npx prisma studio
# Opens GUI at: http://localhost:5555
```

---

## 🐛 Troubleshooting

### Tests Fail
```bash
npm run verify:env    # Check environment
npm run test:db       # Check database connection
npx prisma generate   # Regenerate Prisma client
```

### Port Already in Use
```bash
# App uses port 4000
# If needed, check what's using port 4000:
lsof -i :4000

# Or change port in package.json:
"dev": "next dev -p 4001"
```

### Database Connection Issues
```bash
# Test connection
npm run test:db

# Check .env file
cat .env | grep DATABASE_URL

# Verify Prisma client
npx prisma generate
```

### PDF Not Generating
- Check browser console for errors
- Verify fonts exist in `/public/fonts/`
- Check data validation errors
- Try preview first (simpler than download)

---

## 📚 Documentation

- `README.md` - Project overview
- `PHASE_4_PDF_GENERATION.md` - PDF implementation details
- `IMPLEMENTATION_SUMMARY.md` - Session summary
- `.github/copilot-instructions.md` - Development guidelines
- `.github/tasks/` - Task tracking files

---

## 🚦 Status Overview

| Feature | Status | Tests |
|---------|--------|-------|
| Database | ✅ Complete | ✅ Passing |
| Quotation List | ✅ Complete | ✅ Passing |
| Quotation Detail | ✅ Complete | ✅ Passing |
| Quotation Create | ✅ Complete | ✅ Passing |
| Quotation PDF | ✅ Complete | ✅ Passing |
| Receipt List | ✅ Complete | ✅ Passing |
| Receipt Detail | ✅ Complete | ✅ Passing |
| Receipt Create | ⏳ Pending | - |
| Receipt PDF | ⏳ Pending | - |
| Edit Pages | ⏳ Pending | - |
| Company CRUD | ⏳ Pending | - |

---

## 💡 Tips

1. **Always run tests before committing:**
   ```bash
   npm run test
   ```

2. **Use Prisma Studio to inspect data:**
   ```bash
   npx prisma studio
   ```

3. **Check test output for errors:**
   ```bash
   npm run test:all  # Detailed unit test output
   ```

4. **Port is 4000 (not 3000):**
   ```
   http://localhost:4000
   ```

5. **Thai fonts are critical:**
   - Fonts in `/public/fonts/`
   - Registered in `lib/fonts.ts`
   - Used in PDF templates

---

## 🎓 Technology Stack

- **Frontend:** Next.js 15 (App Router), React 19
- **Backend:** Next.js API Routes, Server Actions
- **Database:** PostgreSQL 18, Prisma ORM 6.2
- **Styling:** Tailwind CSS 4
- **PDF:** @react-pdf/renderer 4.2
- **Icons:** lucide-react
- **Runtime:** Node.js 22
- **Language:** TypeScript 5.7 (strict mode)

---

## 🔗 URLs

| Page | URL |
|------|-----|
| Home | http://localhost:4000 |
| Quotation List | http://localhost:4000/quotation |
| Create Quotation | http://localhost:4000/quotation/new |
| Receipt List | http://localhost:4000/receipt |
| Prisma Studio | http://localhost:5555 |

---

## ✨ Recent Updates

### 2025-01-22
- ✅ **Port changed to 4000** (from 3000)
- ✅ **PDF generation implemented** (quotation)
- ✅ **42 unit tests added** (all passing)
- ✅ **Comprehensive documentation** created

---

**Need Help?** Check the documentation files or run `npm run test` to verify setup.

**Ready to Start?** Run `npm run dev` and visit http://localhost:4000 🚀