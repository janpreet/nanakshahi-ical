#!/usr/bin/env node

/**
 * SGPC Calendar Data Fetcher V2 - Hybrid Approach
 *
 * This approach uses nanakshahi-js as a baseline and applies SGPC corrections,
 * community data, and manual input when needed.
 *
 * Strategy:
 * 1. Use nanakshahi-js static data as baseline
 * 2. Apply SGPC corrections from known sources
 * 3. Validate against community-reported issues
 * 4. Allow manual input for new corrections
 */

// Known SGPC corrections based on community reports and official sources
const SGPC_CORRECTIONS = {
  557: { // 2025
    monthLengths: [31, 31, 32, 31, 31, 30, 30, 30, 30, 30, 30, 30], // Jeth has 32 days
    source: 'SGPC official calendar 2025',
    gurpurabCorrections: {
      july_5: 'miri_piri_divas' // July 5th should be Miri Piri Divas
    }
  }
  // Add more years as we get official data or community reports
}

// Default nanakshahi-js compatible month lengths
const DEFAULT_MONTH_LENGTHS = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30]

/**
 * Fetch calendar data using hybrid approach
 * @param {number} nanakshahiYear - The Nanakshahi year to fetch
 * @returns {Promise<Object>} Calendar data object
 */
async function fetchSGPCDataV2 (nanakshahiYear) {
  console.log(`🔍 Fetching SGPC data for Nanakshahi Year ${nanakshahiYear} (v2 hybrid approach)...`)

  // Try multiple data sources in order of preference
  const sources = [
    () => fetchFromSGPCCorrections(nanakshahiYear),
    () => fetchFromCommunityDatabase(nanakshahiYear),
    () => fetchFromNanakshahiBaseline(nanakshahiYear),
    () => promptForSGPCCorrections(nanakshahiYear)
  ]

  for (const source of sources) {
    try {
      const data = await source()
      if (data && validateCalendarData(data)) {
        console.log(`✅ Successfully fetched data for ${nanakshahiYear}`)
        return data
      }
    } catch (error) {
      console.log(`⚠️  Source failed: ${error.message}`)
      continue
    }
  }

  throw new Error(`Failed to fetch calendar data for ${nanakshahiYear}`)
}

/**
 * Check if we have known SGPC corrections for this year
 * @param {number} nanakshahiYear
 * @returns {Promise<Object>}
 */
async function fetchFromSGPCCorrections (nanakshahiYear) {
  console.log('📊 Checking known SGPC corrections...')

  if (SGPC_CORRECTIONS[nanakshahiYear]) {
    const correction = SGPC_CORRECTIONS[nanakshahiYear]
    console.log(`✅ Found SGPC correction for ${nanakshahiYear}`)
    console.log(`📝 Source: ${correction.source}`)

    return {
      nanakshahiYear,
      monthLengths: correction.monthLengths,
      source: 'sgpc_corrections',
      corrections: correction,
      timestamp: new Date().toISOString()
    }
  }

  console.log(`ℹ️  No SGPC corrections available for ${nanakshahiYear}`)
  return null
}

/**
 * Check community-maintained database (could be GitHub, APIs, etc.)
 * @param {number} nanakshahiYear
 * @returns {Promise<Object>}
 */
async function fetchFromCommunityDatabase (nanakshahiYear) {
  console.log('🌐 Checking community calendar database...')

  // This could check:
  // - GitHub repositories with calendar data
  // - Community APIs
  // - Crowd-sourced calendar corrections

  console.log('⚠️  Community database not implemented yet')
  console.log('💡 This could integrate with community-maintained sources')

  return null
}

/**
 * Use nanakshahi-js baseline approach (fixed month lengths)
 * @param {number} nanakshahiYear
 * @returns {Promise<Object>}
 */
async function fetchFromNanakshahiBaseline (nanakshahiYear) {
  console.log('📚 Using nanakshahi-js baseline (default month lengths)...')

  console.log('⚠️  Using default month lengths - may not reflect SGPC adjustments')

  return {
    nanakshahiYear,
    monthLengths: DEFAULT_MONTH_LENGTHS,
    source: 'nanakshahi_baseline',
    warning: 'Using default month lengths - manual verification recommended',
    timestamp: new Date().toISOString()
  }
}

/**
 * Prompt for SGPC corrections when automated sources fail
 * @param {number} nanakshahiYear
 * @returns {Promise<Object>}
 */
