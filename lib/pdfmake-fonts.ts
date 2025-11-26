"use client";

// Font loader utility for PDFMake with Thai fonts
// Converts local font files to base64 data URLs for PDFMake

let fontsLoaded = false;
let fontsCache: any = null;

/**
 * Load fonts from public directory and convert to base64
 * PDFMake requires fonts as base64 data URLs or in vfs
 */
export async function loadFontsForPDFMake() {
  // Return cached fonts if already loaded
  if (fontsLoaded && fontsCache) {
    return fontsCache;
  }

  try {
    // Fetch font files from public directory
    const [sarabunRegular, sarabunBold, notoSansThai] = await Promise.all([
      fetch("/fonts/Sarabun-Regular.ttf").then((res) => res.arrayBuffer()),
      fetch("/fonts/Sarabun-Bold.ttf").then((res) => res.arrayBuffer()),
      fetch("/fonts/NotoSansThai.ttf").then((res) => res.arrayBuffer()),
    ]);

    // Convert ArrayBuffer to base64
    const toBase64 = (buffer: ArrayBuffer): string => {
      const bytes = new Uint8Array(buffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    };

    // Create font configuration for PDFMake
    const fonts = {
      Sarabun: {
        normal: toBase64(sarabunRegular),
        bold: toBase64(sarabunBold),
        italics: toBase64(sarabunRegular), // Use regular for italics
        bolditalics: toBase64(sarabunBold), // Use bold for bold italics
      },
      NotoSansThai: {
        normal: toBase64(notoSansThai),
        bold: toBase64(notoSansThai), // No bold variant available
        italics: toBase64(notoSansThai),
        bolditalics: toBase64(notoSansThai),
      },
    };

    // Cache the fonts
    fontsCache = fonts;
    fontsLoaded = true;

    return fonts;
  } catch (error) {
    console.error("Failed to load fonts:", error);

    // Fallback to standard fonts if loading fails
    const fallbackFonts = {
      Roboto: {
        normal: "Roboto-Regular.ttf",
        bold: "Roboto-Medium.ttf",
        italics: "Roboto-Italic.ttf",
        bolditalics: "Roboto-MediumItalic.ttf",
      },
    };

    return fallbackFonts;
  }
}

/**
 * Create virtual file system (vfs) object for PDFMake
 * Alternative approach using vfs instead of base64
 */
export async function createVFSForPDFMake() {
  try {
    const [sarabunRegular, sarabunBold, notoSansThai] = await Promise.all([
      fetch("/fonts/Sarabun-Regular.ttf").then((res) => res.arrayBuffer()),
      fetch("/fonts/Sarabun-Bold.ttf").then((res) => res.arrayBuffer()),
      fetch("/fonts/NotoSansThai.ttf").then((res) => res.arrayBuffer()),
    ]);

    // Convert to base64 for vfs
    const toBase64 = (buffer: ArrayBuffer): string => {
      const bytes = new Uint8Array(buffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    };

    // Create vfs object
    const vfs = {
      "Sarabun-Regular.ttf": toBase64(sarabunRegular),
      "Sarabun-Bold.ttf": toBase64(sarabunBold),
      "NotoSansThai.ttf": toBase64(notoSansThai),
    };

    return vfs;
  } catch (error) {
    console.error("Failed to create VFS:", error);
    return {};
  }
}

/**
 * Get font definitions for PDFMake after fonts are loaded in vfs
 */
export function getFontDefinitions() {
  return {
    Sarabun: {
      normal: "Sarabun-Regular.ttf",
      bold: "Sarabun-Bold.ttf",
      italics: "Sarabun-Regular.ttf",
      bolditalics: "Sarabun-Bold.ttf",
    },
    NotoSansThai: {
      normal: "NotoSansThai.ttf",
      bold: "NotoSansThai.ttf",
      italics: "NotoSansThai.ttf",
      bolditalics: "NotoSansThai.ttf",
    },
  };
}

/**
 * Reset fonts cache (useful for testing)
 */
export function resetFontsCache() {
  fontsLoaded = false;
  fontsCache = null;
}
