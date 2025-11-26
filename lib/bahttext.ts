/**
 * Thai BAHTTEXT Converter
 * Converts numbers to Thai text (e.g., 5000 -> "ห้าพันบาทถ้วน")
 */

const THAI_NUMBERS = ["", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
const THAI_DIGITS = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

/**
 * Converts a number to Thai text (Baht)
 * @param amount - The amount to convert
 * @returns Thai text representation (e.g., "ห้าพันบาทถ้วน")
 */
export function bahttext(amount: number): string {
  if (amount === 0) {
    return "ศูนย์บาทถ้วน";
  }

  if (amount < 0) {
    return "ลบ" + bahttext(Math.abs(amount));
  }

  // Split into baht and satang
  const baht = Math.floor(amount);
  const satang = Math.round((amount - baht) * 100);

  let result = "";

  // Convert baht part
  if (baht > 0) {
    result = convertIntegerToThai(baht) + "บาท";
  }

  // Convert satang part
  if (satang > 0) {
    result += convertIntegerToThai(satang) + "สตางค์";
  } else {
    result += "ถ้วน";
  }

  return result;
}

/**
 * Converts an integer to Thai text
 */
function convertIntegerToThai(num: number): string {
  if (num === 0) return "";

  // Handle millions
  if (num >= 1000000) {
    const millions = Math.floor(num / 1000000);
    const remainder = num % 1000000;
    return convertIntegerToThai(millions) + "ล้าน" + convertIntegerToThai(remainder);
  }

  // Handle numbers less than a million
  let result = "";
  const digits = num.toString().split("").map(Number);
  const len = digits.length;

  for (let i = 0; i < len; i++) {
    const digit = digits[i];
    const position = len - i;

    if (digit === 0) {
      continue;
    }

    // Special case for 1 in tens position (สิบ not หนึ่งสิบ)
    if (position === 2 && digit === 1 && len === 2) {
      result += "สิบ";
      continue;
    }

    // Special case for 1 in units position after tens (เอ็ด not หนึ่ง)
    if (position === 1 && digit === 1 && len > 1) {
      result += "เอ็ด";
      continue;
    }

    // Special case for 2 in tens position (ยี่สิบ not สองสิบ)
    if (position === 2 && digit === 2) {
      result += "ยี่สิบ";
      continue;
    }

    // Regular number conversion
    result += THAI_NUMBERS[digit];

    // Add position word (except for units position)
    if (position > 1 && position <= 6) {
      result += THAI_DIGITS[position - 1];
    }
  }

  return result;
}

/**
 * Alternative export as BATHTEXT (Google Sheets compatible naming)
 */
export const BATHTEXT = bahttext;

/**
 * Format with currency symbol
 */
export function bahtTextWithSymbol(amount: number): string {
  return `(${bahttext(amount)})`;
}
