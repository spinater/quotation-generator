# Task: Full CRUD Implementation for All Document Types

**Status:** In Progress
**Created:** 2024-01-20
**Priority:** Critical
**Requested By:** User

---

## Problem Statement

The user reports that Quotation Details, Invoice Details, and Receipt Details pages cannot:
1. ❌ Edit documents
2. ❌ Download PDF
3. ❌ Delete documents

Currently, these pages only have placeholder buttons that don't work.

---

## Current State Analysis

### What Exists ✅

**Quotations:**
- ✅ List page (`/quotation`)
- ✅ Create page (`/quotation/new`)
- ✅ Detail page (`/quotation/[id]/page.tsx`)
- ✅ PDF component (`components/pdf/QuotationPDF.tsx`)
- ✅ PDF Actions component (`components/QuotationPDFActions.tsx`)
- ❌ Edit page (missing)
- ❌ Delete functionality (missing)

**Invoices:**
- ✅ List page (`/invoice`)
- ✅ Create page (`/invoice/new`)
- ✅ Detail page (`/invoice/[id]/page.tsx`) - just created
- ❌ PDF component (missing)
- ❌ PDF Actions component (missing)
- ❌ Edit page (missing)
- ❌ Delete functionality (missing)

**Receipts:**
- ✅ List page (`/receipt`)
- ✅ Create page (`/receipt/new`)
- ✅ Detail page (`/receipt/[id]`)
- ❌ PDF component (missing)
- ❌ PDF Actions component (missing)
- ❌ Edit page (missing)
- ❌ Delete functionality (missing)

### What's Been Created (This Session) ✅

1. ✅ `components/DocumentActions.tsx` - Reusable Edit/Delete buttons
2. ✅ `components/QuotationDetailActions.tsx` - Wrapper for quotation actions
3. ✅ `app/api/quotations/[id]/route.ts` - DELETE API
4. ✅ `app/api/invoices/[id]/route.ts` - DELETE API
5. ✅ `app/api/receipts/[id]/route.ts` - DELETE API

---

## Implementation Plan

### Phase 1: Delete Functionality ✅ (COMPLETED)

**Components:**
- ✅ `DocumentActions.tsx` - Generic delete/edit buttons with modal
- ✅ API routes for DELETE operations (all 3 document types)

**Features:**
- Confirmation modal before delete
- Soft delete (sets `deletedAt` timestamp)
- Loading states
- Error handling
- Automatic redirect to list page after delete

---

### Phase 2: PDF Generation (TO DO)

#### 2.1 Create Invoice PDF Component

**File:** `components/pdf/InvoicePDF.tsx`

**Requirements:**
- Based on QuotationPDF.tsx pattern
- Include all invoice fields:
  - Invoice number, dates (issue, due)
  - Company and customer info
  - Items with sub-items
  - Subtotal, VAT, Total
  - **Withholding Tax section** (unique to invoices)
  - Net Total (Total - WHT)
  - Bahttext for net total
  - Bank information
  - Notes
- Thai font support (Sarabun, NotoSansThai)
- Bilingual support (Thai/English)
- Professional layout
- Status indicator

**Estimated Size:** ~500-600 lines

---

#### 2.2 Create Receipt PDF Component

**File:** `components/pdf/ReceiptPDF.tsx`

**Requirements:**
- Based on QuotationPDF.tsx pattern
- Include all receipt fields:
  - Receipt number, date
  - Company and customer info
  - Items with sub-items
  - Subtotal, VAT, Total
  - Payment method
  - Bahttext for total
  - Bank information
  - Notes
  - Signature section (if applicable)
- Thai font support
- Bilingual support
- Professional layout

**Estimated Size:** ~450-500 lines

---

#### 2.3 Create PDF Actions Components

**Files:**
- `components/InvoicePDFActions.tsx`
- `components/ReceiptPDFActions.tsx`

**Pattern:** Follow `QuotationPDFActions.tsx`

**Features:**
- Preview PDF button
- Download PDF button
- Proper filename generation
- Loading states

**Estimated Size:** ~80 lines each

---

#### 2.4 Create PDF Action Helpers

**File:** `lib/actions/pdf.ts` (extend existing)

**Add functions:**
```typescript
export function generateInvoicePDFFilename(
  invoiceNumber: string,
  customerName: string
): string;

export function generateReceiptPDFFilename(
  receiptNumber: string,
  customerName: string
): string;
```

---

### Phase 3: Edit Functionality (TO DO)

#### 3.1 Create Edit Pages

**Files to create:**
1. `app/quotation/[id]/edit/page.tsx`
2. `app/invoice/[id]/edit/page.tsx`
3. `app/receipt/[id]/edit/page.tsx`

