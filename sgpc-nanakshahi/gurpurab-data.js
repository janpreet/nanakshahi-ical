/**
 * Enhanced Nanakshahi Gurpurab and Religious Event Data
 * Data source: SGPC Jantri Nanakshahi (https://sgpc.net)
 *
 * Enhanced using official SGPC calendar data:
 * - July 5th: Miri Piri Divas (per SGPC Jantri data)
 * - Dates aligned with SGPC published calendar
 * - Verified and enhanced for accuracy
 *
 * Maintainer: Janpreet Singh (not affiliated with SGPC)
 */

const { getGregorianDate } = require('./date-conversion')

// Fixed Gurpurab dates by Nanakshahi calendar
const GURPURAB_DATES = {
  // Guru Nanak Dev Ji
  '8_23': { // 23 Kartik
    en: 'Parkash Divas Guru Nanak Dev Ji',
    pa: 'ਪ੍ਰਕਾਸ਼ ਦਿਵਸ ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ',
    type: 'gurpurab'
  },
  '4_2': { // 2 Harh - Parkash Divas of Akal Takht
    en: 'Parkash Divas Sri Akal Takht Sahib',
    pa: 'ਸਿਰਹਾਣਾ ਦਿਵਸ ਸ੍ਰੀ ਅਕਾਲ ਤਖ਼ਤ ਸਾਹਿਬ',
    type: 'gurpurab'
  },
  '4_11': { // 11 Harh - Shaheedi Divas of Bhai Banda Singh Bahadur
    en: 'Shaheedi Divas Bhai Banda Singh Bahadur',
    pa: 'ਸ਼ਹੀਦੀ ਦਿਹਾੜਾ ਭਾਈ ਬੰਦਾ ਸਿੰਘ ਜੀ ਬਹਾਦਰ',
    type: 'gurpurab'
  },
  '4_15': { // 15 Harh - Barsi of Maharaja Ranjit Singh
    en: 'Barsi Maharaja Ranjit Singh Ji',
    pa: 'ਬਰਸੀ ਮਹਾਰਾਜਾ ਰਣਜੀਤ ਸਿੰਘ ਜੀ',
    type: 'celebration'
  },
  '4_21': { // 21 Harh - FIXED: This should be Miri Piri Divas (July 5th)
    en: 'Miri Piri Divas',
    pa: 'ਮੀਰੀ ਪੀਰੀ ਦਿਵਸ',
    type: 'gurpurab'
  },
  '4_25': { // 25 Harh - Shaheedi Divas of Bhai Mati Singh
    en: 'Shaheedi Divas Bhai Mati Singh Ji',
    pa: 'ਸ਼ਹੀਦੀ ਦਿਹਾੜਾ ਭਾਈ ਮਤੀ ਸਿੰਘ ਜੀ',
    type: 'gurpurab'
  },

  // Guru Angad Dev Ji
  '1_18': { // 18 Chet
    en: 'Parkash Divas Guru Angad Dev Ji',
    pa: 'ਪ੍ਰਕਾਸ਼ ਦਿਵਸ ਗੁਰੂ ਅੰਗਦ ਦੇਵ ਜੀ',
    type: 'gurpurab'
  },

  // Guru Amar Das Ji
  '2_23': { // 23 Vaisakh
    en: 'Parkash Divas Guru Amar Das Ji',
    pa: 'ਪ੍ਰਕਾਸ਼ ਦਿਵਸ ਗੁਰੂ ਅਮਰ ਦਾਸ ਜੀ',
    type: 'gurpurab'
  },

  // Guru Ram Das Ji
  '7_9': { // 9 Assu
    en: 'Parkash Divas Guru Ram Das Ji',
    pa: 'ਪ੍ਰਕਾਸ਼ ਦਿਵਸ ਗੁਰੂ ਰਾਮ ਦਾਸ ਜੀ',
    type: 'gurpurab'
  },

  // Guru Arjan Dev Ji
  '1_30': { // 30 Chet
    en: 'Parkash Divas Guru Arjan Dev Ji',
    pa: 'ਪ੍ਰਕਾਸ਼ ਦਿਵਸ ਗੁਰੂ ਅਰਜਨ ਦੇਵ ਜੀ',
    type: 'gurpurab'
  },
  '3_4': { // 4 Jeth
    en: 'Shaheedi Divas Guru Arjan Dev Ji',
    pa: 'ਸ਼ਹੀਦੀ ਦਿਵਸ ਗੁਰੂ ਅਰਜਨ ਦੇਵ ਜੀ',
    type: 'gurpurab'
  },

  // Guru Hargobind Sahib Ji - moved to correct month
  '5_21': { // 21 Sawan
    en: 'Parkash Divas Guru Hargobind Sahib Ji',
    pa: 'ਪ੍ਰਕਾਸ਼ ਦਿਵਸ ਗੁਰੂ ਹਰਗੋਬਿੰਦ ਸਾਹਿਬ ਜੀ',
    type: 'gurpurab'
  },

  // Guru Har Rai Ji
  '1_31': { // 31 Chet
    en: 'Parkash Divas Guru Har Rai Ji',
    pa: 'ਪ੍ਰਕਾਸ਼ ਦਿਵਸ ਗੁਰੂ ਹਰ ਰਾਇ ਜੀ',
    type: 'gurpurab'
  },

  // Guru Har Krishan Ji
  '5_23': { // 23 Sawan
    en: 'Parkash Divas Guru Har Krishan Ji',
    pa: 'ਪ੍ਰਕਾਸ਼ ਦਿਵਸ ਗੁਰੂ ਹਰ ਕ੍ਰਿਸ਼ਨ ਜੀ',
    type: 'gurpurab'
  },

  // Guru Tegh Bahadur Ji
  '1_5': { // 5 Chet
    en: 'Parkash Divas Guru Tegh Bahadur Ji',
    pa: 'ਪ੍ਰਕਾਸ਼ ਦਿਵਸ ਗੁਰੂ ਤੇਗ ਬਹਾਦੁਰ ਜੀ',
    type: 'gurpurab'
  },
  '9_24': { // 24 Maghar
    en: 'Shaheedi Divas Guru Tegh Bahadur Ji',
    pa: 'ਸ਼ਹੀਦੀ ਦਿਵਸ ਗੁਰੂ ਤੇਗ ਬਹਾਦੁਰ ਜੀ',
    type: 'gurpurab'
  },

  // Guru Gobind Singh Ji
  '10_23': { // 23 Poh
    en: 'Parkash Divas Guru Gobind Singh Ji',
    pa: 'ਪ੍ਰਕਾਸ਼ ਦਿਵਸ ਗੁਰੂ ਗੋਬਿੰਦ ਸਿੰਘ ਜੀ',
    type: 'gurpurab'
  },

  // Sahibzade - CRITICAL MISSING DATE
  '10_20': { // 20 Poh - Shaheedi Divas Sahibzade
    en: 'Shaheedi Divas Sahibzade',
    pa: 'ਸ਼ਹੀਦੀ ਦਿਵਸ ਸਾਹਿਬਜ਼ਾਦੇ',
    type: 'gurpurab'
  },

  // Guru Granth Sahib Ji
  '6_1': { // 1 Bhadon
    en: 'First Parkash of Sri Guru Granth Sahib Ji',
    pa: 'ਪਹਿਲਾ ਪ੍ਰਕਾਸ਼ ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ',
    type: 'gurpurab'
  },
  '7_7': { // 7 Assu
    en: 'Final Parkash of Sri Guru Granth Sahib Ji',
    pa: 'ਅੰਤਿਮ ਪ੍ਰਕਾਸ਼ ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ',
    type: 'gurpurab'
  },
  '7_18': { // 18 Assu - Gur Gaddi Divas
    en: 'Gur Gaddi Divas Sri Guru Granth Sahib Ji',
    pa: 'ਗੁਰ ਗੱਦੀ ਦਿਵਸ ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ',
    type: 'gurpurab'
  },

  // Other important dates
  '2_14': { // 14 Vaisakh
    en: 'Vaisakhi - Khalsa Panth Foundation',
    pa: 'ਵਿਸਾਖੀ - ਖਾਲਸਾ ਪੰਥ ਸਥਾਪਨਾ',
    type: 'gurpurab'
  },
  '2_1': { // 1 Vaisakh
    en: 'Nanakshahi New Year',
    pa: 'ਨਾਨਕਸ਼ਾਹੀ ਨਵਾਂ ਸਾਲ',
    type: 'celebration'
  },
  '5_16': { // 16 Sawan
    en: 'Raksha Bandhan',
    pa: 'ਰਾਖੀ',
    type: 'celebration'
  },
  '8_15': { // 15 Kartik
    en: 'Bandi Chhor Divas',
    pa: 'ਬੰਦੀ ਛੋੜ ਦਿਵਸ',
    type: 'gurpurab'
  },

  // Additional Important Sikh Martyrs and Heroes
  '8_5': { // 5 Kattak - Shaheedi Divas Bhai Taru Singh Ji
    en: 'Shaheedi Divas Bhai Taru Singh Ji',
    pa: 'ਸ਼ਹੀਦੀ ਦਿਵਸ ਭਾਈ ਤਾਰੂ ਸਿੰਘ ਜੀ',
    type: 'gurpurab'
  },
  '5_3': { // 3 Sawan - Shaheedi Divas Bhai Dayala Ji
    en: 'Shaheedi Divas Bhai Dayala Ji',
    pa: 'ਸ਼ਹੀਦੀ ਦਿਵਸ ਭਾਈ ਦਿਆਲਾ ਜੀ',
    type: 'gurpurab'
  },
  '12_7': { // 7 Phagan - Shaheedi Divas Chote Sahibzade
    en: 'Shaheedi Divas Chote Sahibzade',
    pa: 'ਸ਼ਹੀਦੀ ਦਿਵਸ ਛੋਟੇ ਸਾਹਿਬਜ਼ਾਦੇ',
    type: 'gurpurab'
  }
}

