/**
 * SGPC Nanakshahi Calendar Package
 * Main module that exports all functions
 *
 * This package provides accurate Nanakshahi calendar functionality
 * based on official SGPC (Shiromani Gurdwara Parbandhak Committee) data.
 *
 * Key features:
 * - Accurate month lengths (e.g., Jeth 2025 has 32 days)
 * - Correct Gurpurab dates (e.g., July 5th is Miri Piri Divas)
 * - Full compatibility with nanakshahi-js API
 * - Movable Gurpurabs support
 * - Community-driven corrections database
 */

const {
  isValidNanakshahiDate
} = require('./date-conversion')

const {
  getAllGurpurabsForYear,
  GURPURAB_DATES
} = require('./gurpurab-data')

const {
  NANAKSHAHI_MONTHS,
  NANAKSHAHI_DAYS,
  SGPC_MONTH_LENGTHS,
  getMonthLengths,
  getDaysInYear,
  checkCalendarDataStatus
} = require('./calendar-data')

const movableGurpurabs = require('./movable-gurpurabs')
const apiCompatibility = require('./api-compatibility')

// Export all functions and constants
module.exports = {
  // Core SGPC-compliant date conversion functions (use API compatible versions)
  getNanakshahiDate: apiCompatibility.getNanakshahiDate,
  getGregorianDate: apiCompatibility.getDateFromNanakshahi,
  isValidNanakshahiDate,

  // Gurpurab functions (use API compatible versions)
  getGurpurabsForDay: apiCompatibility.getGurpurabsForDay,
  getAllGurpurabsForYear,

  // Calendar data
  NANAKSHAHI_MONTHS,
  NANAKSHAHI_DAYS,
  SGPC_MONTH_LENGTHS,
  GURPURAB_DATES,
  getMonthLengths,
  getDaysInYear,
  checkCalendarDataStatus,

  // Movable Gurpurabs (new)
  findMovableGurpurab: movableGurpurabs.findMovableGurpurab,
  getMovableGurpurabsForYear: movableGurpurabs.getMovableGurpurabsForYear,
  getMovableGurpurabsForDate: movableGurpurabs.getMovableGurpurabsForDate,
  validateMovableGurpurabs: movableGurpurabs.validateMovableGurpurabs,

  // nanakshahi-js Compatible API (for easy migration)
  getDateFromNanakshahi: apiCompatibility.getDateFromNanakshahi,
  getGurpurabsForMonth: apiCompatibility.getGurpurabsForMonth,

  // Enhanced SGPC functions
  getSGPCComplianceStatus: apiCompatibility.getSGPCComplianceStatus,
  getCalendarData: apiCompatibility.getCalendarData,
  validateDate: apiCompatibility.validateDate,
  getMigrationGuide: apiCompatibility.getMigrationGuide,

  // Utility functions
  toGurmukhiNum: apiCompatibility.toGurmukhiNum,

  // Web calendar helper functions
  generateCalendarData: (year) => {
    const monthLengths = getMonthLengths(year)
    const startDate = new Date(year + 1468, 2, 19) // March 19th of CE year

    const months = NANAKSHAHI_MONTHS.en.map((month, index) => {
      const monthStart = new Date(startDate)

      // Calculate cumulative days to get correct start date
      let cumulativeDays = 0
      for (let i = 0; i < index; i++) {
        cumulativeDays += monthLengths[i]
      }
      monthStart.setDate(monthStart.getDate() + cumulativeDays)

      return {
        name: month,
        punjabi: NANAKSHAHI_MONTHS.pa[index],
        days: monthLengths[index],
        startDate: monthStart
      }
    })

    const gurpurabs = getAllGurpurabsForYear(year)
    const movableGurpurabsList = movableGurpurabs.getMovableGurpurabsForYear(year)

    const gurpurabsData = [...gurpurabs, ...movableGurpurabsList].map(gurpurab => ({
      name: gurpurab.name,
      punjabi: gurpurab.punjabi || gurpurab.name,
      nanakshahi: gurpurab.nanakshahi || `${gurpurab.day} ${gurpurab.month} ${year}`,
      gregorian: gurpurab.gregorian || gurpurab.date,
      type: gurpurab.type || 'fixed',
      highlight: gurpurab.highlight || false,
      note: gurpurab.note
    }))

    return {
      year,
      ceYear: year + 1468,
      isLeapYear: (getDaysInYear(year) === 366),
      totalDays: getDaysInYear(year),
      months,
      gurpurabs: gurpurabsData
    }
  },

  isLeapYear: (year) => (getDaysInYear(year) === 366),
  getTotalDays: getDaysInYear
}