**Pattern for each:**
```typescript
// Example: quotation edit page
export default async function EditQuotationPage({ params }) {
  const { id } = await params;
  
  // Fetch existing quotation
  const quotation = await prisma.quotation.findUnique({
    where: { id },
    include: { company: true, items: { include: { subItems: true } } }
  });
  
  if (!quotation || quotation.deletedAt) {
    notFound();
  }
  
  // Transform data for form
  const initialData = transformQuotationForForm(quotation);
  
  return (
    <div>
      <h1>Edit Quotation</h1>
      <QuotationForm 
        editMode={true}
        initialData={initialData}
        quotationId={id}
      />
    </div>
  );
}
```

**Estimated Size:** ~100-150 lines each

---

#### 3.2 Update Form Components for Edit Mode

**Files to modify:**
- `components/QuotationForm.tsx`
- `components/InvoiceForm.tsx`
- `components/ReceiptForm.tsx`

**Changes needed:**
- Accept `editMode` prop (already exists in InvoiceForm)
- Accept `quotationId/invoiceId/receiptId` prop
- Use update action instead of create when in edit mode
- Show "Update" button instead of "Create" button
- Handle item IDs properly (keep existing IDs, generate for new items)
- Pre-populate form with existing data

**Note:** InvoiceForm already has edit mode support, just needs the edit page.

---

#### 3.3 Update Server Actions

**Files:**
- `lib/actions/quotations.ts` (may need to create)
- `lib/actions/invoices.ts` (update action exists)
- `lib/actions/receipts.ts` (update action exists)

**Verify/Create:**
- `updateQuotation(id, data)` function
- `updateInvoice(id, data)` function (exists)
- `updateReceipt(id, data)` function (exists)

**Features:**
- Validate data
- Update main document
- Handle items:
  - Update existing items
  - Create new items
  - Delete removed items (or mark as deleted)
- Revalidate paths
- Return updated document

---

### Phase 4: Integration & Testing (TO DO)

#### 4.1 Update Detail Pages

**Files to update:**
- `app/quotation/[id]/page.tsx`
- `app/invoice/[id]/page.tsx`
- `app/receipt/[id]/page.tsx`

**Changes:**
Replace static buttons with action components:

```typescript
// Replace:
<button>📥 Download PDF</button>
<button>✏️ Edit</button>
<button>🗑️ Delete</button>

// With:
<QuotationDetailActions quotation={quotation} />
// or
<InvoiceDetailActions invoice={invoice} />
// or
<ReceiptDetailActions receipt={receipt} />
```

---

#### 4.2 Create Detail Action Wrappers

**Files to create:**
- `components/InvoiceDetailActions.tsx`
- `components/ReceiptDetailActions.tsx`

**Pattern:** Follow `QuotationDetailActions.tsx`

**Combines:**
- PDF actions (preview, download)
- Document actions (edit, delete)

---

#### 4.3 Testing Checklist

**For Each Document Type (Quotation, Invoice, Receipt):**

- [ ] **Create:** Can create new document
- [ ] **View:** Detail page displays correctly
- [ ] **Edit:** Can edit existing document
  - [ ] Pre-populated with existing data
  - [ ] Can modify fields
  - [ ] Can add/remove items
  - [ ] Saves successfully
  - [ ] Redirects to detail page
- [ ] **Delete:** Can delete document
  - [ ] Confirmation modal appears
  - [ ] Soft delete (sets deletedAt)
  - [ ] Redirects to list page
  - [ ] Document no longer visible in list
- [ ] **PDF Preview:** Can preview PDF in new tab
  - [ ] All data displays correctly
  - [ ] Thai fonts render properly
  - [ ] Layout is professional
- [ ] **PDF Download:** Can download PDF
  - [ ] Downloads with correct filename
  - [ ] PDF opens successfully
  - [ ] All data is accurate

---

## File Structure Summary

### New Files to Create (Remaining)

```
components/
├── pdf/
│   ├── InvoicePDF.tsx              (NEW - 500 lines)
│   └── ReceiptPDF.tsx              (NEW - 450 lines)
├── InvoicePDFActions.tsx           (NEW - 80 lines)
├── ReceiptPDFActions.tsx           (NEW - 80 lines)
├── InvoiceDetailActions.tsx        (NEW - 70 lines)
└── ReceiptDetailActions.tsx        (NEW - 70 lines)

app/
├── quotation/[id]/
│   └── edit/
│       └── page.tsx                (NEW - 150 lines)
├── invoice/[id]/
│   └── edit/
│       └── page.tsx                (NEW - 150 lines)
└── receipt/[id]/
    └── edit/
        └── page.tsx                (NEW - 150 lines)

lib/actions/
└── pdf.ts                          (EXTEND - add 20 lines)
```

**Total new code:** ~1,820 lines

---

### Files to Modify

