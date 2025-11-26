# Testing Guide

This document outlines the testing strategy and available tests for the Thai Quotation & Receipt Generator.

---

## 🎯 Testing Philosophy

**Every change must be tested before being considered complete.**

We follow these principles:
1. ✅ Test before declaring work complete
2. ✅ Automate what can be automated
3. ✅ Verify both functionality and configuration
4. ✅ Catch errors early in development

---

## 🧪 Available Tests

### 1. Full Test Suite

Run all tests to verify the entire application:

```bash
npm run test
```

This runs:
- ✅ Environment configuration verification
- ✅ Database connection test
- ✅ Application startup test
- ✅ API endpoint tests

**Use this before:**
- Committing code
- Deploying
- Declaring a feature complete
- After configuration changes

---

### 2. Environment Verification

Verifies your `.env` configuration:

```bash
npm run verify:env
```

**What it checks:**
- ✅ All required environment variables present
- ✅ DATABASE_URL format is correct
- ✅ Individual DB variables match DATABASE_URL
- ✅ URL encoding is correct
- ✅ Application URLs are valid

**Expected output:**
```
✅ All checks passed! Your .env is properly configured.
```

**When to run:**
- After creating/updating `.env`
- When database connection fails
- Before running migrations
- After changing credentials

---

### 3. Database Connection Test

Tests PostgreSQL connection and schema:

```bash
npm run test:db
```

**What it checks:**
- ✅ Database connection successful
- ✅ Can execute queries
- ✅ Required tables exist
- ✅ Sample data is present
- ✅ Schema is correct

**Expected output:**
```
✅ Database Connection Test: SUCCESS

Found 6 table(s):
   1. _prisma_migrations
   2. companies
   3. quotation_items
   4. quotations
   5. receipt_items
   6. receipts
```

**When to run:**
- After database migrations
- When API errors occur
- After `.env` changes
- To verify database state

---

### 4. Application Startup Test

Tests if Next.js app can start and serve pages:

```bash
npm run test:app
```

**What it checks:**
- ✅ Dev server starts successfully
- ✅ Home page loads without errors
- ✅ API endpoints respond correctly
- ✅ No compilation errors
- ✅ Application is stable

**Expected output:**
```
✅ All tests passed! Application is working correctly.

Results: 4/4 tests passed
```

**When to run:**
- After code changes
- After dependency updates
- After configuration changes
- Before pushing code

---

## 📋 Testing Workflow

### Daily Development

```bash
# 1. Start your work session
npm run verify:env
npm run test:db

# 2. Make your changes
# ... edit code ...

# 3. Before committing
npm run test

# 4. If all pass, start dev server
npm run dev
```

### After Major Changes

```bash
# 1. Full test suite
npm run test

# 2. Manual verification
npm run dev
# Visit http://localhost:3000
# Test features manually

# 3. Check Prisma Studio
npx prisma studio
# Verify data looks correct
```

### Before Deployment

```bash
# 1. Full test suite
npm run test

# 2. Production build test
npm run build
npm run start

# 3. Verify production build
curl http://localhost:3000
```

---

## 🔧 Configuration Testing

### Module System Issues

**Problem:** `module is not defined in ES module scope`

**Cause:** Config files using CommonJS when package.json has `"type": "module"`

**Solution:**
```bash
# Rename config files to .cjs
mv postcss.config.js postcss.config.cjs
mv tailwind.config.js tailwind.config.cjs

# Or update to ESM format
# next.config.js should use: export default nextConfig
```

**Test after fix:**
```bash
npm run test:app
```

---

### Environment Variable Issues

**Problem:** `DATABASE_URL` not found or invalid

**Test:**
```bash
npm run verify:env
```

**Common fixes:**
- Check `.env` file exists in project root
- Verify no extra spaces around `=`
- Check special characters are URL-encoded
- Ensure no quotes around values (unless part of value)

---

### Database Connection Issues

**Problem:** Authentication failed

**Test:**
```bash
npm run test:db
```

**Common fixes:**
- Verify password in `.env` is correct
- Check special characters (`$`, `!`, `@`) are escaped
- Try with `sslmode=disable` in DATABASE_URL
- Verify host and port are correct

---

## 🎨 Manual Testing Checklist

After automated tests pass, manually verify:

