# Phase 3 Manual Testing Guide
# Quotation Creation Form

**Status:** Ready for Testing  
**Date:** January 22, 2025  
**Estimated Time:** 30-45 minutes  
**Prerequisites:** Dev server running, database seeded

---

## 🎯 Testing Objectives

Verify that the quotation creation form:
1. ✅ Renders correctly without errors
2. ✅ Validates user input properly
3. ✅ Calculates totals accurately
4. ✅ Saves data to database
5. ✅ Redirects to detail page on success
6. ✅ Handles errors gracefully

---

## 🚀 Setup

```bash
# 1. Ensure environment is set up
npm run verify:env

# 2. Verify database connection
npm run test:db

# 3. Start dev server
npm run dev

# 4. Open browser
open http://localhost:3000/quotation/new
```

---

## ✅ Test Cases

### Test 1: Page Load
**Objective:** Verify form renders correctly

**Steps:**
1. Navigate to http://localhost:3000/quotation/new
2. Observe page load

**Expected Results:**
- ✅ Page loads without errors
- ✅ Header shows "สร้างใบเสนอราคาใหม่ / Create New Quotation"
- ✅ Form sections visible:
  - Company selection
  - Customer information
  - Document information
  - Items section
  - Totals section
  - Notes section
- ✅ "Cancel" and "Save Quotation" buttons visible
- ✅ Default company pre-selected in dropdown
- ✅ One empty item row displayed
- ✅ VAT checkbox checked by default
- ✅ Issue date = today
- ✅ Valid until = today + 30 days

**Console Check:** No errors in browser console

---

### Test 2: Company Selection
**Objective:** Verify company dropdown works

**Steps:**
1. Click on company dropdown
2. Observe options
3. Select a different company

**Expected Results:**
- ✅ Dropdown opens with all companies
- ✅ Current selection highlighted
- ✅ Can change selection
- ✅ Selected company updates

---

### Test 3: Customer Information Validation
**Objective:** Verify required field validation

**Steps:**
1. Leave customer name blank
2. Leave customer address blank
3. Click "Save Quotation"

**Expected Results:**
- ✅ Form does NOT submit
- ✅ Error messages appear for required fields
- ✅ Fields highlighted in red
- ✅ Error banner appears at top

**Then:**
4. Fill in customer name: "บริษัท ทดสอบ จำกัด"
5. Fill in customer address: "123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110"
6. Observe errors clear

**Expected Results:**
- ✅ Red highlighting removed
- ✅ Error messages cleared
- ✅ Form ready to submit

---

### Test 4: Customer Optional Fields
**Objective:** Verify optional fields work

**Steps:**
1. Fill in Tax ID: "0123456789012"
2. Fill in Phone: "02-123-4567"

**Expected Results:**
- ✅ Fields accept input
- ✅ No validation errors
- ✅ Can be left empty without errors

---

### Test 5: Date Validation
**Objective:** Verify date logic works

**Steps:**
1. Set issue date to: 2025-01-22
2. Set valid until to: 2025-01-20 (before issue date)
3. Attempt to submit

**Expected Results:**
- ✅ Error message: "Valid until date must be after issue date"
- ✅ Form does not submit

**Then:**
4. Set valid until to: 2025-02-22 (after issue date)

**Expected Results:**
- ✅ Error clears
- ✅ Validation passes

---

### Test 6: Item Management - Add Item
**Objective:** Verify adding items works

**Steps:**
1. Click "เพิ่มรายการ" (Add Item) button
2. Observe new item row appears

**Expected Results:**
- ✅ New empty item row added
- ✅ Item numbered "รายการที่ 2"
- ✅ All fields empty and editable
- ✅ Delete button appears on all items

**Repeat:**
3. Add 2 more items (total 4 items)

**Expected Results:**
- ✅ All items numbered correctly (1, 2, 3, 4)
- ✅ Can add multiple items without issues

---

### Test 7: Item Management - Remove Item
**Objective:** Verify removing items works

**Steps:**
1. Click delete button (trash icon) on item 3
2. Observe item removed

**Expected Results:**
- ✅ Item 3 disappears
- ✅ Remaining items renumbered (1, 2, 3)
- ✅ Form still functional

**Edge Case:**
3. Remove items until only 1 remains
4. Try to delete the last item

