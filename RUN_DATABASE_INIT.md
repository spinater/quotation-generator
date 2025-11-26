# Database Initialization Guide

Your database connection is configured correctly through MCP, but the Prisma client connection from the Next.js app is experiencing authentication issues with the external connection details.

Since your MCP PostgreSQL server is working, here's how to initialize your database:

---

## ✅ Your Current Setup

- **Database Host**: 45.136.237.124:55320
- **Database Name**: company_management
- **Username**: admin
- **MCP Connection**: ✅ Working
- **External Connection**: ❌ Authentication failing

---

## 🎯 Solution: Run SQL Script Directly

I've created `database-init.sql` which contains all the table creation statements.

### Option 1: Using psql Command Line (Recommended)

```bash
# Navigate to project directory
cd quotation-generator

# Run the SQL script
psql -h 45.136.237.124 -p 55320 -U admin -d company_management -f database-init.sql

# You'll be prompted for the password:
# Password: 4OjI!qe1psjdnR2VG8p0$QE-I!
```

### Option 2: Using a Database GUI Tool

1. Open your database admin tool (pgAdmin, DBeaver, TablePlus, etc.)
2. Connect to your database:
   - Host: `45.136.237.124`
   - Port: `55320`
   - Database: `company_management`
   - Username: `admin`
   - Password: `4OjI!qe1psjdnR2VG8p0$QE-I!`
3. Open `database-init.sql` in the query editor
4. Execute the entire script

### Option 3: Copy-Paste SQL Statements

If you have a database query interface, copy the SQL from `database-init.sql` and paste it into your query editor, then execute.

---

## 📋 What the Script Does

The `database-init.sql` script will:

1. ✅ Create `companies` table
2. ✅ Create `quotations` table
3. ✅ Create `quotation_items` table
4. ✅ Create `receipts` table
5. ✅ Create `receipt_items` table
6. ✅ Add indexes for performance
7. ✅ Create auto-update triggers for `updated_at` columns
8. ✅ Insert a sample company (default)
9. ✅ Verify all tables were created

---

## 🔍 Verify Database Setup

After running the script, verify it worked using the MCP query:

```sql
-- Check all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check sample company
SELECT * FROM companies WHERE is_default = true;

-- Count records
SELECT 
  (SELECT COUNT(*) FROM companies) as companies,
  (SELECT COUNT(*) FROM quotations) as quotations,
  (SELECT COUNT(*) FROM receipts) as receipts;
```

Expected output:
```
companies: 1
quotations: 0
receipts: 0
```

---

## 🚨 About the Prisma Connection Issue

The external database connection from your Next.js app is failing authentication. This could be due to:

1. **Network restrictions**: External access may be restricted
2. **Credential mapping**: MCP might use different internal credentials
3. **Port forwarding**: The external port (55320) may route differently than internal (5432)

### Workaround Options:

#### Option A: Use MCP for All Database Operations (Recommended for Now)

Since MCP connection works, you can:
- Run SQL scripts through MCP or psql
- Use the app read-only for now
- Focus on frontend development while we resolve the connection

#### Option B: Find the Correct External Credentials

Check with your database administrator for:
- Correct external connection credentials
- Whether external access is allowed
- SSL/TLS requirements
- Any special connection parameters

#### Option C: Use Local PostgreSQL for Development

Set up a local PostgreSQL database:
```bash
# Install PostgreSQL locally
brew install postgresql  # macOS
# or your system's package manager

# Start PostgreSQL
brew services start postgresql

# Create database
createdb quotation_db

# Update .env to use local database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/quotation_db?schema=public"

# Run migrations
npx prisma migrate dev --name init
```

---

## ✨ After Database is Initialized

Once tables are created (via any method above):

1. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

2. **Verify schema matches**:
   ```bash
   npx prisma db pull
   ```
   This will pull the actual database schema and show if anything differs.

3. **If using local DB, seed sample data**:
   ```bash
   npm run prisma:seed
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

---

## 🎯 Immediate Next Steps

**Choose your path:**

### Path 1: Continue with MCP Database (Quick Start)
```bash
# 1. Run the SQL script via psql or GUI tool
psql -h 45.136.237.124 -p 55320 -U admin -d company_management -f database-init.sql

# 2. Generate Prisma Client (may still fail to connect, but schema is there)
npx prisma generate

# 3. Work on frontend with MCP for data access
# Focus on UI/UX development
```

### Path 2: Switch to Local Database (Recommended for Development)
```bash
# 1. Install PostgreSQL locally
brew install postgresql

# 2. Create local database
createdb quotation_db

# 3. Update .env
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/quotation_db?schema=public"

# 4. Run migrations
npx prisma generate
npx prisma migrate dev --name init

# 5. Seed data
npm run prisma:seed

# 6. Start dev server
npm run dev
```

### Path 3: Troubleshoot External Connection
```bash
# Try different connection parameters:

# Without SSL
DATABASE_URL="postgresql://admin:4OjI!qe1psjdnR2VG8p0%24QE-I!@45.136.237.124:55320/company_management?schema=public"

# With explicit sslmode=disable
DATABASE_URL="postgresql://admin:4OjI!qe1psjdnR2VG8p0%24QE-I!@45.136.237.124:55320/company_management?schema=public&sslmode=disable"

# With connect_timeout
DATABASE_URL="postgresql://admin:4OjI!qe1psjdnR2VG8p0%24QE-I!@45.136.237.124:55320/company_management?schema=public&connect_timeout=10"

# Test each with:
npm run test:db
```

---

## 💡 Recommendation

I recommend **Path 2 (Local Database)** for development because:
- ✅ Full control over database
- ✅ Faster development (no network latency)
- ✅ Can use Prisma migrations freely
- ✅ No external connection issues
- ✅ Easy to reset/seed during development
- ✅ Can sync to MCP database for production later

Once you have the app working locally, you can deploy to production using your MCP database with proper credentials.

---

## 📞 Need Help?

If you're stuck, let me know which path you want to take and I'll provide detailed step-by-step instructions!