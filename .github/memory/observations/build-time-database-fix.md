# Build-Time Database Connection Fix

**Date:** 2024
**Status:** ✅ RESOLVED
**Priority:** CRITICAL

---

## Problem Description

### Error Encountered

```
Error [PrismaClientKnownRequestError]:
Invalid `prisma.invoice.findMany()` invocation:

Can't reach database server at `45.136.237.124:55320`

Please make sure your database server is running at `45.136.237.124:55320`.
```

**When it occurred:** During `npm run build` when Next.js tried to pre-render pages with database queries.

**Impact:** Build process failed completely, preventing deployment and production builds.

---

## Root Cause

### Next.js Static Generation Behavior

By default, Next.js 15 with App Router tries to **statically generate pages at build time** when possible. This includes:

1. **Server Components** that fetch data
2. Pages without dynamic parameters
3. Pages that don't explicitly opt out of static generation

### The Problem

When Next.js attempts to statically generate pages during `npm run build`:

1. It runs the page component's async function
2. The component calls `prisma.model.findMany()`
3. Prisma tries to connect to the database
4. **Database is not accessible during build time** (common in CI/CD, different environments)
5. Build fails with P1001 error

### Affected Pages

All pages that perform database queries in the component function:

- `/invoice` - `prisma.invoice.findMany()`
- `/quotation` - `prisma.quotation.findMany()`
- `/receipt` - `prisma.receipt.findMany()`
- `/settings/companies` - `getCompanies()` (which calls Prisma)
- `/invoice/[id]` - `prisma.invoice.findUnique()`
- `/quotation/[id]` - `prisma.quotation.findUnique()`
- `/receipt/[id]` - `prisma.receipt.findUnique()`

---

## Solution

### The Fix: Force Dynamic Rendering

Add `export const dynamic = 'force-dynamic';` to all pages that perform database queries.

```typescript
// Force dynamic rendering to skip build-time database access
export const dynamic = 'force-dynamic';

export default async function MyPage() {
  const data = await prisma.model.findMany();
  // ...
}
```

### What This Does

1. **Tells Next.js:** "Don't try to pre-render this page at build time"
2. **Ensures:** Page is rendered on-demand at request time (SSR)
3. **Result:** Database queries only execute when users actually visit the page
4. **Benefit:** Build succeeds without needing database access

### Files Modified

1. ✅ `app/invoice/page.tsx` - Added dynamic export
2. ✅ `app/quotation/page.tsx` - Added dynamic export
3. ✅ `app/receipt/page.tsx` - Added dynamic export
4. ✅ `app/settings/companies/page.tsx` - Added dynamic export
5. ✅ `app/invoice/[id]/page.tsx` - Added dynamic export
6. ✅ `app/quotation/[id]/page.tsx` - Added dynamic export
7. ✅ `app/receipt/[id]/page.tsx` - Added dynamic export

---

## Verification

### Before Fix

```bash
$ npm run build

# ❌ FAILED
Error [PrismaClientKnownRequestError]:
Invalid `prisma.invoice.findMany()` invocation:
Can't reach database server at `45.136.237.124:55320`
```

### After Fix

```bash
$ npm run build

# ✅ SUCCESS
✓ Compiled successfully in 2.4s
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (15/15)
✓ Collecting build traces
✓ Finalizing page optimization

Route (app)                                 Size  First Load JS
├ ○ /                                      173 B         106 kB
├ ƒ /invoice                               173 B         106 kB  ← Now dynamic (ƒ)
├ ƒ /quotation                             173 B         106 kB  ← Now dynamic (ƒ)
├ ƒ /receipt                               173 B         106 kB  ← Now dynamic (ƒ)
└ ƒ /settings/companies                  17.5 kB         119 kB  ← Now dynamic (ƒ)

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand  ← Our database pages
```

---

## Best Practices Going Forward

### 1. Always Test Build Before Commit

```bash
# MANDATORY workflow:
npm run build    # Must pass first!
npm run test     # Must pass!
npm run dev      # Then test manually
```

### 2. Add Dynamic Export to Database Pages

**Any page that uses Prisma MUST have:**

```typescript
export const dynamic = 'force-dynamic';
```

### 3. Recognize Build-Time Errors

Common error patterns that indicate missing `dynamic` export:

- ❌ `Can't reach database server`
- ❌ `Invalid prisma.*.find*() invocation`
- ❌ `P1001` error code
- ❌ Build fails during "Collecting page data"

**Fix:** Add `export const dynamic = 'force-dynamic';` to the failing page.

### 4. When to Use Dynamic Export

Use `export const dynamic = 'force-dynamic';` when your page:

- ✅ Fetches data from database (Prisma)
- ✅ Uses server actions that query database
- ✅ Needs fresh data on every request
- ✅ Has user-specific content
- ✅ Requires authentication/session data

Don't need it for:

- ❌ Purely static pages (marketing, about, etc.)
- ❌ Client-side only pages
- ❌ Pages that use API routes (not direct DB queries)

---

## Alternative Solutions Considered

### Option 1: Mock Database During Build
- **Pros:** Pages could still be static
- **Cons:** Complex setup, may hide real issues, test data in build
- **Decision:** ❌ Rejected - Too complex

### Option 2: Separate Build Environment with DB
- **Pros:** Build can access database
- **Cons:** Requires DB in CI/CD, slower builds, connection management
- **Decision:** ❌ Rejected - Unnecessary complexity

### Option 3: Use Static Generation with `generateStaticParams`
- **Pros:** Pages are statically generated
- **Cons:** Requires knowing all possible data at build time, doesn't work for dynamic data
- **Decision:** ❌ Rejected - Our data is dynamic

### Option 4: Force Dynamic Rendering (CHOSEN ✅)
- **Pros:** Simple, explicit, no database needed at build time, works immediately
- **Cons:** Pages are SSR instead of static (but that's actually better for dynamic data)
- **Decision:** ✅ SELECTED - Best fit for our use case

---

## Related Documentation

- **Copilot Instructions:** `.github/copilot-instructions.md` - Updated with build test requirements
- **Next.js Docs:** https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
- **Prisma Docs:** https://www.prisma.io/docs/concepts/components/prisma-client

---

## Lessons Learned

1. **Always run `npm run build` before committing** - It catches issues dev mode doesn't
2. **Database pages should be dynamic** - Static generation doesn't make sense for database-driven content
3. **Build-time vs Runtime** - Understand when your code runs (build vs request)
4. **Next.js defaults** - Know when to override Next.js's smart defaults
5. **CI/CD considerations** - Build environment may not have database access

---

## Testing Checklist

When adding new pages with database queries:

- [ ] Add `export const dynamic = 'force-dynamic';` to the page
- [ ] Run `npm run build` and verify it passes
- [ ] Check build output shows `ƒ (Dynamic)` for your page
- [ ] Test the page loads correctly in dev mode
- [ ] Test the page loads correctly in production build (`npm run start`)
- [ ] Document in copilot instructions if needed

---

**Status:** ✅ Issue resolved, documentation updated, build passing, lesson learned!