const THAI_NUMBERS = ["", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
const THAI_DIGITS = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

function convertIntegerToThai(num) {
  if (num === 0) return "";
  if (num >= 1000000) {
    const millions = Math.floor(num / 1000000);
    const remainder = num % 1000000;
    return convertIntegerToThai(millions) + "ล้าน" + convertIntegerToThai(remainder);
  }
  let result = "";
  const digits = num.toString().split("").map(Number);
  const len = digits.length;
  for (let i = 0; i < len; i++) {
    const digit = digits[i];
    const position = len - i;
    if (digit === 0) continue;
    if (position === 2 && digit === 1 && len === 2) {
      result += "สิบ";
      continue;
    }
    if (position === 1 && digit === 1 && len > 1) {
      result += "เอ็ด";
      continue;
    }
    if (position === 2 && digit === 2) {
      result += "ยี่สิบ";
      continue;
    }
    result += THAI_NUMBERS[digit];
    if (position > 1 && position <= 6) {
      result += THAI_DIGITS[position - 1];
    }
  }
  return result;
}

function bahttext(amount) {
  if (amount === 0) return "ศูนย์บาทถ้วน";
  const baht = Math.floor(amount);
  const satang = Math.round((amount - baht) * 100);
  let result = "";
  if (baht > 0) result = convertIntegerToThai(baht) + "บาท";
  if (satang > 0) result += convertIntegerToThai(satang) + "สตางค์";
  else result += "ถ้วน";
  return result;
}

console.log("🧪 Testing BAHTTEXT\n");
[5000, 15000, 25000, 50000, 100000].forEach(amt => {
  console.log(`฿${amt.toLocaleString()} → ${bahttext(amt)}`);
});
