# PDF Thai Text Spacing Test Suite Guide

## Overview

This test suite helps investigate and resolve Thai text word-wrapping issues in PDF generation, specifically the problem where Thai addresses ending with postal codes (e.g., "40000") may appear truncated as "400" in the rendered PDF.

## Problem Statement

### The Issue
When generating PDFs with Thai content using `@react-pdf/renderer`, Thai text followed by numbers (especially postal codes at the end of address lines) may get cut off during line wrapping.

**Example:**
- **Expected:** `123 ถนนมิตรภาพ ตำบลในเมือง อำเภอเมือง จังหวัดขอนแก่น 40000`
- **Actual in PDF:** `123 ถนนมิตรภาพ ตำบลในเมือง อำเภอเมือง จังหวัดขอนแก่น 400`

### Root Cause
The `@react-pdf/renderer` library has word-breaking limitations at Thai/number boundaries. Thai Unicode characters (U+0E00-U+0E7F) combined with Latin numbers create problematic break points.

### Current Workaround
Adding 2 trailing spaces to Thai text labels and addresses prevents the cutting, but requires manual intervention.

## Questions to Answer

1. **Is this problem inherent to the PDF library?**
2. **Can we fix it without manually adding 2 trailing spaces?**
3. **What are the alternative solutions?**

## Test Suite Components

### Files Created

```
quotation-generator/
├── lib/
│   └── test-mock-data.ts              # Comprehensive mock data with realistic Thai content
├── components/pdf/
│   ├── QuotationPDF-test.tsx          # Test quotation PDF with configurable solutions
│   ├── InvoicePDF-test.tsx            # Test invoice PDF with configurable solutions
│   └── ReceiptPDF-test.tsx            # Test receipt PDF with configurable solutions
├── app/test-pdf-spacing/
│   └── page.tsx                        # Interactive test page
└── docs/
    └── pdf-spacing-test-guide.md      # This guide
```

### Mock Data

**lib/test-mock-data.ts** contains:
- Multiple company profiles with various address lengths
- Customer data with postal codes in critical positions
- Three test scenarios:
  - **Standard Address (40000)** - Normal length address ending with postal code
  - **Long Address (12120)** - Very long Thai address to test extreme cases
  - **English (Control)** - English version to verify issue is Thai-specific
- Complete document data for Quotation, Invoice, and Receipt types

### Test PDF Components

Each test PDF component supports:

#### Solution Modes

1. **none** - No modifications (shows the problem)
2. **twoSpaces** - Adds 2 trailing spaces (current workaround)
3. **fontChange** - Tests different font (Sarabun vs NotoSansThai)
4. **wordJoiner** - Uses Unicode word joiner characters (U+2060)
5. **customStyle** - Applies increased line-height and letter-spacing

#### Props

```typescript
interface TestPDFProps {
  [document]: DocumentData;          // quotation, invoice, or receipt
  solutionMode?: SolutionMode;       // Solution to apply
  customFont?: string;               // Font family to use
}
```

## How to Use

### 1. Start the Test Page

```bash
# Navigate to project directory
cd quotation-generator

# Start development server
npm run dev

# Open browser to test page
# http://localhost:4000/test-pdf-spacing
```

### 2. Interactive Testing

The test page provides:
- **Document Type Selector** - Choose Quotation, Invoice, or Receipt
- **Test Scenario Selector** - Choose address complexity
- **Solution Mode Selector** - Try different fixes
- **Font Toggle** - Switch between Sarabun and NotoSansThai
- **PDF Viewer** - Preview results in browser
- **Download Button** - Download PDF for detailed inspection

### 3. Systematic Testing Process

#### Phase 1: Verify the Problem

1. Set **Solution Mode** to "None (Show Problem)"
2. Set **Test Scenario** to "Standard Address (40000)"
3. Set **Document Type** to "Quotation"
4. Click "Show Viewer" to preview
5. Click "Download Test PDF" and open in PDF reader
6. **Inspect**: Check company and customer addresses
   - Does "40000" appear complete or as "400"?
   - Are Thai labels complete or cut off?

#### Phase 2: Test Current Solution

1. Change **Solution Mode** to "2-Space Workaround"
2. Download and compare with Phase 1 PDF
3. **Verify**: Does adding 2 spaces fix the postal code display?
4. Repeat for all three document types

#### Phase 3: Test Alternative Solutions

For each solution mode:
1. Set **Solution Mode** (Font Change, Word Joiner, Custom Styling)
2. Download PDF
3. Compare with baseline (Phase 1) and current solution (Phase 2)
4. Document results

Test matrix:
```
Document Type: Quotation, Invoice, Receipt
Solution Mode: none, twoSpaces, fontChange, wordJoiner, customStyle
Font: Sarabun, NotoSansThai
Scenario: standard, longAddress, english
```

#### Phase 4: Test All Scenarios

Repeat testing with:
- **Long Address (12120)** - More extreme wrapping case
- **English (Control)** - Verify issue is Thai-specific
- **All Document Types** - Ensure consistency

### 4. Documenting Results

Create a results matrix:

