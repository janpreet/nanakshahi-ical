#!/usr/bin/env node

/**
 * SGPC Calendar Prediction System
 *
 * This script analyzes historical SGPC calendar patterns to predict
 * future calendar adjustments with confidence levels.
 *
 * Strategy:
 * 1. Analyze historical leap year patterns
 * 2. Identify recurring SGPC adjustments
 * 3. Generate predictions with confidence levels
 * 4. Provide recommendations for community verification
 */

const fs = require('fs')
const path = require('path')

const correctionsPath = path.join(__dirname, '../sgpc-corrections.json')
const corrections = JSON.parse(fs.readFileSync(correctionsPath, 'utf8'))

/**
 * Analyze historical patterns in SGPC calendar data
 * @returns {Object} Pattern analysis results
 */
function analyzeHistoricalPatterns () {
  const sgpcData = corrections.sgpcCorrections
  const patterns = {
    leapYears: [],
    monthLengthVariations: {},
    totalDaysPattern: [],
    corrections: []
  }

  // Analyze each year's data
  for (const [year, data] of Object.entries(sgpcData)) {
    const totalDays = data.monthLengths.reduce((sum, days) => sum + days, 0)

    patterns.totalDaysPattern.push({
      year: parseInt(year),
      totalDays,
      isLeap: totalDays === 366
    })

    if (totalDays === 366) {
      patterns.leapYears.push(parseInt(year))
    }

    // Track month length variations
    data.monthLengths.forEach((length, index) => {
      if (!patterns.monthLengthVariations[index]) {
        patterns.monthLengthVariations[index] = {}
      }
      if (!patterns.monthLengthVariations[index][length]) {
        patterns.monthLengthVariations[index][length] = 0
      }
      patterns.monthLengthVariations[index][length]++
    })

    // Track corrections
    if (data.corrections) {
      patterns.corrections.push({
        year: parseInt(year),
        corrections: data.corrections
      })
    }
  }

  return patterns
}

/**
 * Predict leap year pattern
 * @param {Array} historicalLeapYears - Array of known leap years
 * @returns {Object} Leap year prediction
 */
function predictLeapYearPattern (historicalLeapYears) {
  if (historicalLeapYears.length < 2) {
    return {
      pattern: 'insufficient_data',
      confidence: 'low',
      prediction: 'Unable to determine pattern'
    }
  }

  // Calculate intervals between leap years
  const intervals = []
  for (let i = 1; i < historicalLeapYears.length; i++) {
    intervals.push(historicalLeapYears[i] - historicalLeapYears[i - 1])
  }

  // Find most common interval
  const intervalCounts = {}
  intervals.forEach(interval => {
    intervalCounts[interval] = (intervalCounts[interval] || 0) + 1
  })

  const mostCommonInterval = Object.keys(intervalCounts).reduce((a, b) =>
    intervalCounts[a] > intervalCounts[b] ? a : b
  )

  return {
    pattern: `every_${mostCommonInterval}_years`,
    confidence: intervals.every(i => i === mostCommonInterval) ? 'high' : 'medium',
    intervals,
    mostCommonInterval: parseInt(mostCommonInterval),
    prediction: `Leap years occur approximately every ${mostCommonInterval} years`
  }
}

/**
 * Predict calendar for future years
 * @param {number} targetYear - Nanakshahi year to predict
 * @returns {Object} Prediction results
 */
function predictCalendar (targetYear) {
  const patterns = analyzeHistoricalPatterns()
  const leapYearPattern = predictLeapYearPattern(patterns.leapYears)

  // Predict if target year is leap year
  const lastLeapYear = Math.max(...patterns.leapYears)
  const yearsSinceLastLeap = targetYear - lastLeapYear
  const isLikelyLeap = yearsSinceLastLeap >= leapYearPattern.mostCommonInterval

  // Predict month lengths
  const predictedMonthLengths = []
  for (let month = 0; month < 12; month++) {
    const variations = patterns.monthLengthVariations[month]
    const mostCommonLength = Object.keys(variations).reduce((a, b) =>
      variations[a] > variations[b] ? a : b
    )

    let predictedLength = parseInt(mostCommonLength)

    // Apply leap year adjustment for Jeth (month 2)
    if (month === 2 && isLikelyLeap) {
      predictedLength = 32 // Jeth becomes 32 days in leap years
    }

    predictedMonthLengths.push(predictedLength)
  }

  const totalDays = predictedMonthLengths.reduce((sum, days) => sum + days, 0)

  return {
    targetYear,
    gregorianYear: targetYear + 1468,
    prediction: {
      monthLengths: predictedMonthLengths,
      totalDays,
      isLeapYear: isLikelyLeap,
      confidence: isLikelyLeap ? 'medium' : 'high'
    },
    reasoning: {
      leapYearPattern,
      yearsSinceLastLeap,
      basedOnYears: Object.keys(corrections.sgpcCorrections).map(Number)
    },
    recommendations: [
      'Verify against official SGPC calendar when available',
      'Monitor community reports for discrepancies',
      'Update predictions based on new SGPC data'
    ]
  }
}

/**
 * Generate predictions for next several years
 * @param {number} startYear - Starting Nanakshahi year
 * @param {number} count - Number of years to predict
 * @returns {Array} Array of predictions
 */
function generateMultiYearPredictions (startYear, count = 5) {
  const predictions = []

  for (let i = 0; i < count; i++) {
    const year = startYear + i
    const prediction = predictCalendar(year)
    predictions.push(prediction)
  }

  return predictions
}