**Expected Results:**
- ✅ Cannot delete (delete button disabled or hidden)
- ✅ Minimum 1 item always present

---

### Test 8: Item Data Entry
**Objective:** Verify item fields work correctly

**Steps:**
1. In Item 1, enter:
   - Description: "บริการออกแบบเว็บไซต์"
   - Quantity: 1
   - Unit: "โครงการ"
   - Price/Unit: 50000
2. Observe amount field

**Expected Results:**
- ✅ All fields accept input
- ✅ Amount auto-calculates: 50,000.00
- ✅ Amount field is disabled (read-only)

**Then:**
3. Change quantity to: 2
4. Observe amount updates

**Expected Results:**
- ✅ Amount updates to: 100,000.00
- ✅ Calculation happens immediately

**Then:**
5. Change price to: 60000
6. Observe amount updates

**Expected Results:**
- ✅ Amount updates to: 120,000.00
- ✅ Real-time calculation works

---

### Test 9: Sub-Items - Add
**Objective:** Verify sub-items functionality

**Steps:**
1. On Item 1, click "เพิ่มรายการย่อย" (Add Sub-item)
2. Observe sub-item section

**Expected Results:**
- ✅ "รายการย่อย (1)" appears with chevron icon
- ✅ Sub-item expanded automatically
- ✅ Sub-item form visible with fields:
  - Description
  - Quantity
  - Unit

**Then:**
3. Fill in sub-item:
   - Description: "หน้า Home"
   - Quantity: 1
   - Unit: "หน้า"

**Expected Results:**
- ✅ Fields accept input
- ✅ No errors

**Then:**
4. Add another sub-item:
   - Description: "หน้า About"
   - Quantity: 1
   - Unit: "หน้า"

**Expected Results:**
- ✅ Count updates to "รายการย่อย (2)"
- ✅ Both sub-items visible
- ✅ Numbered correctly

---

### Test 10: Sub-Items - Expand/Collapse
**Objective:** Verify expand/collapse works

**Steps:**
1. Click on "รายการย่อย (2)" header
2. Observe collapse
3. Click again
4. Observe expand

**Expected Results:**
- ✅ Chevron icon rotates (down/right)
- ✅ Sub-items hide when collapsed
- ✅ Sub-items show when expanded
- ✅ Data preserved during toggle

---

### Test 11: Sub-Items - Remove
**Objective:** Verify removing sub-items

**Steps:**
1. Click delete button on sub-item 1
2. Observe removal

**Expected Results:**
- ✅ Sub-item removed
- ✅ Count updates to "รายการย่อย (1)"
- ✅ Remaining sub-item still visible

**Then:**
3. Remove last sub-item

**Expected Results:**
- ✅ Sub-items section disappears
- ✅ Can still add new sub-items

---

### Test 12: Totals Calculation - Without VAT
**Objective:** Verify calculations work correctly

**Steps:**
1. Clear all items (delete extra items)
2. Set Item 1:
   - Quantity: 1
   - Price: 10000
3. Uncheck "รวมภาษีมูลค่าเพิ่ม 7%" checkbox
4. Observe totals

**Expected Results:**
- ✅ Subtotal: 10,000.00 บาท
- ✅ VAT section hidden (checkbox unchecked)
- ✅ Total: 10,000.00 บาท
- ✅ Thai Bahttext: "หนึ่งหมื่นบาทถ้วน"

---

### Test 13: Totals Calculation - With VAT
**Objective:** Verify VAT calculation

**Steps:**
1. Check "รวมภาษีมูลค่าเพิ่ม 7%" checkbox
2. Observe totals

**Expected Results:**
- ✅ Subtotal: 10,000.00 บาท
- ✅ VAT 7%: 700.00 บาท (visible)
- ✅ Total: 10,700.00 บาท
- ✅ Thai Bahttext: "หนึ่งหมื่นเจ็ดร้อยบาทถ้วน"

---

### Test 14: Totals Calculation - Multiple Items
**Objective:** Verify multiple items sum correctly

**Steps:**
1. Add 2 more items
2. Set items:
   - Item 1: Qty 1 × 10,000 = 10,000
   - Item 2: Qty 2 × 5,000 = 10,000
   - Item 3: Qty 1 × 3,500 = 3,500
3. VAT enabled
4. Observe totals

