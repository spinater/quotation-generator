# Environment Setup Guide - Your DB Variables

This guide shows you how to set up your `.env` file using your specific database variable names:
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USERNAME`
- `DB_PASSWORD`

---

## Quick Setup (Copy & Paste)

### Step 1: Create your `.env` file

In the project root (`quotation-generator/`), create a file named `.env` with this content:

```env
# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================

# Your PostgreSQL connection details
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quotation_db
DB_USERNAME=postgres
DB_PASSWORD=your_actual_password_here

# Prisma requires DATABASE_URL (constructed from variables above)
DATABASE_URL="postgresql://postgres:your_actual_password_here@localhost:5432/quotation_db?schema=public"

# =============================================================================
# APPLICATION CONFIGURATION
# =============================================================================

NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Step 2: Update the values

Replace these placeholders with your actual credentials:

1. **DB_PASSWORD**: Your PostgreSQL password
2. **DATABASE_URL**: Update the password in the connection string to match `DB_PASSWORD`

**Important**: The `DATABASE_URL` must use the same values as your individual DB variables. Update both places!

---

## Detailed Instructions

### If you're using a remote database or non-default settings:

Edit your `.env` file to match your setup:

```env
# Example: Remote PostgreSQL server
DB_HOST=192.168.1.100
DB_PORT=5432
DB_NAME=quotation_db
DB_USERNAME=myuser
DB_PASSWORD=mypassword123

# Update DATABASE_URL to match
DATABASE_URL="postgresql://myuser:mypassword123@192.168.1.100:5432/quotation_db?schema=public"
```

```env
# Example: Custom port
DB_HOST=localhost
DB_PORT=5433
DB_NAME=my_custom_db
DB_USERNAME=postgres
DB_PASSWORD=secret123

# Update DATABASE_URL to match
DATABASE_URL="postgresql://postgres:secret123@localhost:5433/my_custom_db?schema=public"
```

---

## DATABASE_URL Format Explanation

The `DATABASE_URL` is required by Prisma and must follow this format:

```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?schema=public
```

**Mapping your variables:**

```
postgresql://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public
```

**Example with your values:**
- DB_USERNAME = `postgres`
- DB_PASSWORD = `mypass123`
- DB_HOST = `localhost`
- DB_PORT = `5432`
- DB_NAME = `quotation_db`

Becomes:
```
DATABASE_URL="postgresql://postgres:mypass123@localhost:5432/quotation_db?schema=public"
```

---

## Special Cases

### Password contains special characters

If your password has special characters (like `@`, `:`, `#`, `%`), you need to URL-encode them:

| Character | URL Encoded |
|-----------|-------------|
| `@`       | `%40`       |
| `:`       | `%3A`       |
| `#`       | `%23`       |
| `%`       | `%25`       |
| `?`       | `%3F`       |
| `/`       | `%2F`       |
| ` ` (space) | `%20`     |

**Example:**
- Password: `my@pass:123`
- Encoded: `my%40pass%3A123`
- DATABASE_URL: `postgresql://postgres:my%40pass%3A123@localhost:5432/quotation_db?schema=public`

### Using SSL connection

For secure connections (production), add SSL mode:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/quotation_db?schema=public&sslmode=require"
```

---

## Verify Your Setup

### Step 1: Check if PostgreSQL is running

```bash
# Check if PostgreSQL is running
pg_isready

# Expected output: "localhost:5432 - accepting connections"
```

### Step 2: Check if database exists

```bash
# List all databases
psql -U postgres -l

# Or connect directly
psql -h localhost -p 5432 -U postgres -d quotation_db
```

### Step 3: Test connection with the app

```bash
cd quotation-generator
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

---

## Troubleshooting

### Error: "Connection refused"

**Problem**: PostgreSQL is not running or wrong host/port

**Solutions:**
1. Start PostgreSQL:
   ```bash
   # macOS (Homebrew)
   brew services start postgresql
   
   # Linux
   sudo systemctl start postgresql
   
   # Check status
   pg_isready
   ```

2. Verify host and port in `.env`:
   ```env
   DB_HOST=localhost  # or 127.0.0.1
   DB_PORT=5432       # default PostgreSQL port
   ```

### Error: "password authentication failed"

**Problem**: Wrong username or password

**Solutions:**
1. Double-check `DB_USERNAME` and `DB_PASSWORD` in `.env`
2. Update `DATABASE_URL` to match
3. Reset PostgreSQL password if needed:
   ```bash
   psql -U postgres
   ALTER USER postgres PASSWORD 'new_password';
   \q
   ```

### Error: "database does not exist"

**Problem**: Database hasn't been created yet

**Solution:**
```bash
# Create the database
createdb -U postgres quotation_db

# Or using psql
psql -U postgres
CREATE DATABASE quotation_db;
\q
```

### Error: "relation does not exist"

**Problem**: Database exists but tables haven't been created

**Solution:**
```bash
cd quotation-generator

# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init
```

---

## Complete Setup Checklist

- [ ] Created `.env` file in project root
- [ ] Set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`
- [ ] Constructed `DATABASE_URL` with same values
- [ ] Set `NEXT_PUBLIC_APP_URL="http://localhost:3000"`
- [ ] Set `NODE_ENV="development"`
- [ ] PostgreSQL service is running (`pg_isready`)
- [ ] Database exists (`psql -U postgres -l`)
- [ ] Ran `npm install` to install dependencies
- [ ] Ran `npm run test:db` successfully
- [ ] Ran `npx prisma generate` to generate Prisma Client
- [ ] Ran `npx prisma migrate dev --name init` to create tables
- [ ] Ran `npm run prisma:seed` to add sample data (optional)
- [ ] Started dev server with `npm run dev`
- [ ] Visited http://localhost:3000 in browser

---

## Next Steps

Once your `.env` is set up and `npm run test:db` passes:

1. **Initialize the database:**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

2. **Seed with sample data:**
   ```bash
   npm run prisma:seed
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - http://localhost:3000

5. **Explore database (optional):**
   ```bash
   npx prisma studio
   ```
   Opens a web UI at http://localhost:5555 to view/edit data

---

## Security Reminders

- ✅ `.env` is in `.gitignore` (never commit it)
- ✅ Use strong passwords in production
- ✅ Use SSL/TLS for remote databases
- ✅ Rotate credentials regularly
- ✅ Never share `.env` files publicly

---

## Need Help?

If you encounter issues:

1. Check `TROUBLESHOOTING.md` in project root
2. Review `DATABASE_SETUP.md` for detailed database setup
3. Run `npm run test:db` to diagnose connection issues
4. Check PostgreSQL logs for error details

---

**Ready to proceed?** Follow the checklist above and you'll have your environment configured in minutes! 🚀