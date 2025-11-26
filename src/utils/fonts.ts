import { Font } from "@react-pdf/renderer";

// Register Thai fonts for proper Thai language support
Font.register({
  family: "Sarabun",
  fonts: [
    {
      src: "/fonts/Sarabun-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "/fonts/Sarabun-Bold.ttf",
      fontWeight: 700,
    },
  ],
});

Font.register({
  family: "NotoSansThai",
  fonts: [
    {
      src: "/fonts/NotoSansThai.ttf",
    },
  ],
});

// Use Sarabun as the primary font family (excellent Thai support)
export const FONT_FAMILY = "Sarabun";

// Alternative: export const FONT_FAMILY = 'NotoSansThai';
