#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const sgpc = require('../sgpc-nanakshahi')

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, '../dist')
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true })
}

// Generate web calendar data
console.log('🌐 Building web calendar...')
console.log('📅 Generating calendar data for web display...')
console.log('✨ Creating beautiful interactive calendar...')

// Get current Nanakshahi year
const currentDate = new Date()
const currentNanakshahiYear = currentDate.getFullYear() - 1468

// Generate calendar data for web display using the correct function
const calendarDataFromSGPC = sgpc.generateCalendarData(currentNanakshahiYear)

const calendarData = {
  metadata: {
    generated: new Date().toISOString(),
    nanakshahiYear: currentNanakshahiYear,
    description: 'Enhanced Nanakshahi Calendar'
  },
  months: [],
  gurpurabs: [],
  statistics: {
    totalGurpurabs: 0,
    sgpcCompliant: true,
    corrections: {
      july5Fixed: true,
      jethLength: 32
    }
  }
}

// Generate month data from SGPC data
calendarData.months = calendarDataFromSGPC.months.map((month, index) => ({
  index: index + 1,
  name: month.name,
  nameGurmukhi: month.punjabi,
  days: month.days,
  startDate: month.startDate.toISOString(),
  endDate: new Date(month.startDate.getTime() + (month.days * 24 * 60 * 60 * 1000)).toISOString()
}))

// Get all Gurpurabs for the year
const allGurpurabs = sgpc.getAllGurpurabsForYear(currentNanakshahiYear)
calendarData.gurpurabs = allGurpurabs.map(gurpurab => {
  const nanakshahiDate = sgpc.getNanakshahiDate(gurpurab.gregorianDate)
  return {
    gregorianDate: gurpurab.gregorianDate.toISOString(),
    nanakshahiDate: {
      day: nanakshahiDate.englishDate.date,
      month: nanakshahiDate.englishDate.monthName,
      year: nanakshahiDate.englishDate.year
    },
    name: {
      en: gurpurab.en,
      pa: gurpurab.pa
    },
    type: gurpurab.type,
    sgpcCompliant: true
  }
})

calendarData.statistics.totalGurpurabs = allGurpurabs.length

// Write calendar data as JavaScript module
const webCalendarJS = `
// Enhanced Nanakshahi Calendar Data
// Generated: ${new Date().toISOString()}
// Project by Janpreet Singh (using SGPC Jantri data)

const NANAKSHAHI_CALENDAR_DATA = ${JSON.stringify(calendarData, null, 2)}

// Export for use in web calendar
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NANAKSHAHI_CALENDAR_DATA
} else if (typeof window !== 'undefined') {
  window.NANAKSHAHI_CALENDAR_DATA = NANAKSHAHI_CALENDAR_DATA
}
`

fs.writeFileSync(path.join(distDir, 'web-calendar.js'), webCalendarJS)

// Copy index.html to dist
if (fs.existsSync(path.join(__dirname, '../index.html'))) {
  fs.copyFileSync(path.join(__dirname, '../index.html'), path.join(distDir, 'index.html'))
}

// Copy comparison.html to dist
if (fs.existsSync(path.join(__dirname, '../comparison.html'))) {
  fs.copyFileSync(path.join(__dirname, '../comparison.html'), path.join(distDir, 'comparison.html'))
} else if (fs.existsSync(path.join(__dirname, '../official-calendar-comparison.html'))) {
  fs.copyFileSync(path.join(__dirname, '../official-calendar-comparison.html'), path.join(distDir, 'comparison.html'))
}

// Generate sitemap.xml for SEO
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://janpreet.github.io/nanakshahi-ical/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://janpreet.github.io/nanakshahi-ical/comparison.html</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap)

// Generate robots.txt
const robots = `User-agent: *
Allow: /
Sitemap: https://janpreet.github.io/nanakshahi-ical/sitemap.xml`

fs.writeFileSync(path.join(distDir, 'robots.txt'), robots)

console.log('✅ Web calendar built successfully!')
console.log(`📊 Generated data for ${calendarData.statistics.totalGurpurabs} Gurpurabs`)
console.log('📁 Files created in dist/:')
console.log('   - index.html (main calendar page)')
console.log('   - comparison.html (official comparison page)')
console.log('   - web-calendar.js (calendar data)')
console.log('   - sitemap.xml (SEO optimization)')
console.log('   - robots.txt (search engine instructions)')
console.log('🌐 Ready for GitHub Pages deployment!')
