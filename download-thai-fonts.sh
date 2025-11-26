#!/bin/bash

# Thai Fonts Download Script
# This script downloads working Thai fonts for the PDF generator

echo "🇹🇭 Downloading Thai fonts for Quotation Generator..."

# Create fonts directory if it doesn't exist
mkdir -p public/fonts

# Download Noto Sans Thai (Variable Font - supports all weights)
echo "📥 Downloading Noto Sans Thai..."
curl -L "https://github.com/notofonts/thai/raw/main/fonts/NotoSansThai/hinted/ttf/NotoSansThai-Regular.ttf" \
  -o "public/fonts/NotoSansThai-Regular.ttf"

curl -L "https://github.com/notofonts/thai/raw/main/fonts/NotoSansThai/hinted/ttf/NotoSansThai-Bold.ttf" \
  -o "public/fonts/NotoSansThai-Bold.ttf"

# Download Sarabun (Popular Thai font)
echo "📥 Downloading Sarabun..."
curl -L "https://github.com/cadsondemak/Sarabun/raw/master/fonts/otf/Sarabun-Regular.otf" \
  -o "public/fonts/Sarabun-Regular.otf"

curl -L "https://github.com/cadsondemak/Sarabun/raw/master/fonts/otf/Sarabun-Bold.otf" \
  -o "public/fonts/Sarabun-Bold.otf"

# Verify downloads
echo ""
echo "📊 Verifying font files..."
echo ""

for font in public/fonts/*; do
  if [ -f "$font" ]; then
    size=$(du -h "$font" | cut -f1)
    type=$(file "$font" | cut -d: -f2)
    echo "✓ $font ($size)"
    echo "  Type: $type"
  fi
done

echo ""
echo "✅ Font download complete!"
echo ""
echo "Next steps:"
echo "1. Update src/utils/fonts.ts to use these fonts"
echo "2. Run: npm run build"
echo "3. Run: npm run dev"
echo "4. Test Thai characters in the quotation form"
echo ""
