# Database Setup Guide

## Quick Setup (3 Steps)

### Step 1: Create .env File

Copy the example file and edit it with your credentials:

```bash
cd quotation-generator
cp .env.example .env
```

Then edit `.env` and update the `DATABASE_URL`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/quotation_db?schema=public"
```

**Replace with your actual credentials:**
- `postgres` (first one) = your PostgreSQL username
- `postgres` (second one) = your PostgreSQL password
- `localhost` = your database host
- `5432` = your PostgreSQL port
- `quotation_db` = database name

---

### Step 2: Test Database Connection

```bash
npm run test:db
```

**Expected Output:**
```
✅ Successfully connected to database!
✅ Database query successful!
📊 PostgreSQL Information: PostgreSQL 14.x...
```

**If connection fails**, see [Troubleshooting](#troubleshooting) below.

---

### Step 3: Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# Add sample data
npm run prisma:seed
```

**Expected Output:**
```
✅ Created default company: บริษัท ตัวอย่าง จำกัด
✅ Created sample quotation: QT-2024-0001
✅ Created sample receipt: RC-2024-0001
🎉 Database seeding completed successfully!
```

---

## Finding Your Database Credentials

### If Using Zed with MCP PostgreSQL Server

1. Check your Zed MCP server configuration
2. Look for PostgreSQL connection settings
3. Use the same credentials in your `.env` file

### If Using Local PostgreSQL

**Default Credentials (often):**
- Username: `postgres`
- Password: Set during installation
- Host: `localhost`
- Port: `5432`

**Check if PostgreSQL is running:**
```bash
pg_isready
```

**Check PostgreSQL version:**
```bash
psql --version
```

**List all databases:**
```bash
psql -U postgres -l
```

---

## Creating the Database

If the database doesn't exist yet, create it:

### Method 1: Using createdb command
```bash
createdb -U postgres quotation_db
```

### Method 2: Using psql
```bash
psql -U postgres
```
Then in psql:
```sql
CREATE DATABASE quotation_db;
\q
```

### Method 3: Using the connection test script
The test script will show you the exact command to run if the database doesn't exist.

---

## Troubleshooting

### Error: "Can't reach database server"

**Problem:** PostgreSQL is not running

**Solutions:**

**macOS (Homebrew):**
```bash
# Check status
brew services list

# Start PostgreSQL
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
# Check status
sudo service postgresql status

# Start PostgreSQL
sudo service postgresql start
```

**Windows:**
```bash
# Check if running
pg_ctl status

# Start PostgreSQL
pg_ctl start
```

**Docker:**
```bash
docker run --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:14
```

---

### Error: "Password authentication failed"

**Problem:** Wrong username or password

**Solutions:**

1. **Check your .env file** - make sure credentials are correct
2. **Check for spaces** - no spaces around `=` or in the URL
3. **Try default credentials** - username: `postgres`, password: `postgres`

**Reset PostgreSQL password:**
```bash
sudo -u postgres psql
```
Then:
```sql
ALTER USER postgres PASSWORD 'newpassword';
\q
```

Update your `.env` with the new password.

---

### Error: "Database does not exist"

**Problem:** Database `quotation_db` hasn't been created

**Solution:**
```bash
createdb -U postgres quotation_db
```

Or manually:
```bash
psql -U postgres
CREATE DATABASE quotation_db;
\q
```

---

### Error: "Port 5432 already in use"

**Problem:** Another PostgreSQL instance is using the port

**Solutions:**

1. **Find what's using the port:**
```bash
lsof -i :5432
```

2. **Stop the conflicting service:**
```bash
# macOS
brew services stop postgresql@14

# Linux
sudo service postgresql stop
```

3. **Or use a different port** in your DATABASE_URL:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/quotation_db?schema=public"
```

---

### Error: "relation does not exist"

**Problem:** Database tables haven't been created

**Solution:**
```bash
npx prisma migrate dev --name init
```

---

## Verifying Your Setup

### 1. Test Connection
```bash
npm run test:db
```

Should show:
- ✅ Connected to database
- ✅ Tables exist
- ✅ Sample data loaded

### 2. View Database in Prisma Studio
```bash
npx prisma studio
```

Opens at http://localhost:5555

You should see:
- 5 tables: companies, quotations, quotation_items, receipts, receipt_items
- 1 company in the companies table
- 1 quotation in quotations table
- 1 receipt in receipts table

### 3. Test with psql
```bash
psql "postgresql://postgres:postgres@localhost:5432/quotation_db"
```

Then:
```sql
-- List tables
\dt

-- Count companies
SELECT COUNT(*) FROM companies;

-- View default company
SELECT name, "taxId", phone FROM companies WHERE "isDefault" = true;

-- Exit
\q
```

---

## Common DATABASE_URL Formats

### Local PostgreSQL
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/quotation_db?schema=public"
```

### PostgreSQL with SSL
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/quotation_db?schema=public&sslmode=require"
```

### Docker PostgreSQL
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/quotation_db?schema=public"
```

### Remote PostgreSQL
```env
DATABASE_URL="postgresql://user:pass@remote-host.com:5432/quotation_db?schema=public"
```

### Supabase
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?schema=public"
```

### Railway
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST].railway.app:5432/railway?schema=public"
```

---

## Database Schema Overview

After migration, you'll have these tables:

1. **companies** - Store company information
   - Default company for quotations/receipts
   - Bank details, tax ID, logo

2. **quotations** - Quotation documents (ใบเสนอราคา)
   - Auto-generated numbers (QT-2024-0001)
   - Customer info, dates, totals
   - VAT calculations

3. **quotation_items** - Line items in quotations
   - Hierarchical (main items + sub-items)
   - Quantities, units, prices

4. **receipts** - Receipt documents (ใบเสร็จรับเงิน)
   - Auto-generated numbers (RC-2024-0001)
   - Payment information

5. **receipt_items** - Line items in receipts
   - Same structure as quotation items

---

## Useful Commands Reference

```bash
# Test database connection
npm run test:db

# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name description

# Apply migrations
npx prisma migrate deploy

# Reset database (CAUTION: deletes all data)
npx prisma migrate reset

# Seed database
npm run prisma:seed

# Open Prisma Studio
npx prisma studio

# View PostgreSQL logs (macOS)
tail -f /usr/local/var/log/postgresql@14.log
```

---

## Security Notes

- ⚠️ **Never commit .env to git** (it's in .gitignore)
- ⚠️ **Use strong passwords in production**
- ⚠️ **Use SSL for remote connections**
- ⚠️ **Rotate credentials regularly**
- ⚠️ **Backup your database regularly**

---

## Next Steps

Once your database is set up and tested:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Visit your app:**
   ```
   http://localhost:3000
   ```

3. **You should see:**
   - Default company information
   - Sample quotation and receipt
   - Working dashboard

---

## Need Help?

- Check `START_HERE.md` for quick setup
- Check `INSTALLATION.md` for detailed instructions
- Run `npm run test:db` to diagnose issues
- Check PostgreSQL logs for detailed errors

---

**Status:** Ready to set up your database! 🚀