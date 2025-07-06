/**
 * Movable Gurpurabs Module
 * Based on nanakshahi-js approach with SGPC corrections
 */

const fs = require('fs')
const path = require('path')

// Load community corrections database
const correctionsPath = path.join(__dirname, '../sgpc-corrections.json')
let corrections = {}

try {
  corrections = JSON.parse(fs.readFileSync(correctionsPath, 'utf8'))
} catch (error) {
  console.warn('Warning: Could not load SGPC corrections database')
}

/**
 * Find movable Gurpurab date for a given year
 * @param {string} gurpurab - Gurpurab name (gurunanak, bandichhorr, holla, etc.)
 * @param {number} year - Gregorian year
 * @returns {Object} Gurpurab date and information
 */
function findMovableGurpurab (gurpurab, year = new Date().getFullYear()) {
  if (year < 2024 || year > 2035) {
    throw new RangeError('Year not in supported range [2024...2035]')
  }

  const movableGurpurabs = corrections.movableGurpurabs?.gurpurabs

  if (!movableGurpurabs || !movableGurpurabs[gurpurab]) {
    throw new Error(`Gurpurab "${gurpurab}" not found in movable Gurpurabs database`)
  }

  const gurpurabData = movableGurpurabs[gurpurab]
  const dateData = gurpurabData.dates[year.toString()]

  if (!dateData) {
    throw new Error(`Date not available for ${gurpurab} in year ${year}`)
  }

  return {
    gregorianDate: new Date(year, dateData.month - 1, dateData.day),
    name: {
      en: gurpurabData.description,
      pa: getGurmukhi(gurpurab),
      type: gurpurabData.type,
      movable: true
    },
    calculation: gurpurabData.calculation,
    year
  }
}

/**
 * Get all movable Gurpurabs for a given year
 * @param {number} year - Gregorian year
 * @returns {Array} Array of all movable Gurpurabs for the year
 */
function getMovableGurpurabsForYear (year = new Date().getFullYear()) {
  const movableGurpurabs = corrections.movableGurpurabs?.gurpurabs

  if (!movableGurpurabs) {
    return []
  }

  const results = []
  for (const gurpurab in movableGurpurabs) {
    try {
      const gurpurabInfo = findMovableGurpurab(gurpurab, year)
      results.push(gurpurabInfo)
    } catch (error) {
      console.warn(`Warning: Could not get ${gurpurab} for ${year}: ${error.message}`)
    }
  }

  return results
}

/**
 * Check if a date has any movable Gurpurabs
 * @param {Date} date - Date to check
 * @returns {Array} Array of Gurpurabs on this date
 */
function getMovableGurpurabsForDate (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const movableGurpurabs = corrections.movableGurpurabs?.gurpurabs

  if (!movableGurpurabs) {
    return []
  }

  const results = []
  for (const gurpurab in movableGurpurabs) {
    try {
      const gurpurabInfo = findMovableGurpurab(gurpurab, year)
      const gurpurabDate = gurpurabInfo.gregorianDate

      if (gurpurabDate.getMonth() + 1 === month && gurpurabDate.getDate() === day) {
        results.push(gurpurabInfo)
      }
    } catch (error) {
      // Skip if date not available
    }
  }

  return results
}

/**
 * Get Gurmukhi text for Gurpurab names
 * @param {string} gurpurab - Gurpurab name
 * @returns {string} Gurmukhi text
 */
function getGurmukhi (gurpurab) {
  const gurmukhiNames = {
    gurunanak: 'ਪ੍ਰਕਾਸ਼ ਸ੍ਰੀ ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ',
    bandichhorr: 'ਬੰਦੀ ਛੋੜ ਦਿਵਸ (ਦੀਵਾਲੀ)',
    holla: 'ਹੋਲਾ ਮਹੱਲਾ',
    kabeer: 'ਜਨਮ ਭਗਤ ਕਬੀਰ ਜੀ',
    ravidaas: 'ਜਨਮ ਭਗਤ ਰਵਿਦਾਸ ਜੀ',
    naamdev: 'ਜਨਮ ਭਗਤ ਨਾਮਦੇਵ ਜੀ'
  }

  return gurmukhiNames[gurpurab] || gurpurab
}

/**
 * Get prediction for future movable Gurpurabs
 * @param {string} gurpurab - Gurpurab name
 * @param {number} year - Future year
 * @returns {Object} Predicted date with confidence level
 */
function predictMovableGurpurab (gurpurab, year) {
  // This is a placeholder for lunar calculation algorithms
  // In practice, you'd use lunar calendar calculations

  return {
    predicted: true,
    confidence: 'low',
    method: 'lunar_calculation',
    note: 'Prediction based on lunar calendar - verify with SGPC'
  }
}

/**
 * Validate movable Gurpurabs data
 * @returns {Object} Validation results
 */
function validateMovableGurpurabs () {
  const movableGurpurabs = corrections.movableGurpurabs?.gurpurabs

  if (!movableGurpurabs) {
    return {
      valid: false,
      errors: ['No movable Gurpurabs data found']
    }
  }

  const errors = []
  const warnings = []

  for (const gurpurab in movableGurpurabs) {
    const data = movableGurpurabs[gurpurab]

    if (!data.dates) {
      errors.push(`${gurpurab}: No dates provided`)
      continue
    }

    // Check if dates are available for current and next few years
    const currentYear = new Date().getFullYear()
    for (let year = currentYear; year <= currentYear + 2; year++) {
      if (!data.dates[year.toString()]) {
        warnings.push(`${gurpurab}: No date available for ${year}`)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

module.exports = {
  findMovableGurpurab,
  getMovableGurpurabsForYear,
  getMovableGurpurabsForDate,
  predictMovableGurpurab,
  validateMovableGurpurabs,
  getGurmukhi
}
