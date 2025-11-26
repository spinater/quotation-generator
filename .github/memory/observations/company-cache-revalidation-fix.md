# Observation: Company Data Cache Revalidation Pattern

**Date:** 2024-01-20
**Category:** Caching, Data Synchronization
**Severity:** High (User-facing bug)
**Status:** Resolved

## Problem

After adding a new company via Company Settings (`/settings/companies`), the newly created company did not appear in the company selection dropdowns on the document creation pages:
- `/invoice/new`
- `/quotation/new`
- `/receipt/new`

Users had to manually refresh their browser (hard reload) to see the new company in these dropdowns.

## Root Cause

### Next.js 15 App Router Caching Behavior

1. **Server Components Cache by Default**
   - The three document creation pages are server components
   - They fetch company data server-side using `prisma.company.findMany()` or `getCompanies()` action
   - Next.js caches server component renders for performance (Full Route Cache)

2. **Incomplete Cache Invalidation**
   - Company mutation actions (`createCompany`, `updateCompany`, `deleteCompany`, `setDefaultCompany`) were using `revalidatePath()`
   - BUT they were only invalidating:
     - `/settings/companies` (where companies are managed)
     - `/` (homepage)
   - They were NOT invalidating the pages that actually consume company data for document creation

3. **Result**
   - When a company was created, the settings page cache was cleared (so the list updated there)
   - When user navigated to `/invoice/new`, the cached server component was served
   - The cached component had the old company list from before the new company was added

## Solution

### Added Missing Revalidation Paths

Modified `lib/actions/companies.ts` to revalidate ALL pages that depend on company data:

```typescript
// In createCompany(), updateCompany(), deleteCompany(), setDefaultCompany()
revalidatePath("/settings/companies");  // Already existed
revalidatePath("/");                     // Already existed
revalidatePath("/invoice/new");          // ADDED
revalidatePath("/quotation/new");        // ADDED
revalidatePath("/receipt/new");          // ADDED
```

### Why This Works

- `revalidatePath()` tells Next.js: "This path's cached data is now stale"
- Next.js purges the Full Route Cache for these paths
- Next request to these paths triggers fresh server-side data fetch
- Users see updated company list without manual refresh

## Pattern: Cache Dependencies Graph

When using Server Components + Server Actions in Next.js 15, you must maintain a mental model of **which pages depend on which data**:

```
Company Data (Prisma/DB)
  ├── /settings/companies (CRUD UI)
  ├── /invoice/new (Read for dropdown)
  ├── /quotation/new (Read for dropdown)
  └── /receipt/new (Read for dropdown)
```

**Rule:** When data changes, revalidate ALL pages that read that data.

## Lessons Learned

### 1. Revalidation is Opt-In, Not Automatic

Unlike client-side state management (React Query, SWR) where cache invalidation can be automatic, Next.js server-side cache requires **explicit** revalidation.

### 2. Think in Terms of Data Dependencies

When writing server actions that mutate data, ask:
- "Which pages render this data?"
- "Which routes will become stale after this mutation?"
- Add `revalidatePath()` for each one

### 3. Centralize Revalidation Logic (Future Improvement)

Consider creating a revalidation helper:

```typescript
// lib/utils/revalidation.ts
const COMPANY_DEPENDENT_PATHS = [
  "/settings/companies",
  "/",
  "/invoice/new",
  "/quotation/new",
  "/receipt/new",
] as const;

export function revalidateCompanyPages() {
  COMPANY_DEPENDENT_PATHS.forEach(path => revalidatePath(path));
}
```

Then in actions:
```typescript
export async function createCompany(data: CompanyFormData) {
  // ... create logic ...
  revalidateCompanyPages();
  return { success: true, data: company };
}
```

**Benefits:**
- Single source of truth for dependencies
- Harder to forget paths
- Easier to maintain as app grows

### 4. Similar Pattern for Other Entities

This same pattern applies to other data entities:
- **Quotations:** Revalidate `/quotation`, `/quotation/[id]` after mutations
- **Receipts:** Revalidate `/receipt`, `/receipt/[id]` after mutations
- **Invoices:** Revalidate `/invoice`, `/invoice/[id]` after mutations

## Testing Verification

To verify the fix:

1. Navigate to `/settings/companies`
2. Create a new company (e.g., "Test Company ABC")
3. Navigate to `/invoice/new` (without refresh)
4. Open the company dropdown
5. **Expected:** "Test Company ABC" appears in the list
6. **Before fix:** Would NOT appear (needed manual refresh)

Repeat for `/quotation/new` and `/receipt/new`.

## Related Next.js Concepts

- **Full Route Cache:** Server-side cache of rendered Server Components
- **revalidatePath():** Purges cache for a specific route path
- **revalidateTag():** Alternative cache invalidation using tags
- **Dynamic Rendering:** Can disable caching with `export const dynamic = 'force-dynamic'`

## References

- Next.js Caching Docs: https://nextjs.org/docs/app/building-your-application/caching
- Server Actions: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
- Revalidation: https://nextjs.org/docs/app/api-reference/functions/revalidatePath

## Related Files

- `lib/actions/companies.ts` (Modified)
- `app/invoice/new/page.tsx` (Affected)
- `app/quotation/new/page.tsx` (Affected)
- `app/receipt/new/page.tsx` (Affected)

## Keywords

`Next.js`, `caching`, `revalidatePath`, `server-components`, `server-actions`, `stale-data`, `cache-invalidation`, `Full-Route-Cache`
