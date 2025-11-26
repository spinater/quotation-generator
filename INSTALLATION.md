# Installation Guide - Thai Quotation Generator (Next.js)

## 🎉 Phase 2 Complete!

The Next.js structure has been set up and is ready for database initialization and testing.

## ✅ What's Been Completed

### 1. Dependencies Updated
- ✅ Next.js 15.1.6 (latest stable)
- ✅ React 19.0.0 (latest stable)
- ✅ Prisma 6.2.1 (latest stable)
- ✅ @react-pdf/renderer 4.2.0 (updated from 3.1.14)
- ✅ Tailwind CSS 4.0.0 (updated from 3.3.6)
- ✅ TypeScript 5.7.2 (latest stable)
- ✅ All dependencies are current and non-deprecated

### 2. Configuration Files Created
- ✅ `next.config.js` - Next.js configuration
- ✅ `tsconfig.json` - TypeScript configuration for Next.js
- ✅ `tailwind.config.js` - Tailwind CSS 4.x configuration
- ✅ `postcss.config.js` - PostCSS with Tailwind 4.x

### 3. App Structure Created
- ✅ `app/layout.tsx` - Root layout with header/footer
- ✅ `app/page.tsx` - Home page with SSR (fetches default company)
- ✅ `app/globals.css` - Global styles with Tailwind
- ✅ Directory structure for quotation and receipt pages

### 4. API Routes Created
- ✅ `app/api/companies/route.ts` - List/Create companies
- ✅ `app/api/companies/default/route.ts` - Get default company

### 5. Utilities Migrated
- ✅ `lib/prisma.ts` - Prisma client singleton
- ✅ `lib/bahttext.ts` - Thai amount-in-words converter
- ✅ `lib/fonts.ts` - Thai font registration
- ✅ `lib/types.ts` - TypeScript types (Prisma + UI types)

### 6. Database
- ✅ `prisma/schema.prisma` - Complete database schema
- ✅ `prisma/seed.ts` - Seed script with sample data

### 7. Package.json Updated
- ✅ Scripts for Next.js, Prisma, and development
- ✅ All latest stable dependencies
- ✅ No deprecated packages

---

## 🚀 Next Steps - Database Setup

### Step 1: Install Dependencies

```bash
cd quotation-generator

# Install all dependencies
npm install
```

**Expected output**: Should install ~500+ packages without errors.

### Step 2: Set Up Environment Variables

Create a `.env` file in the project root:

```bash
# Create .env file
cat > .env << 'EOF'
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/quotation_db?schema=public"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
EOF
```

**⚠️ IMPORTANT**: Replace `username`, `password`, `localhost`, `5432`, and `quotation_db` with your actual PostgreSQL credentials!

**For your Zed MCP server setup**, the DATABASE_URL might look like:
```
DATABASE_URL="postgresql://your_user:your_pass@localhost:5432/quotation_db?schema=public"
```

### Step 3: Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Create database and run migrations
npx prisma migrate dev --name init

# Seed with sample data
npm run prisma:seed
```

**Expected output**:
- Prisma Client generated successfully
- Database created (if doesn't exist)
- Tables created: companies, quotations, quotation_items, receipts, receipt_items
- Seed script creates: 1 company, 1 sample quotation, 1 sample receipt

### Step 4: Verify Database

```bash
# Open Prisma Studio to view your database
npx prisma studio
```

**Expected result**:
- Browser opens at http://localhost:5555
- You can see 5 tables with data
- Company table has 1 default company
- Quotation table has 1 sample quotation
- Receipt table has 1 sample receipt

### Step 5: Start Development Server

```bash
# Start Next.js development server
npm run dev
```

**Expected result**:
- Server starts at http://localhost:3000
- No errors in console
- Page loads successfully

### Step 6: Test the Application

Visit http://localhost:3000 in your browser.

**You should see**:
- ✅ Header: "Thai Quotation & Receipt Generator"
- ✅ Blue box showing default company info
- ✅ Two large buttons: "ใบเสนอราคา" (Quotation) and "ใบเสร็จรับเงิน" (Receipt)
- ✅ Document counts (1 quotation, 1 receipt)
- ✅ Recent documents section showing sample data
- ✅ Footer with copyright

### Step 7: Test API Endpoints

```bash
# Test companies API
curl http://localhost:3000/api/companies

