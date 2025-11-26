# 📋 Setup and Usage Instructions

## 🚀 Quick Start

### 1. Install Dependencies

First, navigate to the project directory and install all required dependencies:

```bash
cd quotation-generator
npm install
```

### 2. Start Development Server

Run the development server:

```bash
npm run dev
```

The application will automatically open in your browser at `http://localhost:3000`

### 3. Build for Production

To create a production build:

```bash
npm run build
```

The optimized files will be in the `dist/` directory.

To preview the production build:

```bash
npm run preview
```

---

## 🎯 How to Use the Application

### Step 1: Enter Quotation Details

1. **Quotation Number**: Auto-generated, but you can customize it
2. **Date**: Today's date by default
3. **Valid Until**: 30 days from today by default

### Step 2: Fill Customer Information

Enter the customer details:
- Customer Name (required)
- Tax ID (optional)
- Address (required)
- Phone (required)
- Email (required)

### Step 3: Add Items/Services

1. Click **"เพิ่มรายการ"** (Add Item) to add new line items
2. For each item, enter:
   - Description of product/service
   - Quantity
   - Unit (select from dropdown)
   - Unit Price
   - Amount is calculated automatically

3. To remove an item, click the trash icon (🗑️)

### Step 4: Adjust VAT and Totals

- Default VAT rate is 7% (standard in Thailand)
- You can change the VAT percentage
- Subtotal, VAT amount, and Total are calculated automatically

### Step 5: Add Additional Information

- **Payment Terms**: Add payment conditions (default provided)
- **Notes**: Add any special notes or terms & conditions

### Step 6: Preview and Download

- The PDF preview updates in real-time as you type
- Click **"แสดงตัวอย่าง"** (Show Preview) / **"ซ่อนตัวอย่าง"** (Hide Preview) to toggle preview
- Click **"ดาวน์โหลด PDF"** (Download PDF) to save the quotation

---

## ⚙️ Customization

### Change Company Information

Edit `src/types/index.ts` and modify:

```typescript
export const DEFAULT_COMPANY_INFO: CompanyInfo = {
  name: 'Your Company Name (Thailand) Co., Ltd.',
  address: '123 Business Street, Bangkok 10110, Thailand',
  taxId: '0-0000-00000-00-0',
  phone: '+66 2 000 0000',
  email: 'info@yourcompany.co.th',
};
```

### Change Bank Details

In the same file, modify:

```typescript
export const DEFAULT_BANK_DETAILS = {
  bankName: 'Bangkok Bank',
  accountName: 'Your Company Name (Thailand) Co., Ltd.',
  accountNumber: '000-0-00000-0',
};
```

### Customize Colors

Edit `tailwind.config.js` to change the primary color scheme:

```javascript
colors: {
  primary: {
    500: '#0ea5e9',  // Change these
    600: '#0284c7',
    700: '#0369a1',
  },
}
```

### Modify PDF Layout

Edit `src/components/QuotationPDF.tsx` to customize:
- Fonts and font sizes
- Colors and styling
- Spacing and margins
- Add company logo
- Change header/footer layout

---

## 🌐 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

---

## 🔧 Troubleshooting

### Port Already in Use

If port 3000 is already in use, Vite will automatically try the next available port.

### PDF Not Loading

1. Check that all required fields have values
2. Clear browser cache and reload
3. Check browser console for errors

### Thai Fonts Not Displaying

The app uses Google Fonts (Sarabun) for Thai language support. Ensure you have an active internet connection.

### Build Warnings

The large chunk warning is normal due to the PDF rendering library. For production, consider:
- Implementing code splitting
- Using lazy loading for the PDF components

---

## 📝 Tips for Best Results

1. **Use Descriptive Item Descriptions**: Be clear and specific about products/services
2. **Set Realistic Dates**: Ensure the valid until date makes sense for your business
3. **Include Payment Terms**: Clear payment terms prevent confusion
4. **Add Bank Details**: Makes it easy for customers to pay
5. **Use Notes Section**: Add important terms, conditions, or special offers
6. **Save Regularly**: Use the download button to save versions as you work

---

## 🔐 Data Privacy

- All data is processed locally in your browser
- No data is sent to any external servers
- Quotations are generated and stored on your device only

---

## 📞 Need Help?

For issues or questions:
1. Check the README.md file for detailed documentation
2. Review the troubleshooting section above
3. Check the browser console for error messages
4. Open an issue on GitHub (if applicable)

---

## ✅ Checklist Before Downloading

Before generating your final quotation, verify:

- [ ] Company information is correct
- [ ] Customer details are complete
- [ ] All items have descriptions and prices
- [ ] Quantities and units are correct
- [ ] VAT rate is appropriate
- [ ] Payment terms are clear
- [ ] Bank details are included
- [ ] Notes/terms are added if needed
- [ ] Quotation number is unique
- [ ] Dates are correct

---

**Happy Quoting! 🎉**