### Homepage
- [ ] Loads without errors
- [ ] Shows default company information
- [ ] Displays recent quotations
- [ ] Displays recent receipts
- [ ] Navigation works

### API Endpoints
- [ ] `GET /api/companies/default` returns company
- [ ] `GET /api/quotations` returns list
- [ ] `GET /api/receipts` returns list

### Database
- [ ] Can connect via Prisma Studio
- [ ] Tables have correct structure
- [ ] Sample data is present

### PDF Generation (Future)
- [ ] Thai fonts render correctly
- [ ] No postal code truncation
- [ ] Both Thai and English work

---

## 🐛 Troubleshooting Failed Tests

### Test: verify:env fails

**Error:** `DATABASE_URL format invalid`

**Fix:**
```bash
# Check format
echo $DATABASE_URL

# Should be:
# postgresql://user:password@host:port/database?schema=public

# Verify with:
npm run verify:env
```

---

### Test: test:db fails

**Error:** `Authentication failed`

**Fix:**
1. Check password in `.env`
2. Try URL-encoding special characters:
   ```bash
   node -e "console.log(encodeURIComponent('your-password'))"
   ```
3. Update DATABASE_URL with encoded password

---

### Test: test:app fails

**Error:** `Server startup timeout`

**Fix:**
1. Check for syntax errors:
   ```bash
   npm run lint
   ```
2. Check TypeScript compilation:
   ```bash
   npx tsc --noEmit
   ```
3. Try manual start to see full error:
   ```bash
   npm run dev
   ```

---

**Error:** `module is not defined`

**Fix:**
1. Check `package.json` has `"type": "module"`
2. Rename config files:
   ```bash
   mv postcss.config.js postcss.config.cjs
   mv tailwind.config.js tailwind.config.cjs
   ```
3. Update `next.config.js` to use `export default`

---

## 📊 Test Coverage

### Current Coverage

| Component | Test Type | Status |
|-----------|-----------|--------|
| Environment Config | Automated | ✅ |
| Database Connection | Automated | ✅ |
| App Startup | Automated | ✅ |
| API Endpoints | Automated | ✅ |
| Home Page | Automated | ✅ |
| Manual UI Testing | Manual | 📋 Checklist |
| PDF Generation | Manual | 🚧 Future |

---

## 🚀 Adding New Tests

### Creating a New Test Script

```typescript
// scripts/test-something.ts
import { config } from 'dotenv';

config();

async function testSomething() {
  console.log('🧪 Testing something...');
  
  try {
    // Your test logic
    
    console.log('✅ Test passed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testSomething();
```

### Add to package.json

```json
{
  "scripts": {
    "test:something": "tsx scripts/test-something.ts"
  }
}
```

### Update Test Suite

Add to `npm run test` command:
```json
{
  "scripts": {
    "test": "npm run verify:env && npm run test:db && npm run test:app && npm run test:something"
  }
}
```

---

## 📚 Best Practices

### 1. Test Early, Test Often

```bash
# After every significant change
npm run test
```

### 2. Don't Skip Tests

```bash
# ❌ Bad
git commit -m "Fixed something"

# ✅ Good
npm run test && git commit -m "Fixed something"
```

### 3. Fix Tests First

If a test fails:
1. Don't commit broken code
2. Fix the issue
3. Verify fix with tests
4. Then commit

### 4. Keep Tests Fast

- Tests should run in < 30 seconds total
- Use mocks for slow external services
- Keep database tests minimal

### 5. Document New Tests

When adding tests:
- Update this TESTING.md
- Add comments in test files
- Update package.json scripts

---

## 🎯 Success Criteria

Before declaring work complete:

```bash
# 1. All automated tests pass
npm run test
# Output: All tests passed ✅

# 2. Manual verification
npm run dev
# App starts without errors ✅
# Homepage loads ✅
# Features work ✅

# 3. No warnings or errors
npm run lint
# Output: No issues found ✅

# 4. Database verified
npx prisma studio
# Can view data ✅
```

---

## 📞 Need Help?

If tests are failing:

1. Read error messages carefully
2. Check this troubleshooting section
3. Run individual tests to isolate issue
4. Verify environment configuration
5. Check recent changes

---

**Remember: Testing is not optional. It's how we ensure quality!** ✅