# Test default company API
curl http://localhost:3000/api/companies/default
```

**Expected result**: JSON response with company data

---

## 📋 Verification Checklist

Before proceeding to Phase 3, verify:

- [ ] `npm install` completed without errors
- [ ] `.env` file created with correct DATABASE_URL
- [ ] `npx prisma generate` succeeded
- [ ] `npx prisma migrate dev` created all tables
- [ ] `npm run prisma:seed` created sample data
- [ ] Prisma Studio opens and shows data
- [ ] `npm run dev` starts without errors
- [ ] Home page loads at http://localhost:3000
- [ ] Default company displays on home page
- [ ] Recent documents show sample quotation and receipt
- [ ] API endpoints return JSON data
- [ ] No TypeScript errors in console
- [ ] No browser console errors

---

## 🐛 Troubleshooting

### Issue: "Can't reach database server"

**Solution**:
1. Verify PostgreSQL is running: `pg_isready`
2. Check DATABASE_URL in `.env`
3. Test connection: `psql -U username -d quotation_db`

### Issue: "Port 3000 already in use"

**Solution**:
```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Issue: "Prisma Client not found"

**Solution**:
```bash
npm install @prisma/client
npx prisma generate
```

### Issue: "Cannot find module '@prisma/client'"

**Solution**:
```bash
rm -rf node_modules
npm install
npx prisma generate
```

### Issue: Thai fonts not showing

**Solution**:
1. Verify fonts exist in `public/fonts/`
2. Check font paths in `lib/fonts.ts`
3. Fonts will be registered when PDF components are used

---

## 📊 Current Project Status

### Phase 1: Setup ✅ COMPLETE
- Directory structure
- Copilot instructions
- Prisma schema
- Task files
- Memory entities
- Documentation

### Phase 2: Next.js Initialization ✅ COMPLETE
- Next.js 15 installed
- Dependencies updated (all latest stable)
- Configuration files created
- App directory structure
- API routes created
- Utilities migrated
- Seed script created

### Phase 3: Component Migration 🚧 NEXT
- Migrate QuotationForm component
- Migrate ReceiptForm component
- Migrate PDF components
- Create quotation pages
- Create receipt pages
- Connect forms to API

---

## 🎯 Next Phase Preview

Once database setup is complete, Phase 3 will focus on:

1. **Copy Components from src/**
   - QuotationForm.tsx → components/quotation/
   - ReceiptForm.tsx → components/receipt/
   - QuotationPDF.tsx → components/quotation/
   - ReceiptPDF.tsx → components/receipt/

2. **Create Pages**
   - Quotation list page
   - Quotation create/edit page
   - Receipt list page
   - Receipt create/edit page

3. **Create Additional API Routes**
   - Quotations CRUD
   - Receipts CRUD
   - Number generation

4. **Test Integration**
   - Form to API to Database
   - PDF generation with database data
   - Thai fonts in PDFs
   - Postal code workaround

---

## 📁 Key Files Reference

### Configuration
- `next.config.js` - Next.js settings
- `tsconfig.json` - TypeScript settings
- `tailwind.config.js` - Tailwind CSS settings
- `.env` - Environment variables (DO NOT COMMIT)

### Application
- `app/layout.tsx` - Root layout
- `app/page.tsx` - Home page
- `lib/prisma.ts` - Database client
- `prisma/schema.prisma` - Database schema

### Documentation
- `MIGRATION_GUIDE.md` - Detailed migration steps
- `QUICKSTART_NEXTJS.md` - Quick setup guide
- `README_NEXTJS.md` - Project overview
- `.github/copilot-instructions.md` - Development guidelines

---

## 🔗 Useful Commands

```bash
# Development
npm run dev              # Start Next.js dev server
npm run dev:vite         # Start old Vite app (reference)

# Database
npx prisma studio        # Open database GUI
npx prisma generate      # Regenerate Prisma Client
npx prisma migrate dev   # Create new migration
npx prisma migrate reset # Reset database (CAUTION!)
npm run prisma:seed      # Seed database

# Build
npm run build            # Build for production
npm start                # Start production server
npm run lint             # Run ESLint
```

---

## ✨ Summary

**Phase 2 is complete!** You now have:

✅ Next.js 15 with App Router
✅ Latest stable dependencies (no deprecated packages)
✅ Prisma ORM configured
✅ Database schema ready
✅ Basic pages and API routes
✅ Utilities migrated
✅ Seed script ready

**Next**: Follow the steps above to initialize your database, then we can proceed to Phase 3 (component migration).

---

**Questions?**

- Check `MIGRATION_GUIDE.md` for detailed explanations
- Check `.github/copilot-instructions.md` for development guidelines
- Check `.github/tasks/` for progress tracking

**Happy coding! 🚀**