```
app/quotation/[id]/page.tsx         (UPDATE - replace buttons)
app/invoice/[id]/page.tsx           (UPDATE - replace buttons)
app/receipt/[id]/page.tsx           (UPDATE - replace buttons)
components/QuotationForm.tsx        (UPDATE - verify edit mode)
components/InvoiceForm.tsx          (UPDATE - verify edit mode)
components/ReceiptForm.tsx          (UPDATE - add edit mode)
```

---

## Time Estimates

| Phase | Task | Estimated Time |
|-------|------|----------------|
| 1 | Delete functionality | ✅ 30 min (DONE) |
| 2.1 | Invoice PDF component | 2-3 hours |
| 2.2 | Receipt PDF component | 2-3 hours |
| 2.3 | PDF Actions components | 30 min |
| 2.4 | PDF helpers | 15 min |
| 3.1 | Edit pages (x3) | 1.5 hours |
| 3.2 | Update forms for edit | 1 hour |
| 3.3 | Update server actions | 30 min |
| 4.1 | Update detail pages | 30 min |
| 4.2 | Detail action wrappers | 30 min |
| 4.3 | Testing | 2 hours |
| **TOTAL** | | **~11-13 hours** |

---

## Priority Order

### Critical (Must Have)
1. ✅ Delete functionality (COMPLETED)
2. Edit functionality (all 3 types)
3. PDF download (Invoice, Receipt)

### Important (Should Have)
4. PDF preview functionality
5. Comprehensive testing

### Nice to Have
6. Print-friendly views
7. Email/share functionality
8. Batch operations

---

## Implementation Strategy

### Option A: Complete One Document Type at a Time
**Pros:** User can test fully functional features immediately
**Cons:** Takes longer to see all documents working

**Order:**
1. Quotations (partially done)
2. Invoices
3. Receipts

### Option B: Complete One Feature at a Time
**Pros:** Consistency across all document types
**Cons:** None fully functional until all complete

**Order:**
1. ✅ Delete (all 3) - DONE
2. Edit (all 3)
3. PDF (all 3)

**Recommended:** Option B (current approach)

---

## Next Immediate Steps

1. **Test Delete Functionality**
   ```bash
   lsof -ti:4000 | xargs kill -9
   rm -rf .next
   npm run dev
   # Test delete on quotation/invoice/receipt
   ```

2. **Create Invoice PDF Component**
   - Copy QuotationPDF.tsx as template
   - Modify for invoice structure
   - Add WHT section
   - Test with sample invoice

3. **Create Receipt PDF Component**
   - Copy QuotationPDF.tsx as template
   - Modify for receipt structure
   - Add payment method section
   - Test with sample receipt

4. **Create Edit Pages**
   - Start with quotation edit page
   - Then invoice edit page
   - Finally receipt edit page

5. **Integration & Testing**
   - Update all detail pages
   - Test complete workflows
   - Fix any bugs

---

## Testing Workflow

```bash
# 1. Clear and restart
lsof -ti:4000 | xargs kill -9
rm -rf .next
npm run dev

# 2. Test each document type
# - Create new document
# - View detail page
# - Test PDF preview
# - Test PDF download
# - Test edit functionality
# - Test delete functionality

# 3. Run automated tests
npm run test
```

---

## Success Criteria

**For each document type, users can:**
- ✅ Create documents
- ✅ View document details
- ✅ Edit existing documents
- ✅ Delete documents (with confirmation)
- ✅ Preview PDF in browser
- ✅ Download PDF with proper filename
- ✅ All data displays correctly in PDF
- ✅ Thai fonts render properly

---

## Known Limitations

1. **No Hard Delete:** Currently only soft delete (sets deletedAt)
   - Deleted documents remain in database
   - Can add restore functionality later

2. **No Version History:** Edits overwrite existing data
   - Could add audit trail in future

3. **No Concurrent Edit Protection:** Multiple users could edit simultaneously
   - Could add optimistic locking later

4. **No Draft Saving:** Edit changes must be submitted
   - Could add auto-save feature later

---

## Related Documentation

- Testing Guide: `README-TESTING.md`
- Copilot Instructions: `.github/copilot-instructions.md`
- Invoice View Task: `task-2024-invoice-view-page.md`
- Company Cache Fix: `task-2024-company-select-refresh-fix.md`

---

## Current Status

**Completed:**
- ✅ Delete functionality (all 3 document types)
- ✅ Delete API routes
- ✅ Delete confirmation modal
- ✅ DocumentActions component
- ✅ QuotationDetailActions component

**In Progress:**
- 🔄 Waiting for testing/approval to proceed
- 🔄 Ready to implement PDF generation
- 🔄 Ready to implement edit functionality

**Next Steps:**
- Test delete functionality
- Create PDF components
- Create edit pages
- Integration testing

---

**Status: Phase 1 Complete, Awaiting Testing**
**Last Updated:** 2024-01-20