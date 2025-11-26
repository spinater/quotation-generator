# Run Prisma Migration via SQL

Since the external Prisma connection is having authentication issues, but your MCP PostgreSQL connection works, here's how to run the Prisma migration manually:

---

## ✅ What You Need

- **File**: `database-init.sql` (already generated from Prisma schema)
- **Connection**: Your MCP PostgreSQL or psql command line
- **Database**: `company_management` at `45.136.237.124:55320`

---

## 🚀 Quick Steps

### Option 1: Using psql Command Line (Recommended)

```bash
cd quotation-generator

# Run the Prisma-generated migration SQL
psql -h 45.136.237.124 -p 55320 -U admin -d company_management -f database-init.sql

# Enter password when prompted: 4OjI!qe1psjdnR2VG8p0$QE-I!
```

### Option 2: Using Database GUI Tool

1. Open your database admin tool (pgAdmin, DBeaver, TablePlus, etc.)
2. Connect to:
   - Host: `45.136.237.124`
   - Port: `55320`
   - Database: `company_management`
   - Username: `admin`
   - Password: `4OjI!qe1psjdnR2VG8p0$QE-I!`
3. Open and execute `database-init.sql`

### Option 3: Copy-Paste Individual Statements

If you prefer, copy SQL statements from `database-init.sql` and paste them into your query editor one section at a time.

---

## 📋 What the Migration Creates

The `database-init.sql` file contains the exact SQL that Prisma would run:

✅ **5 Tables:**
- `companies` - Company information
- `quotations` - Quotation documents
- `quotation_items` - Line items for quotations (with sub-item support)
- `receipts` - Receipt documents
- `receipt_items` - Line items for receipts (with sub-item support)

✅ **Indexes** - For fast queries on common fields

✅ **Foreign Keys** - Ensures data integrity

✅ **Sample Data** - One default company to get started

---

## ✓ Verify Migration Success

After running the SQL, verify tables were created:

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('companies', 'quotations', 'quotation_items', 'receipts', 'receipt_items')
ORDER BY table_name;
```

Expected output: 5 tables listed

```sql
-- Check sample company was created
SELECT * FROM companies WHERE "isDefault" = true;
```

Expected output: 1 company row

---

## 🔧 After Migration

Once the SQL migration is complete:

### 1. Create Prisma Migration Record

Even though we ran the SQL manually, we should tell Prisma the migration happened:

```bash
cd quotation-generator

# Create the migrations directory structure
mkdir -p prisma/migrations/20240101000000_init

# Copy the SQL file
cp database-init.sql prisma/migrations/20240101000000_init/migration.sql

# Mark migration as applied (this won't run SQL, just records it)
npx prisma migrate resolve --applied 20240101000000_init
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Verify Prisma Can See the Schema

```bash
# Pull schema from database to verify
npx prisma db pull

# This should show "Your database is in sync with your Prisma schema"
```

### 4. Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🐛 Troubleshooting

### Error: "relation already exists"

If tables already exist, you have two options:

**Option A: Drop and recreate (DELETES ALL DATA)**
```sql
DROP TABLE IF EXISTS receipt_items CASCADE;
DROP TABLE IF EXISTS receipts CASCADE;
DROP TABLE IF EXISTS quotation_items CASCADE;
DROP TABLE IF EXISTS quotations CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- Then run database-init.sql again
```

**Option B: Skip table creation, only run missing parts**
Edit `database-init.sql` and comment out the CREATE TABLE statements that already exist.

### Error: "permission denied"

Make sure you're connected as the `admin` user with write permissions.

### Tables created but Prisma can't connect

This is expected - your MCP connection works but external Prisma connection has authentication issues. For now:

1. Use the database through MCP for queries
2. Develop the frontend
3. We'll resolve the Prisma connection separately

---

## 📝 Next Steps After Successful Migration

1. ✅ Tables are created in `company_management` database
2. ✅ Sample company exists
3. ✅ You can start the Next.js app: `npm run dev`
4. ✅ The app will display the home page
5. ⚠️  API routes that use Prisma may still fail due to connection issues

### Workaround for Development

While we fix the Prisma connection issue, you can:
- Work on UI/UX components
- Test PDF generation with mock data
- Develop frontend logic
- Use MCP queries for data access if needed

---

## 🎯 Final Command Summary

```bash
# 1. Run migration SQL
psql -h 45.136.237.124 -p 55320 -U admin -d company_management -f database-init.sql

# 2. Record migration in Prisma
mkdir -p prisma/migrations/20240101000000_init
cp database-init.sql prisma/migrations/20240101000000_init/migration.sql
npx prisma migrate resolve --applied 20240101000000_init

# 3. Generate Prisma Client
npx prisma generate

# 4. Start dev server
npm run dev
```

---

**Ready to proceed?** Run the psql command above to execute the migration! 🚀