| Solution | Quotation | Invoice | Receipt | Font | Works? | Notes |
|----------|-----------|---------|---------|------|--------|-------|
| None | ❌ | ❌ | ❌ | Both | No | Shows problem |
| 2-Space | ✅ | ✅ | ✅ | Both | Yes | Manual spaces needed |
| Font Change | ? | ? | ? | ? | ? | Test and document |
| Word Joiner | ? | ? | ? | ? | ? | Test and document |
| Custom Style | ? | ? | ? | ? | ? | Test and document |

## Expected Outcomes

### Question 1: Is this caused by the PDF library?

**Expected Answer:** Yes

The issue is a known limitation of `@react-pdf/renderer`'s text layout engine when handling:
- Thai Unicode characters (U+0E00-U+0E7F)
- Followed by Latin numbers
- At line boundaries

This creates ambiguous word-break points that the library handles incorrectly.

### Question 2: Can we fix without manual spacing?

**Possible Answers:**

✅ **Yes, if:**
- Alternative font renders boundaries correctly
- Unicode word joiner prevents breaks
- Custom styling provides enough space
- Auto-spacing utility adds spaces programmatically

❌ **No, if:**
- All alternatives still produce truncation
- Only manual trailing spaces work
- Library limitation is fundamental

### Question 3: Alternative Solutions

Based on test results, rank solutions by effectiveness:

#### Option A: Auto-Spacing Utility (Recommended)
```typescript
// User types normally (no manual spaces)
const address = "จังหวัดขอนแก่น 40000";

// System automatically adds spaces when rendering to PDF
const pdfText = processPdfText(address); // "จังหวัดขอนแก่น 40000  "
```

**Pros:**
- User-friendly (no manual spacing)
- Consistent application
- Easy to implement
- Works with existing workaround

**Cons:**
- Still relies on space workaround
- Adds invisible characters

#### Option B: Font Change
If testing reveals a font that renders correctly:

**Pros:**
- No text manipulation needed
- Clean solution

**Cons:**
- May affect visual design
- Limited font options
- May not work for all cases

#### Option C: Custom Styling
Increased line-height and letter-spacing:

**Pros:**
- No text manipulation
- May improve overall readability

**Cons:**
- Affects layout and spacing
- May not solve root cause
- Could break existing designs

#### Option D: Word Joiner Characters
Unicode characters that prevent line breaks:

**Pros:**
- Semantic approach
- No visible changes

**Cons:**
- May not work with PDF renderer
- Could affect text search/copy

## Implementation Recommendations

### If Auto-Spacing is the Solution

1. **Keep existing utility:** `lib/thai-text-fix.ts`
2. **Update PDF components:**
   ```typescript
   import { processPdfText } from '@/lib/thai-text-fix';
   
   // For static translations
   const label = processPdfText(t.address);
   
   // For dynamic content
   const address = processPdfText(company.address);
   ```

3. **Remove manual spaces from translations:**
   ```typescript
   // Before (manual spaces)
   const translations = {
     th: {
       address: "ที่อยู่  ",  // Manual spaces
     }
   };
   
   // After (clean)
   const translations = {
     th: {
       address: "ที่อยู่",  // No manual spaces
     }
   };
   ```

### If Alternative Solution Works

1. **Document the solution**
2. **Update PDF components** with new approach
3. **Remove space workarounds**
4. **Test thoroughly** with real data

## Testing Checklist

- [ ] Verify problem exists with "None" solution mode
- [ ] Confirm 2-space workaround fixes the issue
- [ ] Test all solution modes with Standard Address scenario
- [ ] Test all solution modes with Long Address scenario
- [ ] Test English version (control - should not have issues)
- [ ] Test all three document types (Quotation, Invoice, Receipt)
- [ ] Test with both fonts (Sarabun and NotoSansThai)
- [ ] Download PDFs and inspect in actual PDF reader (not just preview)
- [ ] Check addresses at top (company) and middle (customer)
- [ ] Check table headers and labels
- [ ] Check dynamic content (notes, descriptions)
- [ ] Verify postal codes are complete (40000, 10110, 12120)
- [ ] Document findings for each solution

## Troubleshooting

### PDF Viewer Not Loading
```bash
# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

### Font Not Rendering
Check that fonts are registered in `lib/fonts.ts`:
```typescript
Font.register({
  family: 'Sarabun',
  fonts: [
    { src: '/fonts/Sarabun-Regular.ttf' },
    { src: '/fonts/Sarabun-Bold.ttf', fontWeight: 700 }
  ]
});
```

### Mock Data Issues
Verify mock data is imported:
```typescript
import { mockQuotation, mockInvoice, mockReceipt } from '@/lib/test-mock-data';
```

## Next Steps

After completing tests:

1. **Document Results** - Fill in the results matrix
2. **Choose Solution** - Based on test outcomes
3. **Implement** - Apply chosen solution to production PDFs
4. **Remove Test Files** - Keep or remove test suite as needed
5. **Update Production Code** - Integrate working solution

## Conclusion

This test suite provides a comprehensive framework to:
- ✅ Confirm the PDF spacing problem
- ✅ Test multiple solution approaches
- ✅ Compare effectiveness across document types
- ✅ Make informed decisions about fixes

The goal is to find a solution that:
- **Works reliably** - Fixes postal code truncation
- **User-friendly** - Doesn't require manual spacing
- **Maintainable** - Easy to apply consistently
- **Clean** - Minimal code complexity

---

**Test Mode Only** - These files are for testing purposes and do not affect production code.