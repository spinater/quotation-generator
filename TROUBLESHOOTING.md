# 🔧 Troubleshooting Guide

## PDF Preview Issues

### Problem: "Unknown font format" Error

**Symptoms:**
- PDF preview doesn't load
- Console shows: `Error: Unknown font format`
- Blank screen on the right side

**Solution:**
The app now uses Roboto font which has better Unicode and Thai character support. If you still see this error:

1. **Clear Browser Cache**
   ```
   - Chrome: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
   - Firefox: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
   - Select "Cached images and files"
   - Clear and reload
   ```

2. **Check Internet Connection**
   - Fonts load from CDN (cdnjs.cloudflare.com)
   - Ensure you have active internet connection
   - Try accessing: https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf
   - If it doesn't load, your network may be blocking CDN

3. **Try Different Browser**
   - Chrome/Edge: Best support (Recommended)
   - Firefox: Good support
   - Safari: May have issues with some fonts

4. **Disable Browser Extensions**
   - Ad blockers may block font CDN
   - Try disabling extensions temporarily
   - Reload the page

### Alternative: Use Built-in Fonts Only

If CDN fonts don't work, you can switch to built-in Helvetica fonts:

**Edit `src/utils/fonts.ts`:**

```typescript
// Comment out or remove all Font.register() code
// Change exports to:
export const FONT_FAMILY = "Helvetica";
export const FONT_FAMILY_BOLD = "Helvetica";
```

**Edit `src/components/QuotationPDF.tsx`:**

Find all instances of `fontWeight: 700` and replace the parent style with:
```typescript
fontFamily: "Helvetica-Bold"
```

**Rebuild:**
```bash
npm run build
npm run dev
```

**Note:** Helvetica doesn't support Thai characters perfectly, but it will render.

---

## Other Common Issues

### PDF Shows But Download Doesn't Work

**Solution:**
1. Check browser's download settings
2. Ensure pop-ups aren't blocked
3. Try right-click → "Save link as..."
4. Check browser console for errors

### Thai Characters Display as Boxes

**Cause:** Font doesn't support Thai Unicode

**Solutions:**

**Option 1: Local Font Files (Best for Thai)**

1. Download Thai-compatible fonts (e.g., THSarabunNew, Noto Sans Thai)
2. Place `.ttf` files in `public/fonts/`
3. Update `src/utils/fonts.ts`:

```typescript
import { Font } from "@react-pdf/renderer";

Font.register({
  family: "THSarabun",
  fonts: [
    {
      src: "/fonts/THSarabunNew.ttf",
      fontWeight: 400,
    },
    {
      src: "/fonts/THSarabunNew-Bold.ttf",
      fontWeight: 700,
    },
  ],
});

export const FONT_FAMILY = "THSarabun";
```

4. Rebuild the app

**Option 2: Use Noto Sans Thai (Google Fonts)**

```typescript
Font.register({
  family: "NotoSansThai",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/notosansthai/v25/iJWnBXeUZi_OHPqn4wq6hQ2_hbJ1xyN9wd43SofNWcd1MKVQt_So_9CdU5RtpzF-QRvzzXg.ttf",
    },
  ],
});

export const FONT_FAMILY = "NotoSansThai";
```

### PDF Preview is Slow

**Causes:**
- Large number of items
- Complex calculations
- Slow internet (loading fonts)

**Solutions:**
1. Reduce number of items for testing
2. Use "Hide Preview" button while entering data
3. Download PDF instead of relying on preview
4. Use local fonts instead of CDN fonts

### Calculations Are Wrong

**Check:**
1. Ensure quantity and price are numbers (not text)
2. VAT rate is percentage (7 = 7%)
3. Clear browser cache
4. Reload page

**Manual Fix:**
1. Delete an item and re-add it
2. Change quantity/price to force recalculation
3. Change VAT rate and change it back

### App Won't Start

**Error: `EADDRINUSE: address already in use`**

**Solution:**
```bash
# Kill process on port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or just use a different port:
# Vite will automatically try 3001, 3002, etc.
```

