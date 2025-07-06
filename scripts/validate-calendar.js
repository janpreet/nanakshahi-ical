#!/usr/bin/env node

/**
 * SGPC Calendar Data Validation Script
 *
 * Validates the calendar data for accuracy, consistency, and SGPC compliance.
 *
 * Usage: node scripts/validate-calendar.js [year]
 */

const sgpc = require('../sgpc-nanakshahi')

/**
 * Comprehensive calendar validation
 * @param {number} nanakshahiYear - Year to validate
 * @returns {Object} Validation results
 */
function validateCalendar (nanakshahiYear) {
  console.log(`🔍 Validating calendar data for Nanakshahi Year ${nanakshahiYear}...`)

  const results = {
    year: nanakshahiYear,
    passed: 0,
    failed: 0,
    warnings: 0,
    tests: [],
    summary: ''
  }

  // Test 1: Check if year has official data
  const status = sgpc.checkCalendarDataStatus(nanakshahiYear)
  results.tests.push({
    name: 'Official SGPC Data Available',
    passed: status.hasOfficialData,
    message: status.hasOfficialData
      ? '✅ Using official SGPC calendar data'
      : '⚠️  Using default calendar data - may not be accurate'
  })

  if (status.hasOfficialData) results.passed++
  else results.warnings++

  // Test 2: Month lengths validation
  const monthLengths = sgpc.getMonthLengths(nanakshahiYear)
  const validMonthLengths = monthLengths.every(length => length >= 28 && length <= 32)
  results.tests.push({
    name: 'Month Lengths Valid',
    passed: validMonthLengths,
    message: validMonthLengths
      ? '✅ All month lengths are within valid range (28-32 days)'
      : '❌ Some month lengths are outside valid range'
  })

  if (validMonthLengths) results.passed++
  else results.failed++

  // Test 3: Total days in year
  const totalDays = sgpc.getDaysInYear(nanakshahiYear)
  const validTotalDays = totalDays >= 365 && totalDays <= 366
  results.tests.push({
    name: 'Total Days Valid',
    passed: validTotalDays,
    message: validTotalDays
      ? `✅ Total days (${totalDays}) is within valid range`
      : `❌ Total days (${totalDays}) is outside valid range (365-366)`
  })

  if (validTotalDays) results.passed++
  else results.failed++

  // Test 4: Date conversion accuracy
  // Use a date that should be in the target Nanakshahi year (after March 20th)
  const testDate = new Date(nanakshahiYear + 1468, 3, 15) // April 15th of corresponding Gregorian year
  const convertedDate = sgpc.getNanakshahiDate(testDate)
  const validConversion = convertedDate && convertedDate.englishDate.year === nanakshahiYear
  results.tests.push({
    name: 'Date Conversion Accuracy',
    passed: validConversion,
    message: validConversion
      ? `✅ Date conversion working correctly (${testDate.toDateString()} = ${convertedDate.englishDate.date} ${convertedDate.englishDate.monthName} ${convertedDate.englishDate.year})`
      : '❌ Date conversion failed or returned incorrect year'
  })

  if (validConversion) results.passed++
  else results.failed++

  // Test 5: Gurpurab data consistency
  const allGurpurabs = sgpc.getAllGurpurabsForYear(nanakshahiYear)
  const validGurpurabs = allGurpurabs.length > 0 && allGurpurabs.every(g => g.en && g.pa)
  results.tests.push({
    name: 'Gurpurab Data Consistency',
    passed: validGurpurabs,
    message: validGurpurabs
      ? `✅ Found ${allGurpurabs.length} Gurpurabs with valid data`
      : '❌ Gurpurab data is missing or inconsistent'
  })

  if (validGurpurabs) results.passed++
  else results.failed++

  // Test 6: Key date validation (July 5th = Miri Piri Divas)
  const july5th = new Date(nanakshahiYear + 1468, 6, 5)
  const july5thGurpurabs = sgpc.getGurpurabsForDay(july5th)
  const hasMiriPiri = july5thGurpurabs.some(g => g.en.includes('Miri Piri'))
  results.tests.push({
    name: 'July 5th = Miri Piri Divas',
    passed: hasMiriPiri,
    message: hasMiriPiri
      ? '✅ July 5th correctly shows Miri Piri Divas'
      : '❌ July 5th does not show Miri Piri Divas (SGPC compliance issue)'
  })

  if (hasMiriPiri) results.passed++
  else results.failed++

  // Test 7: Jeth month length (context-specific)
  const jethLength = monthLengths[2] // Jeth is 3rd month (index 2)
  const expectedJethLength = (nanakshahiYear === 557) ? 32 : 31 // 2025 has 32 days
  const correctJethLength = jethLength === expectedJethLength
  results.tests.push({
    name: `Jeth ${nanakshahiYear} Length`,
    passed: correctJethLength,
    message: correctJethLength
      ? `✅ Jeth ${nanakshahiYear} has correct length (${jethLength} days)`
      : `❌ Jeth ${nanakshahiYear} has incorrect length (${jethLength} days, expected ${expectedJethLength})`
  })

  if (correctJethLength) results.passed++
  else results.failed++

  // Generate summary
  const totalTests = results.passed + results.failed + results.warnings
  if (results.failed === 0) {
    results.summary = `✅ All critical tests passed (${results.passed}/${totalTests})`
  } else {
    results.summary = `❌ ${results.failed} tests failed, ${results.passed} passed, ${results.warnings} warnings`
  }

  return results
}

/**
 * Display validation results
 * @param {Object} results - Validation results
 */
function displayResults (results) {
  console.log('\n📊 VALIDATION RESULTS')
  console.log('='.repeat(50))
  console.log(`📅 Year: ${results.year} (Gregorian: ${results.year + 1468})`)
  console.log(`📈 Summary: ${results.summary}`)
  console.log('')

  results.tests.forEach((test, index) => {
    const icon = test.passed ? '✅' : '❌'
    console.log(`${index + 1}. ${icon} ${test.name}`)
    console.log(`   ${test.message}`)
    console.log('')
  })

  console.log('='.repeat(50))
  console.log(`📊 Total: ${results.passed + results.failed + results.warnings} tests`)
  console.log(`✅ Passed: ${results.passed}`)
  console.log(`❌ Failed: ${results.failed}`)
  console.log(`⚠️  Warnings: ${results.warnings}`)

  if (results.failed > 0) {
    console.log('\n⚠️  CRITICAL ISSUES DETECTED')
    console.log('Please review and fix the failed tests before using this calendar data.')
  } else {
    console.log('\n🎉 VALIDATION SUCCESSFUL')
    console.log('Calendar data is ready for use!')
  }
}

/**
 * Main execution
 */
async function main () {
  try {
    const targetYear = process.argv[2]
      ? parseInt(process.argv[2])
      : new Date().getFullYear() - 1468 // Current Nanakshahi year

    console.log('🚀 SGPC Calendar Validation Starting...')
    console.log('='.repeat(50))

    const results = validateCalendar(targetYear)
    displayResults(results)

    // Exit with error code if validation failed
    process.exit(results.failed > 0 ? 1 : 0)
  } catch (error) {
    console.error('\n❌ Validation Error:')
    console.error(error.message)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = {
  validateCalendar,
  displayResults
}
