# PDFMake Test Page - Quick Reference

## 🎯 Purpose

Test the new **PDFMake** PDF engine to verify it solves the Thai postal code truncation issue.

## 🚀 Access

```bash
npm run dev
# Open: http://localhost:4000/test-pdfmake
```

## ❓ The Problem This Solves

**Before (with @react-pdf/renderer):**
- Thai addresses ending with postal codes would truncate
- Example: "จังหวัดขอนแก่น 40000" → "จังหวัดขอนแก่น 400" (missing last digit)
- Required manual workaround: adding 2 spaces after every Thai text

**After (with PDFMake):**
- Thai text and postal codes render correctly
- No workarounds needed
- Better font support for complex scripts

## 🧪 Quick Test (2 Minutes)

1. **Open test page**: `http://localhost:4000/test-pdfmake`
2. **Click "Download PDF"**
3. **Open PDF in viewer** (Adobe Reader, Preview, etc.)
4. **Check addresses**:
   - Company address (top)
   - Customer address (middle)
5. **Verify postal codes are complete**: 40000 (not 400), 12120 (not 121)

## 📋 Test Scenarios

### Standard Address (40000)
- Normal length Thai address
- Tests common postal code pattern
- Default test case

### Long Address (12120)
- Very long Thai address
- Tests extreme line wrapping case
- Edge case validation

## 🎨 Font Options

### Sarabun (Default)
- Modern, clean Thai font
- Primary font for documents
- Best readability

### NotoSansThai (Alternative)
- Google's Thai font
- Alternative styling
- Test for comparison

## ✅ What to Check

### Critical Areas
- [x] **Company address** - postal code complete?
- [x] **Customer address** - postal code complete?
- [x] **Table headers** - Thai labels visible?
- [x] **Item descriptions** - long text wraps correctly?
- [x] **Overall layout** - professional appearance?

### Success Criteria
- ✅ Postal codes show all digits (40000, not 400)
- ✅ Thai text doesn't cut off at line ends
- ✅ No visible truncation anywhere
- ✅ Professional document quality

## 📊 Comparison

| Feature | @react-pdf/renderer | PDFMake |
|---------|---------------------|---------|
| Postal codes | ❌ Truncated | ✅ Complete |
| Thai text | ❌ Cut off | ✅ Proper |
| Workaround | ⚠️ Manual spaces | ✅ None |
| Quality | 🟡 Good | 🟢 Excellent |

## 🎯 Expected Results

### Should See:
- ✅ Complete postal codes (40000, 12120, 10110)
- ✅ All Thai characters visible
- ✅ Proper line wrapping
- ✅ Professional layout
- ✅ No truncation

### Should NOT See:
- ❌ Partial postal codes (400, 121)
- ❌ Cut-off Thai text
- ❌ Boxes instead of characters
- ❌ Layout issues

## 🔧 Troubleshooting

### PDF Won't Generate
```bash
# Clear cache
rm -rf .next
npm run dev
```

### Thai Text Shows Boxes
- Fonts not loaded properly
- Check `/public/fonts/` directory has TTF files

### Page Won't Load
- Make sure dev server is running
- Check URL: `http://localhost:4000/test-pdfmake`

## 📚 Next Steps

If test is successful:
1. ✅ PDFMake solves the problem
2. → Migrate Invoice to PDFMake
3. → Migrate Receipt to PDFMake
4. → Update production code
5. → Remove old @react-pdf/renderer code

If test fails:
1. Document what doesn't work
2. Try different font (Sarabun vs NotoSansThai)
3. Check console for errors
4. Review implementation

## 📖 Documentation

- **Full Guide**: `/PDFMAKE-MIGRATION.md`
- **Implementation**: `/lib/pdfmake/`
- **PDFMake Docs**: https://pdfmake.github.io/docs/

## 💡 Key Points

- 🎯 **Goal**: Fix postal code truncation
- 🔧 **Solution**: Migrate to PDFMake
- ✅ **Status**: Quotation builder complete
- 🧪 **Action**: Test and verify
- 📝 **Next**: Migrate Invoice & Receipt

---

**Ready to test?** → Click "Download PDF" and inspect addresses! 🚀