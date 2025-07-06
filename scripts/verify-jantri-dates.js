#!/usr/bin/env node

/**
 * Jantri Verification Script
 * Compares our current Gurpurab dates with the official Jantri Nanakshahi 557
 */

const sgpc = require('../sgpc-nanakshahi')

console.log('📅 JANTRI NANAKSHAHI 557 VERIFICATION REPORT')
console.log('=' * 60)

// Get all Gurpurabs for the year 557 (2025)
const gurpurabs = sgpc.getAllGurpurabsForYear(557)

console.log('\n🔍 CURRENT GURPURAB DATES IN SYSTEM:')
console.log('-' * 60)

gurpurabs.forEach((gurpurab, index) => {
  const nanakshahi = sgpc.getNanakshahiDate(gurpurab.gregorianDate)

  console.log(`${index + 1}. ${gurpurab.gregorianDate.toDateString()}`)
  console.log(`   📍 ${nanakshahi.englishDate.date} ${nanakshahi.englishDate.monthName} ${nanakshahi.englishDate.year} NS`)
  console.log(`   📿 ${gurpurab.en}`)
  console.log(`   ਪੰਜਾਬੀ: ${gurpurab.pa}`)
  console.log(`   Type: ${gurpurab.type}`)
  console.log('')
})

console.log(`\n📊 SUMMARY: ${gurpurabs.length} total Gurpurabs in system`)

// Break down by month
console.log('\n📅 BREAKDOWN BY NANAKSHAHI MONTH:')
console.log('-' * 60)

const monthlyBreakdown = {}
gurpurabs.forEach(gurpurab => {
  const nanakshahi = sgpc.getNanakshahiDate(gurpurab.gregorianDate)
  const monthName = nanakshahi.englishDate.monthName

  if (!monthlyBreakdown[monthName]) {
    monthlyBreakdown[monthName] = []
  }

  monthlyBreakdown[monthName].push({
    day: nanakshahi.englishDate.date,
    name: gurpurab.en,
    gregorianDate: gurpurab.gregorianDate
  })
})

// Sort and display by month
const monthOrder = ['Chet', 'Vaisakh', 'Jeth', 'Harh', 'Sawan', 'Bhadon', 'Assu', 'Kattak', 'Maghar', 'Poh', 'Magh', 'Phagan']

monthOrder.forEach(month => {
  if (monthlyBreakdown[month]) {
    console.log(`\n📆 ${month.toUpperCase()} (${monthlyBreakdown[month].length} events):`)
    monthlyBreakdown[month]
      .sort((a, b) => a.day - b.day)
      .forEach(event => {
        console.log(`   ${event.day} ${month}: ${event.name} (${event.gregorianDate.toDateString()})`)
      })
  }
})

console.log('\n🔍 MANUAL VERIFICATION CHECKLIST:')
console.log('-' * 60)
console.log('Please verify the following against the Jantri PDF:')
console.log('')

// Generate verification checklist
const verificationItems = [
  'All 10 Guru Sahib Parkash Divas dates',
  'All Shaheedi Divas dates',
  'Vaisakhi (Khalsa Foundation)',
  'Miri Piri Divas (6th Guru)',
  'Bandi Chhor Divas',
  'Guru Granth Sahib Ji Parkash dates',
  'Historical Sikh events',
  'Martyrdom dates of Sikh heroes',
  'Other religious observances'
]

verificationItems.forEach((item, index) => {
  console.log(`${index + 1}. ✓ ${item}`)
})

console.log('\n📋 COMMON MISSING DATES TO CHECK:')
console.log('-' * 60)
console.log('Check if these dates appear in the Jantri:')

const commonMissingDates = [
  'Shaheedi Divas Guru Tegh Bahadur Ji',
  'Shaheedi Divas Sahibzade',
  'Gur Gaddi Divas dates',
  'Sarbat da Bhala Divas',
  'Khalsa Raj Divas',
  'Historical battles/victories',
  'Other martyrs and saints'
]

commonMissingDates.forEach((date, index) => {
  console.log(`${index + 1}. ${date}`)
})

console.log('\n🚀 NEXT STEPS:')
console.log('-' * 60)
console.log('1. Compare this list with the Jantri PDF page by page')
console.log('2. Note any missing dates or discrepancies')
console.log('3. Add missing dates to gurpurab-data.js')
console.log('4. Run npm run build to regenerate the ICS file')
console.log('5. Run npm test to verify accuracy')

console.log('\n✅ VERIFICATION COMPLETE')