/**
 * Validate predictions against known data
 * @returns {Object} Validation results
 */
function validatePredictions () {
  const knownYears = Object.keys(corrections.sgpcCorrections).map(Number)
  const results = []

  for (const year of knownYears) {
    const prediction = predictCalendar(year)
    const actual = corrections.sgpcCorrections[year]

    const accuracy = {
      year,
      monthLengthsMatch: JSON.stringify(prediction.prediction.monthLengths) === JSON.stringify(actual.monthLengths),
      totalDaysMatch: prediction.prediction.totalDays === actual.totalDays,
      leapYearMatch: prediction.prediction.isLeapYear === (actual.totalDays === 366)
    }

    accuracy.overallAccuracy = accuracy.monthLengthsMatch && accuracy.totalDaysMatch && accuracy.leapYearMatch

    results.push(accuracy)
  }

  const overallAccuracy = results.filter(r => r.overallAccuracy).length / results.length

  return {
    predictions: results,
    overallAccuracy,
    confidence: overallAccuracy > 0.8 ? 'high' : overallAccuracy > 0.6 ? 'medium' : 'low'
  }
}

/**
 * Main execution function
 */
async function main () {
  try {
    console.log('🔮 SGPC Calendar Prediction System')
    console.log('='.repeat(50))

    // Get target year from command line or default to next year
    const currentYear = new Date().getFullYear()
    const currentNanakshahiYear = currentYear - 1468
    const targetYear = process.argv[2]
      ? parseInt(process.argv[2])
      : currentNanakshahiYear + 1

    console.log(`🎯 Target Year: ${targetYear} NS (${targetYear + 1468} CE)`)
    console.log('')

    // Analyze historical patterns
    console.log('📊 Analyzing Historical Patterns...')
    const patterns = analyzeHistoricalPatterns()

    console.log(`📈 Leap Years Found: ${patterns.leapYears.join(', ')}`)
    console.log(`📈 Total Years Analyzed: ${Object.keys(corrections.sgpcCorrections).length}`)
    console.log('')

    // Generate prediction
    console.log('🔮 Generating Prediction...')
    const prediction = predictCalendar(targetYear)

    console.log(`📅 Predicted Calendar for ${targetYear} NS:`)
    console.log(`📊 Month Lengths: [${prediction.prediction.monthLengths.join(', ')}]`)
    console.log(`📊 Total Days: ${prediction.prediction.totalDays}`)
    console.log(`📊 Leap Year: ${prediction.prediction.isLeapYear ? 'Yes' : 'No'}`)
    console.log(`📊 Confidence: ${prediction.prediction.confidence}`)
    console.log('')

    // Show reasoning
    console.log('🧠 Reasoning:')
    console.log(`• Leap Year Pattern: ${prediction.reasoning.leapYearPattern.prediction}`)
    console.log(`• Years Since Last Leap: ${prediction.reasoning.yearsSinceLastLeap}`)
    console.log(`• Based on Years: ${prediction.reasoning.basedOnYears.join(', ')}`)
    console.log('')

    // Generate multi-year predictions
    console.log('📈 Multi-Year Predictions:')
    const multiYear = generateMultiYearPredictions(targetYear, 5)
    multiYear.forEach(pred => {
      console.log(`${pred.targetYear} NS: ${pred.prediction.totalDays} days, ${pred.prediction.isLeapYear ? 'Leap' : 'Regular'} (${pred.prediction.confidence} confidence)`)
    })
    console.log('')

    // Validate prediction accuracy
    console.log('✅ Validating Prediction Accuracy...')
    const validation = validatePredictions()
    console.log(`📊 Overall Accuracy: ${(validation.overallAccuracy * 100).toFixed(1)}%`)
    console.log(`📊 System Confidence: ${validation.confidence}`)
    console.log('')

    // Show recommendations
    console.log('💡 Recommendations:')
    prediction.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`)
    })
    console.log('')

    // Ask if user wants to save prediction
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    })

    const question = (prompt) => new Promise(resolve => readline.question(prompt, resolve))

    const savePrediction = await question('💾 Save prediction to corrections database? (y/N): ')

    if (savePrediction.toLowerCase() === 'y') {
      // Add prediction to corrections database
      corrections.sgpcCorrections[targetYear] = {
        gregorianYear: targetYear + 1468,
        monthLengths: prediction.prediction.monthLengths,
        totalDays: prediction.prediction.totalDays,
        source: 'predicted_from_pattern',
        validatedBy: 'pending',
        corrections: {
          july_5: 'miri_piri_divas'
        },
        notes: `Predicted based on historical pattern analysis. Confidence: ${prediction.prediction.confidence}`,
        prediction: {
          method: 'pattern_analysis',
          confidence: prediction.prediction.confidence,
          basedOnYears: prediction.reasoning.basedOnYears,
          generatedAt: new Date().toISOString()
        }
      }

      fs.writeFileSync(correctionsPath, JSON.stringify(corrections, null, 2))
      console.log('✅ Prediction saved to corrections database')
    } else {
      console.log('ℹ️  Prediction not saved')
    }

    readline.close()
  } catch (error) {
    console.error('')
    console.error('❌ Prediction failed:')
    console.error(error.message)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = {
  analyzeHistoricalPatterns,
  predictLeapYearPattern,
  predictCalendar,
  generateMultiYearPredictions,
  validatePredictions
}
