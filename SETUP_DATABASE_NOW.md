# 🚀 Set Up Your Database RIGHT NOW

## Step 1: Create .env file (30 seconds)

```bash
cd quotation-generator
cp .env.example .env
```

Now edit `.env` and change this line:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/quotation_db?schema=public"
```

**Replace:**
- First `postgres` = your PostgreSQL username
- Second `postgres` = your PostgreSQL password
- `localhost` = your database host (usually localhost)
- `5432` = your PostgreSQL port (usually 5432)

**Don't know your credentials?** Try the default:
- Username: `postgres`
- Password: `postgres` (or whatever you set during installation)

---

## Step 2: Test Connection (10 seconds)

```bash
npm run test:db
```

**Expected:** ✅ Successfully connected to database!

**If it fails:** See error message for exact fix needed.

---

## Step 3: Create Database Tables (30 seconds)

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

**Expected:**
```
✅ Created default company: บริษัท ตัวอย่าง จำกัด
✅ Created sample quotation: QT-2024-0001
✅ Created sample receipt: RC-2024-0001
```

---

## Step 4: Start Your App! (10 seconds)

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 🎉 Done!

You should see:
- ✅ Home page with default company
- ✅ Two buttons (Quotation & Receipt)
- ✅ Sample documents (1 quotation, 1 receipt)

---

## 🐛 Quick Fixes

### "Can't reach database server"
PostgreSQL isn't running. Start it:

**macOS:**
```bash
brew services start postgresql@14
```

**Linux:**
```bash
sudo service postgresql start
```

**Docker:**
```bash
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:14
```

---

### "Database does not exist"
Create it:
```bash
createdb -U postgres quotation_db
```

---

### "Password authentication failed"
Check your .env file:
1. Make sure username and password are correct
2. No spaces in the DATABASE_URL
3. Password is the one you set during PostgreSQL installation

---

## 📊 Verify Everything Works

**View your database:**
```bash
npx prisma studio
```
Opens at http://localhost:5555

You should see 5 tables with data!

---

**Total time: ~2 minutes** ⏱️

**Still stuck?** Check `DATABASE_SETUP.md` for detailed troubleshooting.