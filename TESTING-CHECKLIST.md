# Testing Checklist - MANDATORY Before Every Commit

**🚨 NEVER commit code without completing ALL steps below! 🚨**

---

## Step 1: Production Build Test (MOST CRITICAL)

```bash
npm run build
```

### ✅ Success Criteria:
- ✓ Compiled successfully
- ✓ Linting and checking validity of types
- ✓ Generating static pages
- ✓ Finalizing page optimization
- ✓ NO errors or warnings

### ❌ Common Failures & Fixes:

| Error | Fix |
|-------|-----|
| `Can't reach database server` | Add `export const dynamic = 'force-dynamic';` to page |
| `P1001` error | Database page missing dynamic export |
| TypeScript errors | Fix type mismatches immediately |
| Module not found | Check imports and run `npm install` |

**IF BUILD FAILS → STOP! Fix it before proceeding!**

---

## Step 2: Run All Tests

```bash
npm run test
```

### ✅ Success Criteria:
- ✓ Environment verification passes
- ✓ Database connection test passes
- ✓ All 42+ unit tests pass
- ✓ Page accessibility tests pass (if server running)

### Individual Test Commands (for debugging):
```bash
npm run verify:env   # Check environment variables
npm run test:db      # Test database connection
npm run test:all     # Run unit tests
npm run test:pages   # Test page accessibility (requires running server)
```

---

## Step 3: Clear Cache & Restart Dev Server

```bash
# Kill any existing dev server
lsof -ti:4000 | xargs kill -9

# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

### ✅ Success Criteria:
- ✓ Server starts on port 4000
- ✓ No compilation errors
- ✓ No console errors in terminal

---

## Step 4: Manual Browser Testing (MOST IMPORTANT!)

**🚨 YOU MUST PHYSICALLY CLICK BUTTONS AND VERIFY THEY WORK! 🚨**

### Open Browser:
```
http://localhost:4000
```

### Test Workflow:

1. **Navigate to the page you changed**
   - [ ] Page loads without errors
   - [ ] No 404 or 500 errors
   - [ ] Layout renders correctly

2. **Click the buttons/links you modified**
   - [ ] PDF Preview button opens PDF
   - [ ] Forms submit successfully
   - [ ] Links navigate correctly
   - [ ] Modals open/close properly

3. **Check browser console (F12 → Console)**
   - [ ] No red errors
   - [ ] No warnings about missing resources
   - [ ] No API errors

4. **Verify the output**
   - [ ] PDF displays Thai text correctly
   - [ ] Forms show success messages
   - [ ] Data saves to database
   - [ ] Numbers/dates format correctly

5. **Test edge cases**
   - [ ] Empty data
   - [ ] Long text (Thai & English)
   - [ ] Special characters
   - [ ] Large numbers

---

## Step 5: Specific Feature Tests

### For PDF Changes:
- [ ] Open PDF preview
- [ ] Check Thai fonts render (Sarabun, NotoSansThai)
- [ ] Verify postal codes don't truncate
- [ ] Check alignment and spacing
- [ ] Download and open PDF file
- [ ] Print PDF (if applicable)

### For Form Changes:
- [ ] Fill out form
- [ ] Submit form
- [ ] See success message
- [ ] Check database (Prisma Studio)
- [ ] Verify data persisted correctly

### For List Pages:
- [ ] Items display correctly
- [ ] Click items to view details
- [ ] Pagination works (if applicable)
- [ ] Search/filter works (if applicable)

### For API Changes:
- [ ] Test with curl or Postman
- [ ] Verify status codes
- [ ] Check response format
- [ ] Test error handling

---

## Step 6: Database Verification (if applicable)

```bash
npx prisma studio
```

- [ ] Open Prisma Studio
- [ ] Check data was saved correctly
- [ ] Verify relationships are correct
- [ ] Check no duplicate entries

---

## Step 7: Final Checks

- [ ] **Code compiles** (`npm run build`)
- [ ] **Tests pass** (`npm run test`)
- [ ] **Server runs** (`npm run dev`)
- [ ] **Pages load** (no 404/500)
- [ ] **Buttons work** (clicked and verified)
- [ ] **Console clean** (no errors in F12)
- [ ] **Feature works** (tested end-to-end)
- [ ] **Documentation updated** (if needed)

---

## Commit Checklist

**Before running `git commit`:**

- [ ] All 7 steps above completed ✅
- [ ] Build passed (`npm run build`)
- [ ] Tests passed (`npm run test`)
- [ ] Manually tested by clicking buttons
- [ ] No console errors
- [ ] Feature works as expected
- [ ] Documentation updated (if needed)
- [ ] Code reviewed (if applicable)

**Only AFTER all checks pass → Commit your code!**

---

## 🚨 ABSOLUTE RULES 🚨

1. **NEVER** skip `npm run build`
2. **NEVER** commit if build fails
3. **NEVER** assume it works without clicking buttons
4. **NEVER** skip manual browser testing
5. **ALWAYS** check browser console for errors
6. **ALWAYS** test the actual feature by using it
7. **ALWAYS** fix errors before declaring complete

---

## Common Mistakes to Avoid

❌ "It compiles so it must work" - **WRONG!**  
❌ "Tests pass so I'm done" - **WRONG!**  
❌ "I changed one line, no need to test" - **WRONG!**  
❌ "I'll let the user test it for me" - **WRONG!**  
❌ "The build succeeded, that's enough" - **WRONG!**

✅ "I ran build, tests, and clicked buttons to verify it works" - **CORRECT!**

---

## Testing Philosophy

**"If you didn't CLICK it, it doesn't work!"**  
**"If you didn't SEE it work, it doesn't work!"**  
**"If you can't show a video of it working, you didn't test it!"**

---

## Quick Test Commands

```bash
# Full testing workflow (run in order):
npm run build           # Build test (MUST pass first!)
npm run test            # All automated tests
lsof -ti:4000 | xargs kill -9 && rm -rf .next && npm run dev
# Open browser to http://localhost:4000 and CLICK BUTTONS!

# Individual tests:
npm run verify:env      # Environment check
npm run test:db         # Database connection
npm run test:all        # Unit tests only
npm run test:pages      # Page accessibility

# Database tools:
npx prisma studio       # Visual database editor
npx prisma migrate dev  # Run migrations
npx prisma generate     # Generate Prisma Client
```

---

**Remember: Untested code is broken code. Unclicked buttons are broken buttons.**

**Status: Follow this checklist religiously. No exceptions. No shortcuts.**