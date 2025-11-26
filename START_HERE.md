# 🚀 START HERE - Quick Setup Guide

## Welcome to Thai Quotation & Receipt Generator (Next.js)!

This guide will get you up and running in **5 minutes**.

---

## ✅ What's Already Done

Phase 2 is **complete**! You have:
- ✅ Next.js 15 configured
- ✅ React 19 installed
- ✅ Latest stable dependencies (no deprecated packages)
- ✅ Database schema ready
- ✅ API routes created
- ✅ Utilities migrated
- ✅ Complete documentation

---

## 📋 Your Action Checklist

Follow these steps in order:

### Step 1: Install Dependencies ⏱️ ~2 minutes

```bash
cd quotation-generator
npm install
```

**Expected**: Should install ~500+ packages without errors.

---

### Step 2: Configure Database ⏱️ ~1 minute

Create a `.env` file in the project root:

```bash
cat > .env << 'EOF'
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/quotation_db?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
EOF
```

**⚠️ IMPORTANT**: Replace `USERNAME`, `PASSWORD`, and `quotation_db` with your actual PostgreSQL credentials!

**For Zed MCP Server**: Use your existing PostgreSQL connection details.

---

### Step 3: Initialize Database ⏱️ ~2 minutes

```bash
# Generate Prisma Client
npx prisma generate

# Create database and tables
npx prisma migrate dev --name init

# Seed with sample data
npm run prisma:seed
```

**Expected Output**:
```
✅ Created default company: บริษัท ตัวอย่าง จำกัด
✅ Created sample quotation: QT-2024-0001
✅ Created sample receipt: RC-2024-0001
🎉 Database seeding completed successfully!
```

---

### Step 4: Verify Database (Optional) ⏱️ ~1 minute

```bash
# Open Prisma Studio - database GUI
npx prisma studio
```

**Opens**: http://localhost:5555

You should see:
- 5 tables: companies, quotations, quotation_items, receipts, receipt_items
- 1 company with default flag
- 1 sample quotation
- 1 sample receipt

---

### Step 5: Start Development Server ⏱️ ~30 seconds

```bash
npm run dev
```

**Opens**: http://localhost:3000

---

### Step 6: Test the Application ⏱️ ~1 minute

Visit http://localhost:3000

**You Should See**:
- ✅ Header: "Thai Quotation & Receipt Generator"
- ✅ Blue box with default company info
- ✅ Two large gradient buttons (Quotation & Receipt) showing "1 docs" each
- ✅ Recent documents section showing:
  - QT-2024-0001 (sample quotation)
  - RC-2024-0001 (sample receipt)
- ✅ Footer with copyright

**If everything displays correctly**: 🎉 **SUCCESS! You're ready!**

---

## 🎯 Quick Commands Reference

```bash
# Development
npm run dev              # Start Next.js dev server (port 3000)
npm run dev:vite         # Start old Vite app (reference only)

# Database
npx prisma studio        # Open database GUI (port 5555)
npx prisma generate      # Regenerate Prisma Client
npx prisma migrate dev   # Create new migration
npm run prisma:seed      # Seed sample data

# Build
npm run build            # Build for production
npm start                # Start production server
```

---

## 🐛 Troubleshooting

### "Can't reach database server"

1. Verify PostgreSQL is running:
   ```bash
   pg_isready
   ```

2. Check your `.env` file DATABASE_URL

3. Test connection:
   ```bash
   psql -U username -d quotation_db
   ```

---

### "Port 3000 already in use"

```bash
# Kill existing process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

---

### "Prisma Client not found"

```bash
npm install @prisma/client
npx prisma generate
```

---

### Still having issues?

1. Check `INSTALLATION.md` for detailed troubleshooting
2. Review `MIGRATION_GUIDE.md` for comprehensive explanations
3. Check console for specific error messages

---

## 📚 Documentation

| Document | When to Read |
|----------|--------------|
| **START_HERE.md** (this file) | First - quick setup |
| **INSTALLATION.md** | Detailed setup guide |
| **MIGRATION_GUIDE.md** | Full migration process |
| **QUICKSTART_NEXTJS.md** | 5-minute setup reference |
| **README_NEXTJS.md** | Project overview |
| **PHASE_2_COMPLETE.md** | What's been completed |

---

## 🎯 What's Next (Phase 3)

Once your app is running, the next phase will:
- ✅ Migrate QuotationForm component
- ✅ Migrate ReceiptForm component  
- ✅ Migrate PDF generation components
- ✅ Create quotation pages (list, create, edit)
- ✅ Create receipt pages (list, create, edit)
- ✅ Connect forms to API
- ✅ Test PDF generation with database data

---

## ✨ Current Features

**Working Now**:
- ✅ Home page with SSR
- ✅ Default company display
- ✅ Recent documents (quotations & receipts)
- ✅ Document counts
- ✅ Companies API (list, create, get default)
- ✅ Database storage (PostgreSQL + Prisma)
- ✅ Thai bahttext converter
- ✅ Thai font support ready

**Coming in Phase 3**:
- PDF generation with database data
- Create new quotations
- Create new receipts
- Edit documents
- Delete documents
- Search and filter
- Complete CRUD operations

---

## 🚨 Important Notes

1. **Database**: Add 2 trailing spaces to addresses (postal code workaround)
2. **Vite app**: Keep `src/` directory for reference during migration
3. **Sequential thinking**: Use for complex tasks and planning
4. **Task tracking**: Update task files as you progress

---

## ✅ Success Checklist

Before proceeding to Phase 3, verify:

- [ ] `npm install` completed without errors
- [ ] `.env` file created with correct DATABASE_URL
- [ ] `npx prisma generate` succeeded
- [ ] `npx prisma migrate dev` created all tables
- [ ] `npm run prisma:seed` created sample data
- [ ] Prisma Studio shows 5 tables with data
- [ ] `npm run dev` starts without errors
- [ ] http://localhost:3000 loads successfully
- [ ] Default company displays
- [ ] Recent documents show sample data
- [ ] No TypeScript errors
- [ ] No console errors

---

## 🎉 Ready!

If all steps completed successfully, you're ready for Phase 3!

**Your Next.js app is running with**:
- Latest React 19
- Next.js 15 with App Router
- PostgreSQL database
- Prisma ORM
- Type-safe API routes
- Thai font support
- All utilities migrated

**Next Step**: Let me know when you're ready to migrate the PDF components and forms!

---

**Questions?** Check `INSTALLATION.md` for detailed help.

**Happy coding! 🚀**