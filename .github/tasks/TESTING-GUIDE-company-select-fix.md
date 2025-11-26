# Testing Guide: Company Selection Refresh Fix

**Issue:** After adding a company, it doesn't appear in Create Invoice/Quotation/Receipt dropdowns
**Fix:** Added cache revalidation for document creation pages
**Status:** Ready for Testing

---

## What Was Changed

Modified `lib/actions/companies.ts` to revalidate the cache for document creation pages:
- `/invoice/new`
- `/quotation/new`
- `/receipt/new`

This ensures that when a company is created, updated, deleted, or set as default, these pages will fetch fresh data on the next visit.

---

## Manual Testing Steps

### Test 1: Create Company → Invoice Page

1. **Navigate to Company Settings**
   - Go to `/settings/companies`
   - Note the current list of companies

2. **Create a New Company**
   - Click "Add New Company" button
   - Fill in required fields:
     - Name: "Test Company Alpha"
     - Tax ID: "1234567890123"
     - Address: "123 Test Street, Bangkok 10110"
     - Phone: "02-123-4567"
   - Click "Save"
   - ✅ Company appears in the list

3. **Navigate to Create Invoice**
   - Go to `/invoice/new` (without refreshing browser)
   - Open the "Company" dropdown

4. **Expected Result**
   - ✅ "Test Company Alpha" appears in the dropdown
   - ✅ Can select it successfully
   - ✅ Company details display below dropdown

---

### Test 2: Create Company → Quotation Page

1. **Create Another Company**
   - In `/settings/companies`, add:
     - Name: "Test Company Beta"
     - Tax ID: "9876543210987"
     - Address: "456 Demo Road, Bangkok 10120"
     - Phone: "02-765-4321"

2. **Navigate to Create Quotation**
   - Go to `/quotation/new` (without refreshing)
   - Open company dropdown

3. **Expected Result**
   - ✅ Both "Test Company Alpha" and "Test Company Beta" appear
   - ✅ Can select either one

---

### Test 3: Create Company → Receipt Page

1. **Create Third Company**
   - In `/settings/companies`, add:
     - Name: "Test Company Gamma"
     - Tax ID: "5555555555555"
     - Address: "789 Sample Ave, Bangkok 10130"
     - Phone: "02-555-5555"
     - Check "Set as Default"

2. **Navigate to Create Receipt**
   - Go to `/receipt/new` (without refreshing)
   - Check company dropdown

3. **Expected Result**
   - ✅ All three test companies appear
   - ✅ "Test Company Gamma" is pre-selected (as default)

---

### Test 4: Update Company

1. **Edit an Existing Company**
   - In `/settings/companies`, edit "Test Company Alpha"
   - Change name to: "Updated Alpha Corporation"
   - Save changes

2. **Check All Document Pages**
   - Visit `/invoice/new` (without refresh)
   - Visit `/quotation/new` (without refresh)
   - Visit `/receipt/new` (without refresh)

3. **Expected Result**
   - ✅ Updated name "Updated Alpha Corporation" appears in all dropdowns
   - ✅ Old name "Test Company Alpha" no longer appears

---

### Test 5: Delete Company

1. **Delete a Company**
   - In `/settings/companies`, delete "Test Company Beta"
   - Confirm deletion

2. **Check All Document Pages**
   - Visit `/invoice/new` (without refresh)
   - Visit `/quotation/new` (without refresh)
   - Visit `/receipt/new` (without refresh)

3. **Expected Result**
   - ✅ "Test Company Beta" no longer appears in any dropdown
   - ✅ Other companies still appear

---

### Test 6: Change Default Company

1. **Set Different Default**
   - In `/settings/companies`, set "Updated Alpha Corporation" as default
   - (Removes default from "Test Company Gamma")

2. **Navigate to Document Pages**
   - Visit `/invoice/new` (without refresh)
   - Visit `/quotation/new` (without refresh)
   - Visit `/receipt/new` (without refresh)

3. **Expected Result**
   - ✅ "Updated Alpha Corporation" is pre-selected in all forms
   - ✅ "Test Company Gamma" is still in dropdown but not pre-selected

---

## Before vs After Fix

### BEFORE (Broken Behavior)
❌ Add company → navigate to /invoice/new → company NOT in dropdown
❌ Must manually refresh browser (F5) to see new company
❌ Poor user experience, confusing behavior

### AFTER (Fixed Behavior)
✅ Add company → navigate to /invoice/new → company APPEARS in dropdown
✅ No manual refresh needed
✅ Seamless user experience

---

## Technical Details

### Root Cause
- Next.js 15 caches server components by default (Full Route Cache)
- Document creation pages fetch company data server-side
- Cache was not invalidated when company data changed
- Users saw stale/cached company list

### Solution
- Added `revalidatePath()` calls in company mutation actions
- Invalidates cache for `/invoice/new`, `/quotation/new`, `/receipt/new`
- Next request fetches fresh data from database
- No client-side workarounds needed

### Modified File
- `lib/actions/companies.ts`
  - `createCompany()` - added 3 revalidation paths
  - `updateCompany()` - added 3 revalidation paths
  - `deleteCompany()` - added 3 revalidation paths
  - `setDefaultCompany()` - added 3 revalidation paths

---

## Cleanup After Testing

After completing tests, you can delete the test companies:
1. Go to `/settings/companies`
2. Delete:
   - "Updated Alpha Corporation" (was Test Company Alpha)
   - "Test Company Gamma"
3. Keep your original real companies

---

## If Issues Persist

If companies still don't appear after this fix:

1. **Hard Refresh Browser**
   - Press `Ctrl+Shift+R` (Windows/Linux)
   - Press `Cmd+Shift+R` (Mac)

2. **Check Dev Server**
   - Ensure dev server restarted after code changes
   - `npm run dev` should reflect latest code

3. **Check Database**
   - Verify company was actually created: `npx prisma studio`
   - Check `Company` table has the new entries

4. **Check Console**
   - Open browser DevTools (F12)
   - Check for JavaScript/API errors
   - Check Network tab for failed requests

5. **Verify Code Changes**
   - Ensure `lib/actions/companies.ts` has the revalidation paths
   - Check all 4 functions have the 3 new `revalidatePath()` calls

---

## Success Criteria

✅ All 6 test scenarios pass
✅ No browser refresh needed to see changes
✅ Works consistently across all three document types
✅ Updates, deletes, and default changes also reflected immediately

---

## Report Issues

If you encounter any problems during testing:
1. Note which test step failed
2. Check browser console for errors
3. Verify database state in Prisma Studio
4. Check dev server logs for server errors
5. Report findings with specific details

**Testing Date:** _____________
**Tested By:** _____________
**Result:** ☐ Pass  ☐ Fail  ☐ Partial
**Notes:** _________________________________________________