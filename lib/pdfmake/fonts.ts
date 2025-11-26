/**
 * PDFMake Font Configuration for Thai Fonts
 *
 * This file configures Sarabun and NotoSansThai fonts for PDFMake.
 * PDFMake requires fonts to be registered with their file paths.
 */

import type { TFontDictionary } from 'pdfmake/interfaces';

/**
 * Font configuration for PDFMake
 * Maps font families to their font files
 */
export const pdfMakeFonts: TFontDictionary = {
  // Sarabun - Primary Thai font
  Sarabun: {
    normal: '/fonts/Sarabun-Regular.ttf',
    bold: '/fonts/Sarabun-Bold.ttf',
    italics: '/fonts/Sarabun-Regular.ttf', // Use regular as fallback
    bolditalics: '/fonts/Sarabun-Bold.ttf', // Use bold as fallback
  },

  // NotoSansThai - Alternative Thai font
  NotoSansThai: {
    normal: '/fonts/NotoSansThai-Regular.ttf',
    bold: '/fonts/NotoSansThai-Bold.ttf',
    italics: '/fonts/NotoSansThai-Regular.ttf',
    bolditalics: '/fonts/NotoSansThai-Bold.ttf',
  },
};

/**
 * Default font family for Thai documents
 */
export const DEFAULT_FONT = 'Sarabun';

/**
 * Alternative font family for testing
 */
export const ALTERNATIVE_FONT = 'NotoSansThai';

/**
 * Font sizes used throughout documents
 */
export const FONT_SIZES = {
  title: 18,
  header: 14,
  subheader: 12,
  normal: 10,
  small: 9,
  tiny: 8,
} as const;

/**
 * Line heights for different contexts
 */
export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
} as const;
