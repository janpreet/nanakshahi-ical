const n = require('nanakshahi')
const ics = require('ics')
const { writeFileSync } = require('fs')
const path = require('path')

const newDateFormat = (a) => {
  return a.toISOString().split('T')[0].split('-').map(Number)
}

const formatNanakshahiDate = (gregorianDate) => {
  const nDate = n.getNanakshahiDate(gregorianDate)
  if (!nDate || !nDate.englishDate || !nDate.punjabiDate) return null
  
  return {
    en: `${nDate.englishDate.date} ${nDate.englishDate.monthName}`,
    pa: `${nDate.punjabiDate.date} ${nDate.punjabiDate.monthName}`,
    year: nDate.englishDate.year,
    day: {
      en: nDate.englishDate.day,
      pa: nDate.punjabiDate.day
    }
  }
}

const calEvents = []

const currentYear = new Date().getFullYear()
const yearStart = new Date(currentYear, 0, 1)
const yearEnd = new Date(currentYear + 1, 11, 31)
const endTime = yearEnd.getTime()

for (let day = new Date(yearStart); day.getTime() <= endTime; day.setDate(day.getDate() + 1)) {
  const currentDay = new Date(day)
  const gurpurab = n.getGurpurabsForDay(currentDay)
  const nDate = formatNanakshahiDate(currentDay)
  
  for (const g in gurpurab) {
    calEvents.push({
      start: newDateFormat(currentDay),
      title: gurpurab[g].en,
      description: gurpurab[g].pa + (nDate ? `\n\nNanakshahi Date:\n${nDate.pa} ${nDate.year} NS` : ''),
      categories: [gurpurab[g].type]
    })
  }
  
  if (nDate) {
    calEvents.push({
      start: newDateFormat(currentDay),
      duration: { days: 1 },
      title: `${nDate.en} ${nDate.year} NS (${nDate.day.en})`,
      description: `Nanakshahi Date:\n${nDate.en} ${nDate.year} NS (${nDate.day.en})\n${nDate.pa} ${nDate.year} NS (${nDate.day.pa})`,
      categories: ['daily']
    })
  }
}

const { error, value } = ics.createEvents(calEvents)
if (error) throw error

const filePath = path.join(__dirname, '/nanakshahi.ics')
writeFileSync(filePath, value)

module.exports = { newDateFormat, formatNanakshahiDate }