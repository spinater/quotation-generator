# 🚀 Quick Reference - Quotation Generator

**Version:** 2.0.0 | **Status:** ✅ Production Ready

---

## ⚡ Quick Start (30 Seconds)

```bash
cd quotation-generator
npm run dev
```

Open: **http://localhost:5173**

---

## 📋 Default Values (Pre-filled)

### Company
- **Name:** ร้าน ร็อคเก็ต แล็บ
- **Address:** 669/2 หมู่ 12 ตำบลศิลา อำเภอเมือง จังหวัดขอนแก่น 40000
- **Tax ID:** 1 4599 00264 65 1
- **Phone:** 080-1494165
- **Email:** (blank - optional)

### Bank Details
```
ชื่อบัญชี : อดิศร เพียรชอบ
1.บัญชีออมทรัพย์ ธ.ไทยพาณิชย์  สาขามหาวิทยาลัยขอนแก่น : 793-2-68989-1
2.ธ.กรุงไทย สาขามหาวิทยาลัยขอนแก่น : 980-1-79115-2
```

### Quotation By
- **Default:** นายอดิศร เพียรชอบ

### VAT
- **Default:** ❌ Disabled (no VAT)
- **When enabled:** 7%

---

## ✨ Key Features

| Feature | Default | Editable |
|---------|---------|----------|
| Company Info | Thai defaults | ✅ Yes |
| Customer Info | Empty | ✅ Yes |
| VAT | Disabled | ✅ Yes |
| VAT Rate | 7% | ✅ Yes |
| Payment Terms | Thai default | ✅ Yes |
| Bank Details | 2 accounts | ✅ Yes |
| Quotation By | Thai name | ✅ Yes |
| Notes | Empty | ✅ Yes |

---

## 💰 VAT Toggle

**Disable VAT (default):**
- ☐ Checkbox unchecked
- Subtotal = Total
- No VAT line in PDF

**Enable VAT:**
- ☑ Checkbox checked
- VAT rate field appears
- Subtotal + VAT = Total
- VAT line shown in PDF

---

## 🔤 BAHTTEXT Examples

| Amount | Thai Text |
|--------|-----------|
| ฿5,000 | ห้าพันบาทถ้วน |
| ฿15,000 | หนึ่งหมื่นห้าพันบาทถ้วน |
| ฿25,000 | สองหมื่นห้าพันบาทถ้วน |
| ฿50,000 | ห้าหมื่นบาทถ้วน |
| ฿100,000 | หนึ่งแสนบาทถ้วน |
| ฿1,000,000 | หนึ่งล้านบาทถ้วน |

*Automatically displayed in blue box in PDF*

---

## ✍️ Signatures in PDF

```
┌──────────────────┐  ┌──────────────────┐
│  ผู้เสนอราคา      │  │   ผู้สั่งซื้อ     │
│ (Your name)      │  │  (Blank)         │
│                  │  │                  │
│ ────────────     │  │  ────────────    │
│ ลงชื่อ           │  │  ลงชื่อ          │
│ วันที่: Auto     │  │  วันที่: Blank   │
└──────────────────┘  └──────────────────┘
```

---

## 📝 Form Sections (Top to Bottom)

1. **ข้อมูลใบเสนอราคา** - Quotation info
2. **ข้อมูลบริษัท** - Company info (editable)
3. **ข้อมูลลูกค้า** - Customer info
4. **รายการสินค้า** - Items (add/remove)
5. **VAT Toggle** - Enable/disable VAT
6. **เงื่อนไขการชำระเงิน** - Payment terms
7. **ข้อมูลการโอนเงิน** - Bank details
8. **ผู้เสนอราคา** - Quotation by
9. **หมายเหตุ** - Notes

---

## 🧪 Testing Commands

```bash
# Validate Thai fonts
node test-thai-fonts.js

# Test BAHTTEXT
node test-baht.mjs

# Build project
npm run build

# Start dev server
npm run dev
```

---

## ✅ PDF Checklist

PDF should contain:
- [ ] Company header (Thai)
- [ ] Quotation number & dates
- [ ] Customer information
- [ ] Items table
- [ ] Subtotal
- [ ] VAT (if enabled)
- [ ] Total
- [ ] **BAHTTEXT (blue box)**
- [ ] Payment terms
- [ ] Notes (if any)
- [ ] **Bank details (yellow box)**
- [ ] **Two signature sections**
- [ ] Footer text

---

## 🎨 Color Guide in PDF

| Element | Color |
|---------|-------|
| Headers | Blue (#0284c7) |
| BAHTTEXT Box | Blue (#f0f9ff background) |
| Bank Details | Yellow/Gold (#fffbeb background) |
| Table Header | Blue (#0284c7 background) |
| Total | Blue (#0284c7) |

---

## 🐛 Quick Troubleshooting

**Thai text shows as boxes?**
```bash
# Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R)
npm run dev
```

**Font errors?**
```bash
node test-thai-fonts.js
# Should show: ✅ ALL TESTS PASSED
```

**Build fails?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `src/components/QuotationForm.tsx` | Form UI |
| `src/components/QuotationPDF.tsx` | PDF template |
| `src/utils/bahttext.ts` | Thai text converter |
| `src/utils/fonts.ts` | Font registration |
| `public/fonts/*.ttf` | Thai fonts |

---

## 🎯 Common Use Cases

### Quote without VAT (Wholesale):
1. Keep VAT checkbox **unchecked**
2. Enter items
3. Total = Subtotal

### Quote with VAT (Retail):
1. **Check** VAT checkbox
2. Adjust rate if needed (default 7%)
3. Total = Subtotal + VAT

### Change Company Info:
1. Edit "ข้อมูลบริษัท" section
2. All fields editable
3. Email is optional

### Add Bank Account:
1. Edit "ข้อมูลการโอนเงิน"
2. Add new line
3. Format as needed

---

## 💡 Pro Tips

1. **Email field** - Can be left blank
2. **VAT default** - Disabled (no VAT added)
3. **BAHTTEXT** - Updates automatically
4. **Signatures** - ผู้สั่งซื้อ left blank for customer
5. **PDF preview** - Updates in real-time
6. **Thai fonts** - Work in all browsers
7. **Bank details** - Support multiple accounts

---

## 🚀 Production Ready

✅ Thai fonts working  
✅ BAHTTEXT converter  
✅ VAT toggle  
✅ Editable company info  
✅ Professional signatures  
✅ Custom bank details  
✅ No build errors  
✅ Cross-browser compatible  

---

## 📞 Need Help?

1. Check **NEW_FEATURES.md** for detailed guide
2. Run **test-thai-fonts.js** to validate setup
3. See **THAI_TEST.md** for test content
4. Review **RELEASE_NOTES.md** for changes

---

**พร้อมใช้งาน! Ready to use!** 🎉

*Version 2.0.0 | Thai Support: 100% Complete*