const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const ENGLISH_DIGITS_MAP = {
  '০': 0, '১': 1, '২': 2, '৩': 3, '৪': 4,
  '৫': 5, '৬': 6, '৭': 7, '৮': 8, '৯': 9
};

/**
 * Converts English digits (0-9) to Bengali digits (০-৯)
 * @param {string|number} input
 * @returns {string}
 */
export function toBengaliNumber(input) {
  if (input === null || input === undefined) return '';
  return String(input).replace(/[0-9]/g, (d) => BENGALI_DIGITS[Number(d)]);
}

/**
 * Converts Bengali digits (০-৯) to English digits (0-9)
 * @param {string} input
 * @returns {string}
 */
export function toEnglishNumber(input) {
  if (!input) return '';
  return String(input).replace(/[০-৯]/g, (d) => ENGLISH_DIGITS_MAP[d]);
}

/**
 * Formats a monetary amount in Bengali with comma separations and Taka symbol
 * @param {number|string} amount
 * @returns {string}
 */
export function formatBengaliCurrency(amount) {
  if (amount === null || amount === undefined || amount === '') return '৳০';
  const num = Number(amount);
  if (isNaN(num)) return `৳${toBengaliNumber(amount)}`;
  const formattedEn = num.toLocaleString('en-US');
  return `৳${toBengaliNumber(formattedEn)}`;
}

/**
 * Returns two-digit Bengali serial number (e.g. 1 -> "০১", 12 -> "১২")
 * @param {number|string} num
 * @returns {string}
 */
export function toBengaliSerial(num) {
  if (num === null || num === undefined) return '';
  const padded = String(num).padStart(2, '0');
  return toBengaliNumber(padded);
}

/**
 * Converts a date string or timestamp into Bengali numbers
 * @param {string} dateStr
 * @returns {string}
 */
export function toBengaliDate(dateStr) {
  if (!dateStr) return '';
  return toBengaliNumber(dateStr);
}

