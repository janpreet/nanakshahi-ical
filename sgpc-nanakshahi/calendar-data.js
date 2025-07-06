/**
 * SGPC Nanakshahi Calendar Data
 * Official source: Shiromani Gurdwara Parbandhak Committee (SGPC)
 *
 * The Nanakshahi calendar has variable month lengths from year to year
 * to maintain tropical year alignment with the solar year.
 */

// Nanakshahi month names
const NANAKSHAHI_MONTHS = {
  en: [
    'Chet', 'Vaisakh', 'Jeth', 'Harh', 'Sawan', 'Bhadon',
    'Assu', 'Kartik', 'Maghar', 'Poh', 'Magh', 'Phagan'
  ],
  pa: [
    'ਚੇਤ', 'ਵੈਸਾਖ', 'ਜੇਠ', 'ਹਾੜ', 'ਸਾਵਣ', 'ਭਾਦੋਂ',
    'ਅੱਸੂ', 'ਕੱਤਿਕ', 'ਮੱਘਰ', 'ਪੋਹ', 'ਮਾਘ', 'ਫੱਗਣ'
  ]
}

// Day names
const NANAKSHAHI_DAYS = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  pa: ['ਐਤਵਾਰ', 'ਸੋਮਵਾਰ', 'ਮੰਗਲਵਾਰ', 'ਬੁੱਧਵਾਰ', 'ਵੀਰਵਾਰ', 'ਸ਼ੁੱਕਰਵਾਰ', 'ਸ਼ਨੀਚਰਵਾਰ']
}

// Calendar Data sourced from SGPC Jantri - Month lengths by year
// Enhanced for accuracy (Janpreet Singh - not affiliated with SGPC)
// Key: Nanakshahi Year, Value: Array of month lengths [Chet, Vaisakh, Jeth, ...]
//
// 📅 ANNUAL UPDATE REQUIRED:
// This data needs to be updated annually with official SGPC calendar data
// Check: https://sgpc.net or official SGPC Nanakshahi calendar publications
//
// 🔄 How to update:
// 1. Get official SGPC calendar for new year
// 2. Add new year entry with correct month lengths
// 3. Update any corrections for existing years
//
const SGPC_MONTH_LENGTHS = {
  556: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30], // 2024
  557: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30], // 2025 - Jeth has 32 days
  558: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30], // 2026
  559: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30], // 2027
  560: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30], // 2028
  561: [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30] // 2029
  // 📝 TODO: Add entries for 2030+ as SGPC publishes official data
}

// Default month lengths (standard year)
const DEFAULT_MONTH_LENGTHS = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30]

// Nanakshahi Era start date (March 14, 1999 CE = 1 Chet 531 NS)
// Note: Using traditional Nanakshahi epoch date
// Will adjust calculations to match official SGPC calendar alignment
const NANAKSHAHI_EPOCH = new Date(1999, 2, 14) // March 14, 1999
const NANAKSHAHI_EPOCH_YEAR = 531 // The Nanakshahi year that corresponds to 1999 CE

/**
 * Get month lengths for a specific Nanakshahi year
 * @param {number} nanakshahiYear - The Nanakshahi year
 * @returns {number[]} Array of month lengths
 */
function getMonthLengths (nanakshahiYear) {
  return SGPC_MONTH_LENGTHS[nanakshahiYear] || DEFAULT_MONTH_LENGTHS
}

/**
 * Get total days in a Nanakshahi year
 * @param {number} nanakshahiYear - The Nanakshahi year
 * @returns {number} Total days in the year
 */
function getDaysInYear (nanakshahiYear) {
  const monthLengths = getMonthLengths(nanakshahiYear)
  return monthLengths.reduce((sum, days) => sum + days, 0)
}

/**
 * Check if calendar data needs updating
 * @param {number} nanakshahiYear - The Nanakshahi year to check
 * @returns {Object} Status object with warnings
 */
function checkCalendarDataStatus (nanakshahiYear) {
  const hasOfficialData = Object.prototype.hasOwnProperty.call(SGPC_MONTH_LENGTHS, nanakshahiYear)
  const latestYear = Math.max(...Object.keys(SGPC_MONTH_LENGTHS).map(Number))

  return {
    hasOfficialData,
    isUsingDefaults: !hasOfficialData,
    latestYear,
    needsUpdate: nanakshahiYear > latestYear,
    warning: !hasOfficialData
      ? `⚠️  No official SGPC data for year ${nanakshahiYear}. Using default month lengths. Calendar may drift from official SGPC calendar.`
      : null,
    updateMessage: nanakshahiYear > latestYear
      ? `📅 Calendar data needs updating! Latest data: ${latestYear}. Please update with official SGPC data for ${nanakshahiYear}.`
      : null
  }
}

module.exports = {
  NANAKSHAHI_MONTHS,
  NANAKSHAHI_DAYS,
  SGPC_MONTH_LENGTHS,
  DEFAULT_MONTH_LENGTHS,
  NANAKSHAHI_EPOCH,
  NANAKSHAHI_EPOCH_YEAR,
  getMonthLengths,
  getDaysInYear,
  checkCalendarDataStatus
}
