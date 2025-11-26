# Testing Guide - Thai Quotation & Receipt Generator

**⚠️ CRITICAL: Always test your changes before using the application!**

This guide explains how to run tests and verify that the application is working correctly.

---

## Quick Start: Run All Tests

```bash
npm run test
```

This runs the complete test suite:
1. ✅ Environment variable validation
2. ✅ Database connection test
3. ✅ Unit tests (42+ tests)
4. ✅ Page accessibility tests

**If all tests pass, your application is ready to use!**

---

## Individual Test Commands

### 1. Environment Configuration Test
```bash
npm run verify:env
```

**What it checks:**
- DATABASE_URL is properly formatted
- All required environment variables exist
- Database connection string is valid

**Expected output:**
```
✅ All checks passed! Your .env is properly configured.
```

---

### 2. Database Connection Test
```bash
npm run test:db
```

**What it checks:**
- Can connect to PostgreSQL database
- Required tables exist (8 tables)
- Database schema is correct
- Sample data is present

**Expected output:**
```
✅ Database Connection Test: SUCCESS
```

---

### 3. Unit Tests
```bash
npm run test:all
```

**What it tests:**
- Bahttext conversion (Thai number-to-words)
- PDF data validation
- Filename generation
- Address formatting
- Date and currency formatting
- Integration tests

**Expected output:**
```
✅ Passed: 42
❌ Failed: 0
```

---

### 4. Page Accessibility Test
```bash
npm run test:pages
```

**What it tests:**
- Homepage loads (/)
- Invoice list & creation pages
- Quotation list & creation pages
- Receipt list & creation pages
- Company settings page

**Expected output:**
```
✅ Passed: 8/8
All pages are accessible!
```

---

## Common Issues & Solutions

### Issue 1: Port Already in Use

**Error:**
```
Error: Could not find available port
```

**Solution:**
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Restart dev server
npm run dev
```

---

### Issue 2: 500 Internal Server Error

**Symptoms:**
- Pages show error in browser
- Tests fail with status 500

**Solution:**
```bash
# Stop dev server
lsof -ti:4000 | xargs kill -9

# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

**Why this happens:**
- Next.js webpack cache becomes stale after code changes
- Always clear cache after updating dependencies or code

---

### Issue 3: Module Not Found

**Error:**
```
Cannot find module './xyz.js'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# Clear cache
rm -rf .next

# Restart
npm run dev
```

---

### Issue 4: Database Connection Failed

**Error:**
```
❌ Database connection failed
```

**Solutions:**

1. **Check database is running:**
   ```bash
   # Verify DATABASE_URL in .env
   cat .env | grep DATABASE_URL
   ```

2. **Check Prisma Client:**
   ```bash
   # Regenerate Prisma Client
   npx prisma generate
   ```

3. **Check migrations:**
   ```bash
   # Apply pending migrations
   npx prisma migrate dev
   ```

---

## Development Workflow with Testing

### When Making Code Changes

```bash
# 1. Make your code changes
# ... edit files ...

# 2. Stop dev server
lsof -ti:4000 | xargs kill -9

# 3. Clear cache
rm -rf .next

# 4. Run tests
npm run test

# 5. If tests pass, restart server
npm run dev

# 6. Manual verification in browser
# - Visit http://localhost:4000
# - Test your changes
# - Check browser console (F12) for errors
```

---

## Manual Testing Checklist

After automated tests pass, verify manually:

### Homepage (/)
- [ ] Page loads without errors
- [ ] Three cards visible (Quotation, Invoice, Receipt)
- [ ] Recent documents display (if any exist)
- [ ] Navigation links work

### Create Documents
- [ ] `/quotation/new` - Form loads, company dropdown populated
- [ ] `/invoice/new` - Form loads, company dropdown populated
- [ ] `/receipt/new` - Form loads, company dropdown populated
- [ ] Can add/remove items
- [ ] Calculations work correctly
- [ ] Can submit form

### List Pages
- [ ] `/quotation` - Lists all quotations
- [ ] `/invoice` - Lists all invoices
- [ ] `/receipt` - Lists all receipts
- [ ] Can click to view details

