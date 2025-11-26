/**
 * Thai PDF Text Fix Utility
 *
 * This utility fixes Thai text line-breaking issues in PDF generation
 * by inserting Unicode control characters to prevent unwanted breaks
 * between Thai text and numbers (especially postal codes).
 *
 * The problem: Thai text followed by numbers (e.g., "จังหวัดขอนแก่น 40000")
 * gets broken at the Thai/number boundary, showing "400" instead of "40000".
 *
 * Solutions tested:
 * 1. Zero-Width Non-Joiner (ZWNJ) - U+200C
 * 2. Zero-Width Joiner (ZWJ) - U+200D
 * 3. Word Joiner (WJ) - U+2060
 * 4. No-Break Space (NBSP) - U+00A0
 * 5. Narrow No-Break Space (NNBSP) - U+202F
 */

/**
 * Unicode control characters for preventing line breaks
 */
export const UNICODE_CHARS = {
  // Zero-Width Non-Joiner - prevents joining but allows break
  ZWNJ: '\u200C',

  // Zero-Width Joiner - forces joining
  ZWJ: '\u200D',

  // Word Joiner - prevents line break (invisible)
  WJ: '\u2060',

  // No-Break Space - prevents line break (visible space)
  NBSP: '\u00A0',

  // Narrow No-Break Space - narrower non-breaking space
  NNBSP: '\u202F',

  // Zero-Width Space - allows break (opposite of WJ)
  ZWSP: '\u200B',
} as const;

/**
 * Detect if text contains Thai characters
 */
export function containsThai(text: string): boolean {
  // Thai Unicode range: U+0E00 to U+0E7F
  return /[\u0E00-\u0E7F]/.test(text);
}

/**
 * Detect if text contains numbers
 */
export function containsNumbers(text: string): boolean {
  return /\d/.test(text);
}

/**
 * Solution 1: Insert Word Joiner before numbers following Thai text
 * This prevents line breaks between Thai text and numbers
 */
export function fixThaiNumberBoundary(text: string): string {
  if (!text) return text;

  // Insert Word Joiner (U+2060) before numbers that follow Thai characters
  // Pattern: Thai character + optional space + number
  return text.replace(
    /([\u0E00-\u0E7F])\s+(\d)/g,
    `$1${UNICODE_CHARS.WJ} $2`
  );
}

/**
 * Solution 2: Replace regular spaces with No-Break Spaces in Thai text
 * This prevents any line breaks in Thai phrases
 */
export function fixThaiSpaces(text: string): string {
  if (!text || !containsThai(text)) return text;

  // Replace spaces between Thai characters with NBSP
  return text.replace(
    /([\u0E00-\u0E7F])\s+([\u0E00-\u0E7F])/g,
    `$1${UNICODE_CHARS.NBSP}$2`
  );
}

/**
 * Solution 3: Protect postal codes (5-digit numbers at end of string)
 * by adding Word Joiners around them
 */
export function protectPostalCodes(text: string): string {
  if (!text) return text;

  // Find 5-digit postal codes (optionally preceded by Thai text)
  // and wrap them with Word Joiners
  return text.replace(
    /([\u0E00-\u0E7F\s]+)(\d{5})(?=\s*$)/g,
    `$1${UNICODE_CHARS.WJ}$2${UNICODE_CHARS.WJ}`
  );
}

/**
 * Solution 4: Comprehensive fix - combines multiple strategies
 */
export function fixThaiPdfText(text: string): string {
  if (!text) return text;

  let result = text;

  // Step 1: Protect postal codes
  if (containsThai(result) && containsNumbers(result)) {
    result = protectPostalCodes(result);
  }

  // Step 2: Fix Thai-number boundaries
  if (containsThai(result) && containsNumbers(result)) {
    result = fixThaiNumberBoundary(result);
  }

  return result;
}

/**
 * Solution 5: Add trailing no-break spaces (original workaround)
 * This is the fallback if Unicode control characters don't work
 */
export function addTrailingSpaces(text: string, count: number = 2): string {
  if (!text) return text;
  return text.trimEnd() + UNICODE_CHARS.NBSP.repeat(count);
}

/**
 * Process address text specifically for PDF rendering
 * Applies all fixes to ensure postal codes and Thai text render correctly
 */
export function fixAddressForPdf(address: string): string {
  if (!address) return address;

  // Apply comprehensive fix
  let result = fixThaiPdfText(address);

  // If address ends with numbers (likely postal code), add protection
  if (/\d{5}\s*$/.test(result)) {
    // Add word joiner before the last number sequence
    result = result.replace(/(\s)(\d{5})\s*$/, `$1${UNICODE_CHARS.WJ}$2`);
  }

  return result;
}

/**
 * Process all text fields in a document for PDF rendering
 */
export function processDocumentForPdf<T extends Record<string, any>>(
  doc: T,
  fieldsToFix: (keyof T)[]
): T {
  const result = { ...doc };

  for (const field of fieldsToFix) {
    const value = result[field];
    if (typeof value === 'string') {
      result[field] = fixThaiPdfText(value) as any;
    }
  }

  return result;
}

/**
 * Alternative: Use HTML entities approach
 * Some PDF libraries might handle HTML entities better
 */
export function useHtmlEntities(text: string): string {
  if (!text) return text;

  // Replace spaces with &nbsp; entity
  return text.replace(/\s/g, '&nbsp;');
}

/**
 * Debug function: Show invisible characters in text
 */
export function debugInvisibleChars(text: string): string {
  return text
    .replace(/\u200C/g, '[ZWNJ]')
    .replace(/\u200D/g, '[ZWJ]')
    .replace(/\u2060/g, '[WJ]')
    .replace(/\u00A0/g, '[NBSP]')
    .replace(/\u202F/g, '[NNBSP]')
    .replace(/\u200B/g, '[ZWSP]');
}

/**
 * Test function: Try different solutions and return all variants
 */
export function getTestVariants(text: string) {
  return {
    original: text,
    wordJoiner: fixThaiNumberBoundary(text),
    noBreakSpaces: fixThaiSpaces(text),
    postalCodeProtection: protectPostalCodes(text),
    comprehensive: fixThaiPdfText(text),
    addressFix: fixAddressForPdf(text),
    trailingSpaces: addTrailingSpaces(text),
    htmlEntities: useHtmlEntities(text),
  };
}

/**
 * Recommended approach for production use
 */
export function fixForPdfProduction(text: string, type: 'address' | 'general' = 'general'): string {
  if (!text) return text;

  if (type === 'address') {
    return fixAddressForPdf(text);
  }

  return fixThaiPdfText(text);
}

/**
 * Export for use in PDF generation
 */
export default {
  fixThaiPdfText,
  fixAddressForPdf,
  processDocumentForPdf,
  fixForPdfProduction,
  containsThai,
  containsNumbers,
  getTestVariants,
  debugInvisibleChars,
  UNICODE_CHARS,
};
