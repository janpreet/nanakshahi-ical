/**
 * SGPC Nanakshahi Date Conversion Functions
 * Converts between Gregorian and Nanakshahi dates using official SGPC calendar data
 */

const {
  NANAKSHAHI_MONTHS,
  NANAKSHAHI_DAYS,
  NANAKSHAHI_EPOCH,
  NANAKSHAHI_EPOCH_YEAR,
  getMonthLengths,
  getDaysInYear
} = require('./calendar-data')

const {
  getSGPCAlignedNanakshahiDate,
  getSGPCAlignedGregorianDate
} = require('./sgpc-date-alignment')

/**
 * Convert Gregorian date to Nanakshahi date
 * @param {Date} gregorianDate - The Gregorian date to convert
 * @returns {Object|null} Nanakshahi date object or null if invalid
 */
function getNanakshahiDate (gregorianDate) {
  try {
    if (!gregorianDate || !(gregorianDate instanceof Date)) {
      return null
    }

    // Use precise SGPC alignment for year 2025 (557 NS)
    if (gregorianDate.getFullYear() === 2025) {
      const sgpcResult = getSGPCAlignedNanakshahiDate(gregorianDate)
      if (sgpcResult) {
        // Get day of week from original date
        const dayOfWeek = gregorianDate.getDay()

        return {
          englishDate: {
            date: sgpcResult.day,
            month: sgpcResult.month,
            monthName: sgpcResult.monthName,
            year: sgpcResult.year,
            day: NANAKSHAHI_DAYS.en[dayOfWeek]
          },
          punjabiDate: {
            date: sgpcResult.day,
            month: sgpcResult.month,
            monthName: NANAKSHAHI_MONTHS.pa[sgpcResult.month - 1],
            year: sgpcResult.year,
            day: NANAKSHAHI_DAYS.pa[dayOfWeek]
          }
        }
      }
    }

    // Fall back to standard calculation for other years
    // Normalize to midnight UTC for consistent calculations
    const normalizedDate = new Date(Date.UTC(gregorianDate.getFullYear(), gregorianDate.getMonth(), gregorianDate.getDate()))
    const normalizedEpoch = new Date(Date.UTC(NANAKSHAHI_EPOCH.getFullYear(), NANAKSHAHI_EPOCH.getMonth(), NANAKSHAHI_EPOCH.getDate()))

    // Calculate days since Nanakshahi epoch
    const daysSinceEpoch = Math.floor((normalizedDate - normalizedEpoch) / (1000 * 60 * 60 * 24))

    // Apply SGPC calendar alignment offset (13 days)
    // Official SGPC calendar: March 20, 2025 = 1 Chet 557 NS
    const SGPC_ALIGNMENT_OFFSET = 13
    const adjustedDaysSinceEpoch = daysSinceEpoch - SGPC_ALIGNMENT_OFFSET

    if (adjustedDaysSinceEpoch < 0) {
      return null // Before Nanakshahi era
    }

    // Find the Nanakshahi year
    let nanakshahiYear = NANAKSHAHI_EPOCH_YEAR
    let remainingDays = adjustedDaysSinceEpoch

    while (remainingDays >= getDaysInYear(nanakshahiYear)) {
      remainingDays -= getDaysInYear(nanakshahiYear)
      nanakshahiYear++
    }

    // Find the month and day
    const monthLengths = getMonthLengths(nanakshahiYear)
    let month = 0
    let day = remainingDays + 1 // Days are 1-indexed

    for (let i = 0; i < monthLengths.length; i++) {
      if (day <= monthLengths[i]) {
        month = i
        break
      }
      day -= monthLengths[i]
    }

    // Get day of week from original date
    const dayOfWeek = gregorianDate.getDay()

    return {
      englishDate: {
        date: day,
        month: month + 1,
        monthName: NANAKSHAHI_MONTHS.en[month],
        year: nanakshahiYear,
        day: NANAKSHAHI_DAYS.en[dayOfWeek]
      },
      punjabiDate: {
        date: day,
        month: month + 1,
        monthName: NANAKSHAHI_MONTHS.pa[month],
        year: nanakshahiYear,
        day: NANAKSHAHI_DAYS.pa[dayOfWeek]
      }
    }
  } catch (error) {
    console.error('Error converting Gregorian to Nanakshahi date:', error)
    return null
  }
}

/**
 * Convert Nanakshahi date to Gregorian date
 * @param {number} nanakshahiYear - Nanakshahi year
 * @param {number} month - Month (1-12)
 * @param {number} day - Day of month
 * @returns {Date|null} Gregorian date or null if invalid
 */
function getGregorianDate (nanakshahiYear, month, day) {
  try {
    if (nanakshahiYear < 1 || month < 1 || month > 12 || day < 1) {
      return null
    }

    // Use precise SGPC alignment for year 557 (2025)
    if (nanakshahiYear === 557) {
      return getSGPCAlignedGregorianDate(nanakshahiYear, month, day)
    }

    // Fall back to standard calculation for other years
    const monthLengths = getMonthLengths(nanakshahiYear)

    if (day > monthLengths[month - 1]) {
      return null // Day exceeds month length
    }

    // Calculate total days since epoch
    let totalDays = 0

    // Add days for complete years
    for (let year = NANAKSHAHI_EPOCH_YEAR; year < nanakshahiYear; year++) {
      totalDays += getDaysInYear(year)
    }

    // Add days for complete months in the current year
    for (let i = 0; i < month - 1; i++) {
      totalDays += monthLengths[i]
    }

    // Add days for the current month (subtract 1 because day 1 = 0 days offset)
    totalDays += day - 1

    // Apply SGPC calendar alignment offset (13 days)
    const SGPC_ALIGNMENT_OFFSET = 13
    const adjustedTotalDays = totalDays + SGPC_ALIGNMENT_OFFSET

    // Calculate Gregorian date by adding days to UTC epoch
    const normalizedEpoch = new Date(Date.UTC(NANAKSHAHI_EPOCH.getFullYear(), NANAKSHAHI_EPOCH.getMonth(), NANAKSHAHI_EPOCH.getDate()))
    const utcResult = new Date(normalizedEpoch.getTime() + adjustedTotalDays * 24 * 60 * 60 * 1000)

    // Convert back to local timezone date with same year/month/day
    const gregorianDate = new Date(utcResult.getUTCFullYear(), utcResult.getUTCMonth(), utcResult.getUTCDate())

    return gregorianDate
  } catch (error) {
    console.error('Error converting Nanakshahi to Gregorian date:', error)
    return null
  }
}

/**
 * Check if a given Nanakshahi date is valid
 * @param {number} nanakshahiYear - Nanakshahi year
 * @param {number} month - Month (1-12)
 * @param {number} day - Day of month
 * @returns {boolean} True if valid, false otherwise
 */
function isValidNanakshahiDate (nanakshahiYear, month, day) {
  if (nanakshahiYear < NANAKSHAHI_EPOCH_YEAR || month < 1 || month > 12 || day < 1) {
    return false
  }

  const monthLengths = getMonthLengths(nanakshahiYear)
  return day <= monthLengths[month - 1]
}

module.exports = {
  getNanakshahiDate,
  getGregorianDate,
  isValidNanakshahiDate
}
