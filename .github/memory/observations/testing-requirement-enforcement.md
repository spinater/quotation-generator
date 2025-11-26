# Observation: Testing Requirement Enforcement & 500 Error Incident

**Date:** 2024-01-20
**Category:** Testing, Quality Assurance, Development Process
**Severity:** Critical
**Status:** Resolved & Enforced

## Incident Summary

After implementing cache revalidation fixes for company data, the user reported a 404 error when clicking "สร้างใบแจ้งหนี้" (Create Invoice). Upon investigation, the actual issue was **500 Internal Server Errors** on multiple pages due to stale webpack cache after code changes.

## Timeline

1. **Initial Report:** User reported 404 error on invoice creation
2. **First Investigation:** Checked routes, all existed and appeared correct
3. **Curl Test:** Direct HTTP requests showed 200 OK status
4. **Comprehensive Testing:** Created test script, discovered 500 errors on `/` and `/invoice/new`
5. **Root Cause:** Webpack module error: "Cannot find module './586.js'"
6. **Solution:** Clear `.next` cache and restart dev server
7. **Prevention:** Strengthened testing requirements in copilot-instructions.md

## Root Cause Analysis

### Primary Cause: Stale Webpack Cache

**Error Message:**
```
Error: Cannot find module './586.js'
Require stack:
- .next/server/webpack-runtime.js
- .next/server/app/settings/companies/page.js
```

**Why It Happened:**
1. Code changes were made to `lib/actions/companies.ts`
2. Dev server was running during changes
3. Next.js webpack cache (`.next/` folder) became stale
4. Webpack couldn't resolve module references correctly
5. Pages returned 500 errors instead of rendering

### Contributing Factors

1. **No Post-Change Testing:** Changes were deployed without testing
2. **Dev Server Not Restarted:** Code changes require server restart
3. **Cache Not Cleared:** Stale webpack cache persisted
4. **Insufficient Test Coverage:** No automated page accessibility tests

## The Discrepancy: 200 vs 500

### Why Direct curl Showed 200 Earlier

During initial investigation, `curl http://localhost:4000/invoice/new` returned 200 OK. Later, comprehensive testing revealed 500 errors. This happened because:

1. **Timing:** Between tests, more code was served/cached
2. **Webpack Hot Reload:** Some modules reloaded successfully, others didn't
3. **Intermittent Failure:** Cache corruption affected some requests but not others
4. **Page Dependencies:** Homepage had more dependencies than invoice page

**Lesson:** A single successful curl doesn't guarantee the page works. Need comprehensive testing.

## Detection: Why Automated Tests Didn't Catch It

The existing test suite had a gap:

### Tests That Existed (and Passed)
- ✅ Environment variable validation
- ✅ Database connection tests
- ✅ Unit tests (42 tests for utilities)
- ❌ **Missing:** Page accessibility tests

### What Was Missing
- No tests to verify pages return 200 OK
- No tests for server-side rendering errors
- No cache validation tests
- No end-to-end navigation tests

## Solution Implemented

### 1. Created Page Accessibility Test

**File:** `scripts/test-pages.ts`

Tests all key pages return HTTP 200:
- Homepage (/)
- Invoice list & creation
- Quotation list & creation
- Receipt list & creation
- Company settings

**Usage:** `npm run test:pages`

### 2. Updated Test Suite

Modified `package.json`:
```json
{
  "test:pages": "tsx scripts/test-pages.ts",
  "test": "npm run verify:env && npm run test:db && npm run test:all && npm run test:pages"
}
```

Now `npm run test` includes page accessibility checks.

### 3. Strengthened Copilot Instructions

Updated `.github/copilot-instructions.md` with:

**CRITICAL RULES:**
1. 🚨 MANDATORY: Test before declaring work complete
2. NO EXCEPTIONS to testing requirements
3. ALWAYS clear cache after code changes: `rm -rf .next`
4. ALWAYS restart dev server: `lsof -ti:4000 | xargs kill -9`
5. ALWAYS run full test suite: `npm run test`
6. NEVER skip manual verification

**Complete Testing Workflow:**
```bash
# 1. Automated tests
npm run test

# 2. Clear cache & restart
lsof -ti:4000 | xargs kill -9
rm -rf .next
npm run dev

# 3. Manual verification
# - Browser testing
# - Console error checking
# - Feature-specific testing
```

### 4. Common Failures Documentation

Added troubleshooting table:
| Error | Cause | Solution |
|-------|-------|----------|
| Port in use | Dev server running | `lsof -ti:4000 \| xargs kill -9` |
| 500 errors | Stale webpack cache | `rm -rf .next && npm run dev` |
| Module not found | Import/dependency issue | Check imports, `npm install` |

