/**
 * Thai Text Fix Utility
 *
 * Automatically adds trailing spaces to Thai text to fix word-wrapping issues
 * in @react-pdf/renderer when rendering Thai characters.
 *
 * Problem: Thai text at the end of lines may get truncated in PDF generation
 * Solution: Add 2 trailing spaces to Thai text to prevent cutting
 */

/**
 * Checks if a string contains Thai characters
 * Thai Unicode range: U+0E00 to U+0E7F
 */
export function containsThai(text: string): boolean {
  const thaiPattern = /[\u0E00-\u0E7F]/;
  return thaiPattern.test(text);
}

/**
 * Adds trailing spaces to text if it contains Thai characters
 * @param text - The text to process
 * @param spaceCount - Number of trailing spaces to add (default: 2)
 * @returns Text with trailing spaces if Thai characters detected
 */
export function addThaiSpaces(text: string, spaceCount: number = 2): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  if (containsThai(text)) {
    // Add trailing spaces only if not already present
    const trimmed = text.trimEnd();
    const spaces = ' '.repeat(spaceCount);
    return trimmed + spaces;
  }

  return text;
}

/**
 * Processes a translation object to add Thai spaces automatically
 * @param translations - Object with 'th' and 'en' keys
 * @returns Processed translation object
 */
export function fixThaiTranslation(
  translations: Record<string, Record<'th' | 'en', string>>
): Record<string, Record<'th' | 'en', string>> {
  const fixed: Record<string, Record<'th' | 'en', string>> = {};

  for (const [key, value] of Object.entries(translations)) {
    fixed[key] = {
      th: addThaiSpaces(value.th),
      en: value.en,
    };
  }

  return fixed;
}

/**
 * Gets a translated value with automatic Thai spacing
 * @param translations - Translation object
 * @param key - Translation key
 * @param lang - Language ('th' or 'en')
 * @returns Translated text with Thai spacing applied
 */
export function getTranslation(
  translations: Record<string, Record<'th' | 'en', string>>,
  key: string,
  lang: 'th' | 'en' = 'th'
): string {
  const text = translations[key]?.[lang] || key;

  // Auto-fix Thai text
  if (lang === 'th') {
    return addThaiSpaces(text);
  }

  return text;
}

/**
 * Processes any string that might be displayed in PDF
 * Useful for dynamic content like addresses, names, descriptions
 * @param text - Text to process
 * @param lang - Language hint ('th' or 'en')
 * @returns Processed text with Thai spacing if needed
 */
export function processPdfText(text: string, lang?: 'th' | 'en'): string {
  if (!text) return text;

  // If language is explicitly 'en', don't add spaces
  if (lang === 'en') {
    return text;
  }

  // Auto-detect and fix Thai text
  if (containsThai(text)) {
    return addThaiSpaces(text);
  }

  return text;
}

/**
 * Example usage for translations without manual spacing:
 *
 * // Before (manual spacing):
 * const translations = {
 *   no: { th: "ลำดับ  ", en: "No." },
 *   description: { th: "รายการ  ", en: "Description" }
 * };
 *
 * // After (automatic spacing):
 * const rawTranslations = {
 *   no: { th: "ลำดับ", en: "No." },
 *   description: { th: "รายการ", en: "Description" }
 * };
 * const translations = fixThaiTranslation(rawTranslations);
 *
 * // Or use getTranslation directly:
 * const text = getTranslation(rawTranslations, 'no', 'th'); // Returns "ลำดับ  "
 */