**Expected Results:**
- ✅ Subtotal: 23,500.00 บาท
- ✅ VAT 7%: 1,645.00 บาท
- ✅ Total: 25,145.00 บาท
- ✅ Thai Bahttext: "สองหมื่นห้าพันหนึ่งร้อยสี่สิบห้าบาทถ้วน"

---

### Test 15: Notes Field
**Objective:** Verify notes textarea works

**Steps:**
1. Click in notes field
2. Type: "กรุณาชำระภายใน 30 วัน\nPlease pay within 30 days"
3. Observe input

**Expected Results:**
- ✅ Multi-line text accepted
- ✅ Line breaks work
- ✅ No character limit errors

---

### Test 16: Form Submission - Success Path
**Objective:** Verify successful form submission

**Setup:**
Fill out complete form:
- Customer name: "บริษัท ลูกค้าทดสอบ จำกัด"
- Customer address: "456 ถนนพระราม 4 แขวงสีลม เขตบางรัก กรุงเทพฯ 10500"
- Tax ID: "0987654321098"
- Phone: "02-234-5678"
- Issue date: 2025-01-22
- Valid until: 2025-02-22
- Item 1:
  - Description: "บริการพัฒนาเว็บไซต์"
  - Quantity: 1
  - Unit: "โครงการ"
  - Price: 100000
- VAT: Enabled
- Notes: "ขอบคุณที่ใช้บริการ"

**Steps:**
1. Click "บันทึกใบเสนอราคา / Save Quotation" button
2. Observe loading state
3. Wait for redirect

**Expected Results:**
- ✅ Button shows loading spinner
- ✅ Button text changes to "กำลังบันทึก..."
- ✅ Button disabled during submission
- ✅ No console errors
- ✅ After 1-3 seconds, redirects to detail page
- ✅ URL changes to `/quotation/[new-id]`
- ✅ Detail page shows correct data:
  - Customer info matches
  - Items display correctly
  - Totals match (Subtotal: 100,000, VAT: 7,000, Total: 107,000)
  - Thai Bahttext correct
  - Notes displayed
  - Quotation number in format: QT-20250122-XXXX

---

### Test 17: Database Verification
**Objective:** Verify data saved correctly

**Steps:**
1. After successful creation, note the quotation ID from URL
2. Open database tool (Prisma Studio):
   ```bash
   npx prisma studio
   ```
3. Navigate to Quotations table
4. Find the newly created quotation
5. Check data

**Expected Results:**
- ✅ New record exists in database
- ✅ All fields populated correctly
- ✅ Timestamps (createdAt, updatedAt) set
- ✅ Items saved in QuotationItems table
- ✅ Sub-items saved with correct parentItemId
- ✅ Totals match calculations

---

### Test 18: Quotation Number Generation
**Objective:** Verify unique number generation

**Steps:**
1. Create another quotation (same day)
2. Observe quotation number

**Expected Results:**
- ✅ Number format: QT-YYYYMMDD-XXXX
- ✅ Date portion matches today
- ✅ Sequence incremented (e.g., 0001 → 0002)
- ✅ No duplicate numbers

---

### Test 19: Cancel Button
**Objective:** Verify cancel functionality

**Steps:**
1. Fill out part of the form
2. Click "ยกเลิก / Cancel" button

**Expected Results:**
- ✅ Navigates back to previous page
- ✅ Data not saved
- ✅ No errors

---

### Test 20: Form Validation - Missing Items
**Objective:** Verify item validation

**Steps:**
1. Fill customer info
2. Leave item description blank
3. Try to submit

**Expected Results:**
- ✅ Error message about missing description
- ✅ Form does not submit
- ✅ User notified of error

---

### Test 21: No Companies Scenario
**Objective:** Verify handling when no companies exist

**Steps:**
1. Delete all companies from database (via Prisma Studio)
2. Refresh `/quotation/new` page

**Expected Results:**
- ✅ Warning message displayed
- ✅ "ไม่พบข้อมูลบริษัท / No Companies Found"
- ✅ Link to company management shown
- ✅ Form not rendered
- ✅ No crash or errors

**Cleanup:**
3. Re-seed database:
   ```bash
   npm run prisma:seed
   ```

---

### Test 22: Browser Compatibility
**Objective:** Verify cross-browser support