## Testing Best Practices Established

### 1. Multi-Layer Testing

**Layer 1: Automated Unit Tests**
- Test utilities and business logic
- 42+ tests for bahttext, PDF validation, etc.
- Run: `npm run test:all`

**Layer 2: Integration Tests**
- Database connection
- Environment configuration
- Run: `npm run test:db` and `npm run verify:env`

**Layer 3: Page Accessibility Tests** (NEW)
- HTTP status codes for all pages
- Response time monitoring
- Run: `npm run test:pages`

**Layer 4: Manual Verification**
- Browser testing
- Console error checking
- User flow testing

### 2. Development Workflow

```
Code Change
    ↓
Clear Cache (rm -rf .next)
    ↓
Restart Server
    ↓
Run Automated Tests (npm run test)
    ↓
Manual Verification (browser)
    ↓
Commit & Document
```

### 3. Never Trust Single Tests

- One successful curl ≠ working page
- Test all pages, not just one
- Test at different times (cache can corrupt gradually)
- Test after every code change

## Lessons Learned

### 1. Cache Management is Critical

Next.js webpack cache (`.next/` folder) must be cleared:
- After server-side code changes
- After dependency updates
- When seeing unexplained errors
- As part of testing workflow

### 2. Testing Must Be Enforced

**Before:**
- Testing was "recommended"
- Developers could skip tests
- No automated page checks

**After:**
- Testing is MANDATORY
- Strong language in instructions (🚨, NEVER, ALWAYS)
- Automated enforcement via test suite
- Clear consequences documented

### 3. 500 Errors vs 404 Errors

**User reported:** "404 error"
**Actual issue:** 500 Internal Server Error

Why the confusion?
- Both result in broken pages
- User may not check browser network tab
- Both show error in browser

**Always verify exact error:**
- Check browser network tab (F12)
- Check HTTP status code
- Check server logs
- Don't assume error type

### 4. Test Early, Test Often

Catching issues:
- **At coding time:** TypeScript/ESLint
- **Before commit:** `npm run test`
- **After commit:** CI/CD pipeline (future)
- **Before deployment:** Full QA cycle

### 5. Documentation Must Be Actionable

**Bad documentation:**
- "Test your code"
- "Make sure it works"

**Good documentation:**
- Exact commands: `npm run test`
- Step-by-step workflow
- Common failure solutions
- Clear, strong language

## Impact

### Immediate
- ✅ Issue resolved (clear cache, restart server)
- ✅ Page accessibility tests created
- ✅ Testing workflow documented
- ✅ Copilot instructions strengthened

### Long-term
- 📈 Improved code quality
- 📉 Fewer production issues
- ⚡ Faster issue detection
- 🎯 Clear testing standards

### Metrics to Track
- Test suite execution time
- Test pass rate
- Number of 500 errors in production
- Time to detect issues

## Prevention Checklist

Before declaring ANY work complete:

- [ ] Run `npm run test` (full suite)
- [ ] Clear Next.js cache (`rm -rf .next`)
- [ ] Restart dev server
- [ ] Test changed pages in browser
- [ ] Check browser console for errors
- [ ] Test navigation between pages
- [ ] Verify database operations (if applicable)
- [ ] Update documentation
- [ ] Commit with descriptive message

## Related Files

- `.github/copilot-instructions.md` (updated)
- `scripts/test-pages.ts` (created)
- `package.json` (updated with test:pages)
- `lib/actions/companies.ts` (original change that triggered issue)

## Future Improvements

### Short-term
1. Add browser-based E2E tests (Playwright/Cypress)
2. Add API endpoint tests
3. Add form submission tests
4. Monitor test execution time

### Medium-term
1. Set up CI/CD pipeline
2. Automated testing on pull requests
3. Pre-commit hooks for tests
4. Test coverage reporting

### Long-term
1. Comprehensive E2E test suite
2. Performance benchmarking
3. Load testing
4. Visual regression testing

## Key Takeaway

**Untested code is broken code.**

No matter how confident you are in your changes, no matter how small the change seems, ALWAYS test. Cache issues, dependency conflicts, and unexpected side effects can break code in ways that aren't obvious during development.

The cost of testing is ALWAYS less than the cost of debugging production issues.

## References

- Next.js Caching: https://nextjs.org/docs/app/building-your-application/caching
- Webpack Module Resolution: https://webpack.js.org/concepts/module-resolution/
- Testing Best Practices: https://testingjavascript.com/

## Keywords

`testing`, `quality-assurance`, `webpack`, `cache`, `500-error`, `next.js`, `development-workflow`, `best-practices`, `mandatory-testing`, `ci-cd`
