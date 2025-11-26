# 🚀 Quick Start Guide

## Get Up and Running in 3 Minutes!

### Step 1: Install (30 seconds)
```bash
npm install
```

### Step 2: Start (10 seconds)
```bash
npm run dev
```

The app will open at `http://localhost:3000` 🎉

---

## 📝 First Quotation in 5 Steps

### 1️⃣ **Update Your Company Info** (IMPORTANT!)
Open `src/types/index.ts` and change:
```typescript
export const DEFAULT_COMPANY_INFO: CompanyInfo = {
  name: 'YOUR COMPANY NAME HERE',
  address: 'YOUR ADDRESS HERE',
  taxId: 'YOUR TAX ID HERE',
  phone: 'YOUR PHONE HERE',
  email: 'YOUR EMAIL HERE',
};
```

### 2️⃣ **Enter Customer Details**
Fill in the form:
- Customer name
- Address
- Phone & Email

### 3️⃣ **Add Items**
- Click "เพิ่มรายการ" to add products/services
- Enter description, quantity, unit, and price
- Amount calculates automatically!

### 4️⃣ **Preview**
- Watch the PDF update live on the right side
- Check everything looks good

### 5️⃣ **Download**
- Click "ดาวน์โหลด PDF"
- Save to your computer
- Done! 🎉

---

## 🎨 Quick Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    600: '#YOUR_COLOR', // Main color
  }
}
```

### Change Bank Details
Edit `src/types/index.ts`:
```typescript
export const DEFAULT_BANK_DETAILS = {
  bankName: 'Your Bank',
  accountName: 'Your Account Name',
  accountNumber: 'Your Account Number',
};
```

---

## 🆘 Troubleshooting

### Port 3000 in use?
Vite will automatically use the next available port (3001, 3002, etc.)

### PDF not showing?
- Make sure you filled in customer name and address
- Check browser console for errors
- Try refreshing the page

### Thai text looks weird?
- Check your internet connection (fonts load from Google)
- Try a different browser (Chrome recommended)

---

## ✅ Ready for Production?

```bash
# Build optimized version
npm run build

# Files will be in dist/ folder
# Upload to any web hosting service!
```

---

## 🎯 That's It!

You now have a fully functional quotation generator!

**Need more help?**
- Read `INSTRUCTIONS.md` for detailed guide
- Check `README.md` for full documentation
- See `PROJECT_SUMMARY.md` for technical details

**Happy Quoting! 🎉**