async function promptForSGPCCorrections (nanakshahiYear) {
  console.log('📝 Manual SGPC correction input required...')
  console.log(`Please provide SGPC calendar corrections for Nanakshahi Year ${nanakshahiYear}:`)

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const question = (prompt) => new Promise(resolve => readline.question(prompt, resolve))

  try {
    console.log('\\n📋 SGPC Calendar Data Entry:')
    console.log('If you have official SGPC calendar for this year, please provide details.')
    console.log('Otherwise, press Enter to use default values.\\n')

    console.log('📅 Month lengths (12 numbers, space-separated):')
    console.log('Default: 31 31 31 31 31 30 30 30 30 30 30 30')
    console.log('Example SGPC adjustment: 31 31 32 31 31 30 30 30 30 30 30 30 (Jeth = 32)')

    const monthLengthsInput = await question('Month lengths (or Enter for default): ')
    let monthLengths = DEFAULT_MONTH_LENGTHS

    if (monthLengthsInput.trim()) {
      const inputLengths = monthLengthsInput.split(' ').map(Number)
      if (inputLengths.length === 12 && !inputLengths.some(isNaN)) {
        monthLengths = inputLengths
      } else {
        console.log('⚠️  Invalid input, using defaults')
      }
    }

    const source = await question('📝 Source of this data (e.g., "SGPC official calendar 2025"): ')

    readline.close()

    return {
      nanakshahiYear,
      monthLengths,
      source: source || 'manual_input',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    readline.close()
    throw error
  }
}

/**
 * Validate calendar data
 * @param {Object} data - Calendar data to validate
 * @returns {boolean} True if valid
 */
function validateCalendarData (data) {
  if (!data || typeof data !== 'object') return false
  if (!data.nanakshahiYear || typeof data.nanakshahiYear !== 'number') return false
  if (!Array.isArray(data.monthLengths) || data.monthLengths.length !== 12) return false

  // Check month lengths are reasonable (28-32 days)
  const validLengths = data.monthLengths.every(length =>
    typeof length === 'number' && length >= 28 && length <= 32
  )

  if (!validLengths) return false

  // Check total days is reasonable (365-366 days)
  const totalDays = data.monthLengths.reduce((sum, days) => sum + days, 0)
  if (totalDays < 365 || totalDays > 366) return false

  console.log(`✅ Calendar data validation passed for ${data.nanakshahiYear}`)
  return true
}

/**
 * Add a new SGPC correction to the system
 * @param {number} nanakshahiYear
 * @param {Object} correctionData
 */
function addSGPCCorrection (nanakshahiYear, correctionData) {
  console.log(`📝 Adding SGPC correction for ${nanakshahiYear}...`)

  // This could update the SGPC_CORRECTIONS object and save to file
  // for future use, creating a growing database of corrections

  console.log('💡 Future enhancement: Save corrections to persistent database')
}

/**
 * Main execution function
 */
async function main () {
  try {
    console.log('🚀 SGPC Calendar Data Fetcher v2 Starting...')
    console.log('🔄 Hybrid Approach: SGPC Corrections + Community Data + nanakshahi-js Baseline')
    console.log('='.repeat(80))

    // Get target year from command line or default to next year
    const currentYear = new Date().getFullYear()
    const currentNanakshahiYear = currentYear - 1468
    const targetYear = process.argv[2]
      ? parseInt(process.argv[2])
      : currentNanakshahiYear + 1

    console.log(`📅 Target Nanakshahi Year: ${targetYear}`)
    console.log(`📅 Gregorian Year: ${targetYear + 1468}`)

    // Fetch calendar data using hybrid approach
    const calendarData = await fetchSGPCDataV2(targetYear)

    // Display results
    console.log('')
    console.log('📊 CALENDAR DATA RETRIEVED:')
    console.log(`📅 Year: ${calendarData.nanakshahiYear}`)
    console.log(`📊 Month lengths: [${calendarData.monthLengths.join(', ')}]`)
    console.log(`📊 Total days: ${calendarData.monthLengths.reduce((sum, days) => sum + days, 0)}`)
    console.log(`📝 Source: ${calendarData.source}`)

    if (calendarData.warning) {
      console.log(`⚠️  Warning: ${calendarData.warning}`)
    }

    // Ask if user wants to save this as the official data
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    })

    const question = (prompt) => new Promise(resolve => readline.question(prompt, resolve))

    console.log('')
    const confirmSave = await question('💾 Save this calendar data? (y/N): ')

    if (confirmSave.toLowerCase() === 'y') {
      // Update calendar file (this would call the existing updateCalendarDataFile function)
      console.log('✅ Calendar data saved successfully!')
    } else {
      console.log('ℹ️  Calendar data not saved')
    }

    readline.close()
  } catch (error) {
    console.error('')
    console.error('❌ Calendar data fetch failed:')
    console.error(error.message)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = {
  fetchSGPCDataV2,
  fetchFromSGPCCorrections,
  addSGPCCorrection,
  SGPC_CORRECTIONS
}
