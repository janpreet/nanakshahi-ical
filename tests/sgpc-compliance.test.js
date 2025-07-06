/**
 * SGPC Compliance Tests
 * Automated validation against official SGPC calendar data
 */

const sgpcNanakshahi = require('../sgpc-nanakshahi')

describe('SGPC Compliance Tests', () => {
  
  describe('July 5th Correction', () => {
    test('July 5, 2025 should be Miri Piri Divas', () => {
      const date = new Date(2025, 6, 5) // July 5, 2025
      const gurpurabs = sgpcNanakshahi.getGurpurabsForDay(date)
      
      expect(gurpurabs).toContainEqual(
        expect.objectContaining({
          en: expect.stringMatching(/Miri.*Piri.*Divas/i),
          type: 'gurpurab'
        })
      )
    })
    
    test('July 5, 2025 should NOT be Parkash Divas', () => {
      const date = new Date(2025, 6, 5) // July 5, 2025
      const gurpurabs = sgpcNanakshahi.getGurpurabsForDay(date)
      
      expect(gurpurabs).not.toContainEqual(
        expect.objectContaining({
          en: expect.stringMatching(/Parkash.*Divas/i)
        })
      )
    })
  })
  
  describe('Jeth 2025 Month Length', () => {
    test('Jeth 2025 should have 32 days', () => {
      const calendarData = sgpcNanakshahi.getCalendarData(557) // NS 557 = 2025
      expect(calendarData.monthLengths[2]).toBe(32) // Jeth is 3rd month (index 2)
    })
    
    test('Total days in NS 557 should be 366', () => {
      const calendarData = sgpcNanakshahi.getCalendarData(557)
      const totalDays = calendarData.monthLengths.reduce((sum, days) => sum + days, 0)
      expect(totalDays).toBe(366)
    })
  })
  
  describe('Date Conversion Accuracy', () => {
    test('July 5, 2025 should convert to 21 Harh 557', () => {
      const gregorianDate = new Date(2025, 6, 5)
      const nanakshahiDate = sgpcNanakshahi.getNanakshahiDate(gregorianDate)
      
      expect(nanakshahiDate.englishDate.date).toBe(21)
      expect(nanakshahiDate.englishDate.monthName).toBe('Harh')
      expect(nanakshahiDate.englishDate.year).toBe(557)
    })
    
    test('Round-trip conversion should be accurate', () => {
      const originalDate = new Date(2025, 6, 5)
      const nanakshahiDate = sgpcNanakshahi.getNanakshahiDate(originalDate)
      const convertedBack = sgpcNanakshahi.getDateFromNanakshahi(
        nanakshahiDate.englishDate.date,
        nanakshahiDate.englishDate.month,
        nanakshahiDate.englishDate.year
      )
      
      // For calendar applications, date components should match (not exact timestamps)
      expect(convertedBack.getFullYear()).toBe(originalDate.getFullYear())
      expect(convertedBack.getMonth()).toBe(originalDate.getMonth())
      expect(convertedBack.getDate()).toBe(originalDate.getDate())
    })
  })
  
  describe('Movable Gurpurabs', () => {
    test('Should find Guru Nanak birthday for 2025', () => {
      const gurpurab = sgpcNanakshahi.findMovableGurpurab('gurunanak', 2025)
      expect(gurpurab).toBeDefined()
      expect(gurpurab.name.en).toContain('Guru Nanak')
      expect(gurpurab.gregorianDate).toBeInstanceOf(Date)
    })
    
    test('Should find Bandi Chhorr Divas for 2025', () => {
      const gurpurab = sgpcNanakshahi.findMovableGurpurab('bandichhorr', 2025)
      expect(gurpurab).toBeDefined()
      expect(gurpurab.name.en).toContain('Bandi Chhorr')
      expect(gurpurab.gregorianDate).toBeInstanceOf(Date)
    })
    
    test('Should validate movable gurpurabs data', () => {
      const validation = sgpcNanakshahi.validateMovableGurpurabs()
      expect(validation.valid).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })
  })
  
  describe('API Compatibility', () => {
    test('Should maintain nanakshahi-js API compatibility', () => {
      const date = new Date(2025, 6, 5)
      const result = sgpcNanakshahi.getNanakshahiDate(date)
      
      // Check structure matches nanakshahi-js
      expect(result).toHaveProperty('gregorianDate')
      expect(result).toHaveProperty('englishDate')
      expect(result).toHaveProperty('punjabiDate')
      expect(result).toHaveProperty('leapYear')
      
      // Check our enhancement
      expect(result).toHaveProperty('sgpcCompliant')
      expect(result.sgpcCompliant).toBe(true)
    })
    
    test('Should provide migration guide', () => {
      const guide = sgpcNanakshahi.getMigrationGuide()
      expect(guide).toHaveProperty('message')
      expect(guide).toHaveProperty('changes')
      expect(guide.changes.some(change => /july 5th/i.test(change))).toBe(true)
    })
  })
  
  describe('SGPC Compliance Status', () => {
    test('Should report SGPC compliance status', () => {
      const status = sgpcNanakshahi.getSGPCComplianceStatus()
      expect(status.sgpcCompliant).toBe(true)
      expect(status.corrections.july5Fixed).toBe(true)
      expect(status.corrections.jethLengthCorrected).toBe(true)
    })
  })
  
  describe('Data Validation', () => {
    test('Should validate calendar data for known years', () => {
      const years = [556, 557, 558]
      years.forEach(year => {
        const data = sgpcNanakshahi.getCalendarData(year)
        expect(data).toBeDefined()
        expect(data.monthLengths).toHaveLength(12)
        expect(data.monthLengths.every(length => length >= 28 && length <= 32)).toBe(true)
      })
    })
    
    test('Should handle edge cases gracefully', () => {
      expect(() => {
        sgpcNanakshahi.findMovableGurpurab('invalid', 2025)
      }).toThrow()
      
      expect(() => {
        sgpcNanakshahi.findMovableGurpurab('gurunanak', 2050)
      }).toThrow()
    })
  })
  
  describe('Performance Tests', () => {
    test('Date conversions should be fast', () => {
      const start = Date.now()
      
      for (let i = 0; i < 1000; i++) {
        const date = new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
        sgpcNanakshahi.getNanakshahiDate(date)
      }
      
      const duration = Date.now() - start
      expect(duration).toBeLessThan(1000) // Should complete 1000 conversions in under 1 second
    })
  })
  
  describe('SGPC Compliance Tests', () => {
    test('Should maintain SGPC calendar alignment', () => {
      // Test case: July 5th shows SGPC-specified event
      const july5 = new Date(2025, 6, 5)
      const gurpurabs = sgpcNanakshahi.getGurpurabsForDay(july5)
      const hasMiriPiri = gurpurabs.some(g => g.en.toLowerCase().includes('miri') && g.en.toLowerCase().includes('piri'))
      expect(hasMiriPiri).toBe(true)
      
      // Test case: Jeth 2025 follows SGPC calendar specification
      const jeth2025 = sgpcNanakshahi.getCalendarData(557)
      expect(jeth2025.monthLengths[2]).toBe(32) // Jeth (3rd month) per SGPC 2025 calendar
    })
  })
})

describe('Integration Tests', () => {
  test('Should work with real calendar generation', () => {
    // Test generating a full year of calendar data
    const year = 557 // NS 557 = 2025
    const calendarData = sgpcNanakshahi.getCalendarData(year)
    
    expect(calendarData).toBeDefined()
    expect(calendarData.monthLengths).toHaveLength(12)
    
    // Generate calendar for each month
    for (let month = 1; month <= 12; month++) {
      const monthData = sgpcNanakshahi.getGurpurabsForMonth(month, year)
      expect(Array.isArray(monthData)).toBe(true)
    }
  })
  
  test('Should handle iCal generation workflow', () => {
    // This would test the full workflow used in main.js
    const testDate = new Date(2025, 6, 5)
    const nanakshahiDate = sgpcNanakshahi.getNanakshahiDate(testDate)
    const gurpurabs = sgpcNanakshahi.getGurpurabsForDay(testDate)
    
    expect(nanakshahiDate).toBeDefined()
    expect(gurpurabs).toBeDefined()
    expect(gurpurabs.length).toBeGreaterThan(0)
  })
}) 