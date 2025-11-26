# 🧾 Quotation Generator for Thailand Companies

A modern, professional quotation generator specifically designed for Thai companies. Create, preview, and download beautiful PDF quotations with ease.

## ✨ Features

- **📝 Easy Data Entry**: Intuitive form interface for entering company, customer, and item information
- **👁️ Live PDF Preview**: Real-time PDF preview as you type
- **💾 PDF Download**: Download professional quotations as PDF files
- **🇹🇭 Thai UTF-8 Support**: Full Thai language support with local fonts (Noto Sans Thai & THSarabunNew)
- **🧮 Automatic Calculations**: Auto-calculate subtotals, VAT, and totals
- **💰 VAT Support**: Configurable VAT rate (default 7%)
- **🏦 Bank Details**: Include bank transfer information
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices
- **🎨 Modern UI**: Clean, professional interface using Tailwind CSS

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd quotation-generator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## 📦 Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

To preview the production build:
```bash
npm run preview
```

## 🎯 Usage

### 1. Enter Quotation Information
- Quotation number (auto-generated)
- Date and valid until date
- Customer information

### 2. Add Items
- Click "เพิ่มรายการ" (Add Item) to add products/services
- Fill in description, quantity, unit, and unit price
- Amount is automatically calculated

### 3. Configure Settings
- Adjust VAT rate if needed (default 7%)
- Add payment terms
- Add notes or special conditions

### 4. Preview and Download
- Live PDF preview updates automatically
- Click "ดาวน์โหลด PDF" (Download PDF) to save the quotation

## 🏢 Customizing Company Information

Edit the default company information in `src/types/index.ts`:

```typescript
export const DEFAULT_COMPANY_INFO: CompanyInfo = {
  name: 'Your Company Name (Thailand) Co., Ltd.',
  address: '123 Business Street, Bangkok 10110, Thailand',
  taxId: '0-0000-00000-00-0',
  phone: '+66 2 000 0000',
  email: 'info@yourcompany.co.th',
};
```

### Customizing Bank Details

```typescript
export const DEFAULT_BANK_DETAILS = {
  bankName: 'Bangkok Bank',
  accountName: 'Your Company Name (Thailand) Co., Ltd.',
  accountNumber: '000-0-00000-0',
};
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **PDF Generation**: @react-pdf/renderer
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📁 Project Structure

```
quotation-generator/
├── src/
│   ├── components/
│   │   ├── QuotationForm.tsx      # Main form component
│   │   ├── QuotationPDF.tsx       # PDF document template
│   │   └── PDFPreview.tsx         # PDF preview component
│   ├── types/
│   │   └── index.ts               # TypeScript types and defaults
│   ├── App.tsx                    # Main application component
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Global styles
├── public/                        # Static assets
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite configuration
└── tailwind.config.js             # Tailwind CSS configuration
```

## 🎨 Customizing the Design

### Changing Colors

Edit `tailwind.config.js` to change the primary color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Change these values
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
      },
    },
  },
}
```

### Modifying PDF Layout

Edit `src/components/QuotationPDF.tsx` to customize the PDF appearance:
- Change fonts
- Adjust spacing and margins
- Modify colors and styling
- Add your company logo

## 📝 Available Units

The form includes common Thai/English units:
- ชิ้น (Piece)
- เครื่อง (Unit)
- กล่อง (Box)
- ชุด (Set)
- วัน (Day)
- เดือน (Month)
- ปี (Year)
- ชั่วโมง (Hour)
- กก. (Kg)
- เมตร (Meter)

Add more units in `src/components/QuotationForm.tsx`.

## 🇹🇭 Thai Language Features

### Included Thai Fonts (Local)
- **Noto Sans Thai** - Modern, professional style (default)
- **THSarabunNew** - Traditional Thai document style

### Full UTF-8 Character Support
✅ Thai consonants (ก-ฮ)
✅ Thai vowels (เ แ โ ใ ไ ะ ั า ำ ิ ี ึ ื ุ ู)
✅ Tone marks (่ ้ ๊ ๋)
✅ Thai numbers (๐-๙)
✅ Special characters (ๆ ฯ ฯลฯ)

### No Internet Required
All fonts are stored locally in `public/fonts/` for:
- ✅ Fast loading
- ✅ Offline support
- ✅ Reliable rendering
- ✅ Perfect Thai character display

### Testing Thai Text
See `THAI_TEST.md` for:
- Copy-paste Thai examples
- Character set testing
- Complete document templates
- Verification checklist

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### 🇹🇭 Thai Language Support - WORKING!

**✅ Thai UTF-8 encoding is fully supported!**

The application includes **local Thai fonts** with complete UTF-8 character support:
- **Noto Sans Thai** (Primary) - Modern, clean style
- **THSarabunNew** (Alternative) - Traditional Thai document style

**Fonts are included locally** - no internet connection required after installation!

### Thai Characters Test

Copy and paste these into the form to test:
```
ชื่อลูกค้า: บริษัท ทดสอบ จำกัด
ที่อยู่: 123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110
รายการ: คอมพิวเตอร์โน้ตบุ๊ค
```

**See `THAI_TEST.md` for comprehensive Thai language testing examples!**

### PDF Preview Not Showing

If the PDF preview doesn't load:
1. Check browser console for errors (F12)
2. Ensure all required fields are filled
3. Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. Clear browser cache and reload
5. Use "Hide Preview" then "Show Preview" again

### Thai Characters Show as Boxes (□□□)

**Solution:**
1. Clear Vite cache: `rm -rf node_modules/.vite`
2. Rebuild: `npm run build`
3. Restart dev server: `npm run dev`
4. Hard refresh browser: Ctrl+Shift+R

**Verify fonts exist:**
```bash
ls -lh public/fonts/
# Should show:
# NotoSansThai-Regular.ttf
# NotoSansThai-Bold.ttf
# THSarabunNew.ttf
# THSarabunNew-Bold.ttf
```

### Switch Between Thai Fonts

Edit `src/utils/fonts.ts`:
```typescript
// Use modern style (default):
export const FONT_FAMILY = "Noto Sans Thai";

// Or use traditional style:
export const FONT_FAMILY = "THSarabunNew";
```

Then rebuild: `npm run build && npm run dev`

**For detailed solutions, see:**
- `TROUBLESHOOTING.md` - Complete troubleshooting guide
- `PDF_FIX.md` - Thai UTF-8 font fix documentation
- `THAI_TEST.md` - Thai language testing examples

## 💡 Tips

- Use the auto-generated quotation number or customize it
- Set the valid until date to automatically expire old quotations
- Add detailed payment terms to avoid confusion
- Include bank details for easy payment processing
- Use the notes section for terms and conditions

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ for Thailand Companies