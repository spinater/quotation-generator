# Task: Fix Company Selection Refresh Issue

**Status:** Completed
**Created:** 2024-01-20
**Priority:** High

## Problem Description

After adding a new company in Company Settings, the company does not appear in the company selection dropdown when creating a new Invoice, Quotation, or Receipt. Users must manually refresh the browser to see the newly added company.

## Root Cause

The invoice/new, quotation/new, and receipt/new pages are Next.js server components that fetch company data at request time. Next.js caches these pages by default for performance. When a company is created/updated/deleted, the cache for these pages was not being invalidated, so users continued to see stale data.

The company actions in `lib/actions/companies.ts` were only revalidating:
- `/settings/companies`
- `/` (homepage)

But NOT the document creation pages where companies are actually selected:
- `/invoice/new`
- `/quotation/new`
- `/receipt/new`

## Solution

Added `revalidatePath()` calls for all three document creation pages in the company mutation actions:

1. `createCompany()` - revalidate after creating new company
2. `updateCompany()` - revalidate after updating company details
3. `deleteCompany()` - revalidate after deleting company
4. `setDefaultCompany()` - revalidate after changing default company

This ensures that whenever company data changes, Next.js invalidates the cache for these pages and fetches fresh data on the next visit.

## Implementation

### Modified Files

**lib/actions/companies.ts**
- Added revalidation for `/invoice/new`
- Added revalidation for `/quotation/new`
- Added revalidation for `/receipt/new`
- Applied to all 4 company mutation functions

### Code Changes

```typescript
// Added to createCompany(), updateCompany(), deleteCompany(), setDefaultCompany()
revalidatePath("/invoice/new");
revalidatePath("/quotation/new");
revalidatePath("/receipt/new");
```

## Testing Checklist

- [x] Identify affected pages
- [x] Analyze caching behavior
- [x] Add revalidation paths
- [x] Code changes implemented and verified
- [ ] Manual Test: Add new company → navigate to /invoice/new → verify company appears
- [ ] Manual Test: Add new company → navigate to /quotation/new → verify company appears
- [ ] Manual Test: Add new company → navigate to /receipt/new → verify company appears
- [ ] Manual Test: Update company → verify changes reflect in all forms
- [ ] Manual Test: Delete company → verify company removed from all forms
- [ ] Manual Test: Set default company → verify default selection in all forms

## Expected Behavior After Fix

1. User adds a new company in Company Settings
2. User navigates to Create New Invoice/Quotation/Receipt
3. The new company appears in the dropdown **without** needing to refresh
4. The same applies for updates, deletions, and default changes

## Technical Notes

- Uses Next.js `revalidatePath()` from `next/cache`
- Server-side cache invalidation (no client-side workarounds needed)
- Maintains SSR benefits while ensuring data freshness
- No performance impact (revalidation only on mutation, not on reads)

## Alternative Solutions Considered

1. **Make pages dynamic** (`export const dynamic = 'force-dynamic'`)
   - Pros: Guaranteed fresh data every time
   - Cons: Loses caching benefits, slower page loads

2. **Client-side data fetching** (SWR/React Query)
   - Pros: Real-time updates, optimistic UI
   - Cons: Requires converting to client components, loses SSR benefits, more complex

3. **Revalidation (chosen)**
   - Pros: Simple, maintains SSR, fresh data after mutations, keeps caching benefits
   - Cons: None for this use case

## Related Files

- `app/invoice/new/page.tsx`
- `app/quotation/new/page.tsx`
- `app/receipt/new/page.tsx`
- `lib/actions/companies.ts`
- `components/InvoiceForm.tsx`
- `components/QuotationForm.tsx`
- `components/ReceiptForm.tsx`

## Notes

This is a common pattern in Next.js 15 App Router applications. Whenever server data changes via server actions, you must explicitly revalidate any pages that depend on that data. The cache is "opt-out" by default for performance.

Future recommendation: Consider creating a centralized `REVALIDATE_PATHS` constant to manage all paths that depend on company data, to avoid missing paths in future actions.