### Settings
- [ ] `/settings/companies` - Company management works
- [ ] Can add new company
- [ ] Can edit existing company
- [ ] Can set default company
- [ ] Can delete company (if no documents)

### Browser Console
- [ ] No JavaScript errors (F12 → Console)
- [ ] No 404 errors (F12 → Network)
- [ ] No failed API requests

---

## Testing After Specific Changes

### After Updating Dependencies
```bash
npm install
rm -rf .next
npx prisma generate
npm run test
npm run dev
```

### After Database Schema Changes
```bash
npx prisma migrate dev --name your_migration_name
npx prisma generate
npm run test:db
npm run dev
```

### After Environment Variable Changes
```bash
npm run verify:env
npm run test:db
npm run dev
```

### After Adding New Pages
```bash
# Update test-pages.ts to include new page
# Then run:
npm run test:pages
```

---

## Continuous Testing

### Pre-Commit Checklist
Before committing code:
- [ ] `npm run test` passes
- [ ] Cache cleared and server restarted
- [ ] Manual verification completed
- [ ] Browser console clean (no errors)

### Pre-Deployment Checklist
Before deploying to production:
- [ ] All tests pass in clean environment
- [ ] Fresh `npm install` succeeds
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Manual smoke test on staging
- [ ] Performance acceptable
- [ ] No console errors

---

## Troubleshooting Test Failures

### Test: verify:env
**If fails:** Check `.env` file exists and has all required variables

### Test: test:db
**If fails:** 
- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Run `npx prisma migrate dev`

### Test: test:all
**If fails:**
- Check for TypeScript errors: `npx tsc --noEmit`
- Review test output for specific failures
- Fix code, rerun tests

### Test: test:pages
**If fails:**
- Ensure dev server is running: `npm run dev`
- Check specific failed pages
- Review server logs for errors
- Clear cache: `rm -rf .next`

---

## Test Performance

Expected test execution times (approximate):

| Test Suite | Time | Notes |
|------------|------|-------|
| verify:env | < 1s | Very fast |
| test:db | 2-5s | Network dependent |
| test:all | 1-2s | 42+ unit tests |
| test:pages | 3-5s | Tests 8 pages |
| **Total** | **7-13s** | Full suite |

If tests take significantly longer:
- Check network connection (database)
- Check CPU load
- Consider upgrading hardware

---

## CI/CD Integration (Future)

Once CI/CD is set up, tests will run automatically:

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: |
    npm install
    npm run test
```

---

## Getting Help

If tests fail and you can't resolve:

1. **Check this guide** for common solutions
2. **Check server logs** for detailed errors
3. **Clear all caches:**
   ```bash
   rm -rf .next node_modules
   npm install
   npm run test
   ```
4. **Review recent changes** - what was modified?
5. **Check GitHub issues** for similar problems

---

## Best Practices

1. ✅ **Test before every commit**
2. ✅ **Clear cache after code changes**
3. ✅ **Restart server after server-side changes**
4. ✅ **Run full test suite, not just one test**
5. ✅ **Verify manually in browser**
6. ✅ **Check browser console for errors**
7. ❌ **Never skip tests** "just this once"
8. ❌ **Never commit failing tests**
9. ❌ **Never assume it works without testing**

---

## Summary

```bash
# The one command you need to remember:
npm run test

# If that passes, you're good to go!
# If not, check this guide for solutions.
```

**Remember: Untested code is broken code. Always test!**

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run test` | Run all tests |
| `npm run verify:env` | Check environment |
| `npm run test:db` | Test database |
| `npm run test:all` | Run unit tests |
| `npm run test:pages` | Test page accessibility |
| `npm run dev` | Start dev server |
| `rm -rf .next` | Clear Next.js cache |
| `lsof -ti:4000 \| xargs kill -9` | Kill process on port 4000 |
| `npx prisma studio` | Open database GUI |
| `npx prisma generate` | Regenerate Prisma client |

---

**Last Updated:** 2024-01-20
**Application Version:** 2.0.0