**Error: `Cannot find module`**

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Fails

**Error: TypeScript errors**

**Solution:**
```bash
# Check for syntax errors
npm run build

# If specific file has errors, check:
# - Import statements are correct
# - No unused variables
# - Types match
```

**Error: Out of memory**

**Solution:**
```bash
# Increase Node memory
export NODE_OPTIONS=--max-old-space-size=4096
npm run build
```

### Downloaded PDF Won't Open

**Solutions:**
1. Ensure download completed (check file size > 0)
2. Try different PDF reader (Adobe, browser, etc.)
3. Check file extension is `.pdf`
4. Re-download the PDF
5. Try different browser

### Preview Shows Old Data

**Solution:**
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Close and reopen browser
4. Check that form fields are actually updated

---

## Performance Tips

### Speed Up PDF Generation

1. **Hide Preview While Typing**
   - Click "ซ่อนตัวอย่าง" (Hide Preview)
   - Enter all data
   - Show preview when ready

2. **Use Local Fonts**
   - Host fonts in `public/fonts/`
   - Faster than loading from CDN
   - Works offline

3. **Reduce Items**
   - For testing, use 1-3 items
   - Add more items when ready

### Reduce Bundle Size

**In `vite.config.ts`, add:**
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-pdf': ['@react-pdf/renderer'],
      },
    },
  },
},
```

---

## Browser-Specific Issues

### Chrome/Edge
- **Issue:** Extension blocking fonts
- **Fix:** Disable extensions or whitelist CDN

### Firefox
- **Issue:** Slow PDF rendering
- **Fix:** Use Chrome or reduce items

### Safari
- **Issue:** Download doesn't work
- **Fix:** Use Chrome, or right-click → Save As

### Mobile Browsers
- **Issue:** Preview doesn't show
- **Fix:** Desktop recommended, or use download only

---

## Getting Help

### Debug Checklist

Before asking for help:
- [ ] Cleared browser cache
- [ ] Tried different browser
- [ ] Checked internet connection
- [ ] Checked browser console for errors
- [ ] Tried rebuilding: `npm run build`
- [ ] Tried reinstalling: `npm install`
- [ ] Read this troubleshooting guide

### Provide This Info

When reporting issues:
1. Browser name and version
2. Operating system
3. Error message from console
4. Steps to reproduce
5. Screenshot if possible

### Browser Console

**Open console:**
- Chrome: F12 or Ctrl+Shift+J
- Firefox: F12 or Ctrl+Shift+K
- Safari: Cmd+Option+C

**Look for:**
- Red errors
- Yellow warnings
- Network failures (failed to load fonts)

---

## Advanced Solutions

### Custom Font Installation

1. **Get Thai Font Files**
   - Download from: https://www.f0nt.com/release/thsarabuniowa/
   - Or use: https://github.com/tlwg/fonts-tlwg

2. **Add to Project**
   ```bash
   mkdir -p public/fonts
   # Copy .ttf files to public/fonts/
   ```

3. **Register Fonts**
   ```typescript
   // src/utils/fonts.ts
   Font.register({
     family: "YourFont",
     fonts: [
       { src: "/fonts/regular.ttf", fontWeight: 400 },
       { src: "/fonts/bold.ttf", fontWeight: 700 },
     ],
   });
   ```

4. **Update Components**
   ```typescript
   // Update FONT_FAMILY export
   export const FONT_FAMILY = "YourFont";
   ```

### Offline Mode

1. **Download All Fonts Locally**
2. **Update font registration** to use local paths
3. **Build project:** `npm run build`
4. **Works without internet**

---

## Quick Fixes Summary

| Problem | Quick Fix |
|---------|-----------|
| PDF won't show | Clear cache, reload |
| Thai text shows boxes | Use local Thai fonts |
| Download not working | Try different browser |
| App won't start | Delete node_modules, reinstall |
| Slow performance | Hide preview while typing |
| Build fails | Check TypeScript errors |
| Old data showing | Hard refresh (Ctrl+Shift+R) |

---

**Still having issues?** Check the README.md for more detailed documentation.