/**
 * Get Gurpurabs for a specific Gregorian date
 * @param {Date} gregorianDate - The Gregorian date to check
 * @returns {Array} Array of Gurpurabs on that date
 */
function getGurpurabsForDay (gregorianDate) {
  try {
    const { getNanakshahiDate } = require('./date-conversion')
    const nanakshahiDate = getNanakshahiDate(gregorianDate)

    if (!nanakshahiDate) {
      return []
    }

    const monthDay = `${nanakshahiDate.englishDate.month}_${nanakshahiDate.englishDate.date}`
    const gurpurab = GURPURAB_DATES[monthDay]

    return gurpurab ? [gurpurab] : []
  } catch (error) {
    console.error('Error getting Gurpurabs for day:', error)
    return []
  }
}

/**
 * Get all Gurpurabs for a specific Nanakshahi year
 * @param {number} nanakshahiYear - The Nanakshahi year
 * @returns {Array} Array of all Gurpurabs with their Gregorian dates
 */
function getAllGurpurabsForYear (nanakshahiYear) {
  const gurpurabs = []

  try {
    Object.keys(GURPURAB_DATES).forEach(monthDay => {
      const [month, day] = monthDay.split('_').map(Number)
      const gregorianDate = getGregorianDate(nanakshahiYear, month, day)

      if (gregorianDate) {
        gurpurabs.push({
          ...GURPURAB_DATES[monthDay],
          gregorianDate,
          nanakshahiDate: {
            year: nanakshahiYear,
            month,
            day
          }
        })
      }
    })
  } catch (error) {
    console.error('Error getting all Gurpurabs for year:', error)
  }

  return gurpurabs.sort((a, b) => a.gregorianDate - b.gregorianDate)
}

module.exports = {
  GURPURAB_DATES,
  getGurpurabsForDay,
  getAllGurpurabsForYear
}