**Browsers to Test:**
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if on Mac)

**For Each Browser:**
1. Load form
2. Fill out completely
3. Submit
4. Verify success

**Expected Results:**
- ✅ Form renders correctly in all browsers
- ✅ Date pickers work
- ✅ Calculations accurate
- ✅ Submission successful
- ✅ No visual glitches

---

### Test 23: Mobile Responsiveness
**Objective:** Verify mobile layout

**Steps:**
1. Open browser DevTools
2. Switch to mobile view (iPhone, Android)
3. Navigate to form
4. Test interactions

**Expected Results:**
- ✅ Form stacks vertically on mobile
- ✅ All fields accessible
- ✅ Buttons appropriately sized
- ✅ Touch targets large enough
- ✅ No horizontal scroll
- ✅ Text readable (not too small)

---

### Test 24: Accessibility
**Objective:** Verify form is accessible

**Steps:**
1. Tab through form using keyboard only
2. Use screen reader (if available)
3. Check contrast ratios

**Expected Results:**
- ✅ Can navigate entire form with Tab key
- ✅ Focus visible on all interactive elements
- ✅ Labels associated with inputs
- ✅ Error messages announced by screen reader
- ✅ Required fields indicated
- ✅ No keyboard traps

---

### Test 25: Performance
**Objective:** Verify form performance

**Steps:**
1. Open browser DevTools Performance tab
2. Reload form page
3. Interact with form (add 10 items)
4. Observe performance metrics

**Expected Results:**
- ✅ Page loads in < 2 seconds
- ✅ Form interactions feel snappy
- ✅ No lag when typing
- ✅ Calculations update smoothly
- ✅ Memory usage reasonable

---

## 🐛 Known Issues to Watch For

### ⚠️ Potential Issues:

1. **Postal Code Truncation (Future PDF Issue)**
   - Not a form issue, but note for Phase 4
   - Workaround: Add 2 trailing spaces to addresses

2. **Large Item Lists**
   - If user adds 50+ items, may become slow
   - Consider virtual scrolling in future

3. **Network Errors**
   - Test with network throttling
   - Verify error handling

---

## ✅ Testing Checklist

- [ ] Test 1: Page Load
- [ ] Test 2: Company Selection
- [ ] Test 3: Customer Validation
- [ ] Test 4: Optional Fields
- [ ] Test 5: Date Validation
- [ ] Test 6: Add Items
- [ ] Test 7: Remove Items
- [ ] Test 8: Item Calculations
- [ ] Test 9: Add Sub-items
- [ ] Test 10: Expand/Collapse
- [ ] Test 11: Remove Sub-items
- [ ] Test 12: Totals Without VAT
- [ ] Test 13: Totals With VAT
- [ ] Test 14: Multiple Items
- [ ] Test 15: Notes Field
- [ ] Test 16: Successful Submission
- [ ] Test 17: Database Verification
- [ ] Test 18: Number Generation
- [ ] Test 19: Cancel Button
- [ ] Test 20: Item Validation
- [ ] Test 21: No Companies
- [ ] Test 22: Browser Compatibility
- [ ] Test 23: Mobile Responsive
- [ ] Test 24: Accessibility
- [ ] Test 25: Performance

---

## 📊 Test Results

**Date Tested:** _______________  
**Tester:** _______________  
**Tests Passed:** _____ / 25  
**Tests Failed:** _____ / 25  
**Blockers Found:** _____

### Issues Found:

1. _______________________________________
2. _______________________________________
3. _______________________________________

---

## ✅ Sign-Off

Once all tests pass and issues are resolved:

- [ ] All 25 tests passed
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Database correctly updated
- [ ] Performance acceptable
- [ ] Mobile responsive
- [ ] Accessible

**Tested By:** _______________  
**Date:** _______________  
**Status:** ✅ APPROVED / ❌ NEEDS FIXES

---

## 🚀 Next Steps After Testing

1. **If All Pass:**
   - Mark Phase 3 as 100% complete
   - Update documentation
   - Start Phase 4 (PDF Generation)

2. **If Issues Found:**
   - Document all issues
   - Prioritize fixes (critical vs. nice-to-have)
   - Fix issues one by one
   - Re-test affected areas
   - Repeat until all pass

---

**Last Updated:** January 22, 2025  
**Version:** 1.0