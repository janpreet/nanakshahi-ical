const n = require('nanakshahi')
const ics = require('ics', './dist')
const {
  writeFileSync
} = require('fs')
const path = require('path')

const newDateFormat = (a) => {
  return a.toISOString().split('T')[0].split('-').map(Number)
}

const getGurpurab = (a) => {
  return n.getGurpurabsForDay(a)
}

const calEvents = []
let gurpurab = {}
const yearStart = new Date(new Date().getFullYear(), 0, 1)
const yearEnd = new Date(new Date().getFullYear(), 12, 0)
const day = yearStart
while (day.setDate(day.getDate() + 1) <= yearEnd) {
  gurpurab = getGurpurab(day)
  for (const g in gurpurab) {
    calEvents.push({
      start: newDateFormat(day),
      title: gurpurab[g].en,
      description: gurpurab[g].pa,
      categories: [gurpurab[g].type]
    })
  }
}

const {
  error,
  value
} = ics.createEvents(calEvents)

if (error) {
  console.log(error)
}
console.log(value)

const filePath = path.join(__dirname, '/nanakshahi.ics')
writeFileSync(filePath, value)

module.exports = {
  newDateFormat,
  getGurpurab
}
