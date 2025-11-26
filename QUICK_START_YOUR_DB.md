# Quick Start - Your Database Setup

Get your Thai Quotation & Receipt Generator up and running in **5 minutes**! ⚡

This guide is specifically tailored for your database variable setup:
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USERNAME`
- `DB_PASSWORD`

---

## Prerequisites

- ✅ Node.js 22.x installed
- ✅ PostgreSQL installed and running
- ✅ Your database credentials ready

---

## Step 1: Create `.env` File (2 minutes)

Create a file named `.env` in the project root (`quotation-generator/.env`):

```env
# Your PostgreSQL credentials
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quotation_db
DB_USERNAME=postgres
DB_PASSWORD=YOUR_PASSWORD_HERE

# Prisma connection string (update password to match above)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD_HERE@localhost:5432/quotation_db?schema=public"

# App configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

**Replace `YOUR_PASSWORD_HERE`** with your actual PostgreSQL password in BOTH places!

### Format Explained

The `DATABASE_URL` must match your individual variables:

```
postgresql://[DB_USERNAME]:[DB_PASSWORD]@[DB_HOST]:[DB_PORT]/[DB_NAME]?schema=public
```

Example with actual values:
```env
DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/quotation_db?schema=public"
```

---

## Step 2: Verify Configuration (30 seconds)

```bash
cd quotation-generator
npm run verify:env
```

**Expected output:**
```
✅ All checks passed! Your .env is properly configured.
```

If you see errors, review `SETUP_YOUR_ENV.md` for troubleshooting.

---

## Step 3: Test Database Connection (30 seconds)

```bash
npm run test:db
```

**Expected output:**
```
✓ Database connection successful
✓ Found X tables
✓ Companies: 0
✓ Quotations: 0
✓ Receipts: 0
```

### If database doesn't exist:

```bash
# Create the database
createdb -U postgres quotation_db

# Or using psql
psql -U postgres -c "CREATE DATABASE quotation_db;"
```

---

## Step 4: Initialize Database (1 minute)

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# Add sample data (optional but recommended)
npm run prisma:seed
```

**Expected output:**
```
✓ Prisma Client generated
✓ Database migration completed
✓ Seed data added successfully
  - 1 sample company
  - 1 sample quotation
  - 1 sample receipt
```

---

## Step 5: Start Development Server (30 seconds)

```bash
npm run dev
```

**Server will start at:**
- 🌐 http://localhost:3000

**Open in your browser and you should see:**
- ✅ Home page with company info
- ✅ Recent quotations and receipts
- ✅ Navigation menu

---

## All-in-One Setup Command

If you prefer to run everything at once (after creating `.env`):

```bash
npm run setup
```

This runs:
1. ✅ Verify environment variables
2. ✅ Generate Prisma Client
3. ✅ Run database migrations
4. ✅ Seed sample data

Then start the server:
```bash
npm run dev
```

---

## Verify Everything Works

### 1. Home Page
- Visit: http://localhost:3000
- Should show default company info and recent documents

### 2. View Database
```bash
npx prisma studio
```
- Opens at: http://localhost:5555
- Browse companies, quotations, receipts

### 3. Test API Endpoints

**Get default company:**
```bash
curl http://localhost:3000/api/companies/default
```

**List all quotations:**
```bash
curl http://localhost:3000/api/quotations
```

---

## Common Issues & Quick Fixes

### ❌ "Connection refused"

**Problem:** PostgreSQL not running

**Fix:**
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Verify
pg_isready
```

---

### ❌ "password authentication failed"

**Problem:** Wrong credentials in `.env`

**Fix:**
1. Check your PostgreSQL password
2. Update both `DB_PASSWORD` and `DATABASE_URL` in `.env`
3. Run `npm run verify:env` to confirm

---

### ❌ "database does not exist"

**Problem:** Database not created yet

**Fix:**
```bash
createdb -U postgres quotation_db
```

---

### ❌ "relation does not exist"

**Problem:** Tables not created yet

**Fix:**
```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

## Project Structure Overview

```
quotation-generator/
├── .env                    # ← Your config (YOU CREATE THIS)
├── app/                    # Next.js pages
│   ├── page.tsx           # Home page
│   └── api/               # API routes
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── migrations/        # DB migrations
│   └── seed.ts            # Sample data
├── components/            # React components
├── lib/                   # Utilities
│   ├── prisma.ts         # DB client
│   ├── bahttext.ts       # Thai number converter
│   └── types.ts          # TypeScript types
└── public/fonts/         # Thai fonts (Sarabun, NotoSansThai)
```

---

## Useful Commands Reference

```bash
# Environment & Setup
npm run verify:env          # Check .env configuration
npm run setup              # Full setup (after creating .env)

# Database
npm run test:db            # Test connection
npx prisma generate        # Generate Prisma Client
npx prisma migrate dev     # Run migrations
npx prisma studio          # Open database GUI
npm run prisma:seed        # Add sample data

# Development
npm run dev                # Start dev server (port 3000)
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # Run ESLint

# Database Management
npx prisma migrate reset   # Reset DB (dev only)
npx prisma db push         # Push schema without migration
npx prisma db pull         # Pull schema from DB
```

---

## Next Steps

Once everything is running:

1. ✅ **Explore the app** at http://localhost:3000
2. ✅ **View database** with `npx prisma studio`
3. ✅ **Create quotations** - Test the PDF generation
4. ✅ **Create receipts** - Try both Thai and English
5. ✅ **Review code** - Check `app/`, `components/`, `lib/`

---

## Documentation

- **Full Setup Guide**: `SETUP_YOUR_ENV.md`
- **Migration Guide**: `MIGRATION_GUIDE.md`
- **Database Setup**: `DATABASE_SETUP.md`
- **Quick Reference**: `QUICK_REFERENCE.md`
- **Troubleshooting**: `TROUBLESHOOTING.md`

---

## Need Help?

### Run diagnostics:
```bash
# Check environment
npm run verify:env

# Test database
npm run test:db

# Check PostgreSQL
pg_isready
psql -U postgres -l
```

### Review your configuration:
```bash
# View (masked) environment variables
cat .env | grep -v "^#"
```

### Check logs:
- Next.js errors: Check terminal where `npm run dev` is running
- PostgreSQL logs: Check your PostgreSQL log directory

---

## You're Ready! 🚀

Your setup is complete when:
- ✅ `npm run verify:env` passes
- ✅ `npm run test:db` succeeds
- ✅ `npm run dev` starts without errors
- ✅ http://localhost:3000 loads successfully

**Happy coding!** 🎉