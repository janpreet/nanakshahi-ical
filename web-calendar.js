// SGPC Nanakshahi Calendar Data for 557 NS (2025 CE)
const CALENDAR_DATA = {
  year: 557,
  ceYear: 2025,
  isLeapYear: true,
  totalDays: 366,

  months: [
    { name: 'Cheit', punjabi: 'ਚੇਤ', days: 31, startDate: new Date(2025, 2, 19) },
    { name: 'Vaisakh', punjabi: 'ਵੈਸਾਖ', days: 31, startDate: new Date(2025, 3, 19) },
    { name: 'Jeth', punjabi: 'ਜੇਠ', days: 32, startDate: new Date(2025, 4, 20) }, // Leap year: 32 days
    { name: 'Harh', punjabi: 'ਹਾੜ', days: 31, startDate: new Date(2025, 5, 21) },
    { name: 'Sawan', punjabi: 'ਸਾਵਣ', days: 31, startDate: new Date(2025, 6, 22) },
    { name: 'Bhadon', punjabi: 'ਭਾਦੋਂ', days: 30, startDate: new Date(2025, 7, 22) },
    { name: 'Asu', punjabi: 'ਅੱਸੂ', days: 30, startDate: new Date(2025, 8, 21) },
    { name: 'Katik', punjabi: 'ਕੱਤਕ', days: 30, startDate: new Date(2025, 9, 21) },
    { name: 'Maghar', punjabi: 'ਮੱਘਰ', days: 30, startDate: new Date(2025, 10, 20) },
    { name: 'Poh', punjabi: 'ਪੋਹ', days: 30, startDate: new Date(2025, 11, 20) },
    { name: 'Magh', punjabi: 'ਮਾਘ', days: 30, startDate: new Date(2026, 0, 19) },
    { name: 'Phagun', punjabi: 'ਫੱਗਣ', days: 30, startDate: new Date(2026, 1, 18) }
  ],

  gurpurabs: [
    {
      name: 'Parkash Divas Sri Guru Gobind Singh Ji',
      punjabi: 'ਪ੍ਰਕਾਸ਼ ਦਿਵਸ ਸ੍ਰੀ ਗੁਰੂ ਗੋਬਿੰਦ ਸਿੰਘ ਜੀ',
      nanakshahi: '23 Poh 557',
      gregorian: 'January 11, 2025',
      type: 'fixed'
    },
    {
      name: 'Maghi',
      punjabi: 'ਮਾਘੀ',
      nanakshahi: '13 Magh 557',
      gregorian: 'January 31, 2025',
      type: 'fixed'
    },
    {
      name: 'Holla Mohalla',
      punjabi: 'ਹੋਲਾ ਮਹੱਲਾ',
      nanakshahi: '2 Cheit 557',
      gregorian: 'March 20, 2025',
      type: 'movable'
    },
    {
      name: 'Parkash Divas Sri Guru Nanak Dev Ji',
      punjabi: 'ਪ੍ਰਕਾਸ਼ ਦਿਵਸ ਸ੍ਰੀ ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ',
      nanakshahi: '10 Cheit 557',
      gregorian: 'March 28, 2025',
      type: 'movable'
    },
    {
      name: 'Parkash Divas Sri Guru Angad Dev Ji',
      punjabi: 'ਪ੍ਰਕਾਸ਼ ਦਿਵਸ ਸ੍ਰੀ ਗੁਰੂ ਅੰਗਦ ਦੇਵ ਜੀ',
      nanakshahi: '5 Vaisakh 557',
      gregorian: 'April 23, 2025',
      type: 'fixed'
    },
    {
      name: 'Parkash Divas Sri Guru Amar Das Ji',
      punjabi: 'ਪ੍ਰਕਾਸ਼ ਦਿਵਸ ਸ੍ਰੀ ਗੁਰੂ ਅਮਰ ਦਾਸ ਜੀ',
      nanakshahi: '8 Jeth 557',
      gregorian: 'May 27, 2025',
      type: 'fixed'
    },
    {
      name: 'Parkash Divas Sri Guru Arjan Dev Ji',
      punjabi: 'ਪ੍ਰਕਾਸ਼ ਦਿਵਸ ਸ੍ਰੀ ਗੁਰੂ ਅਰਜਨ ਦੇਵ ਜੀ',
      nanakshahi: '2 Jeth 557',
      gregorian: 'May 21, 2025',
      type: 'fixed'
    },
    {
      name: 'Shaheedi Divas Sri Guru Arjan Dev Ji',
      punjabi: 'ਸ਼ਹੀਦੀ ਦਿਵਸ ਸ੍ਰੀ ਗੁਰੂ ਅਰਜਨ ਦੇਵ ਜੀ',
      nanakshahi: '16 Jeth 557',
      gregorian: 'June 4, 2025',
      type: 'fixed'
    },
    {
      name: 'Miri Piri Divas',
      punjabi: 'ਮੀਰੀ ਪੀਰੀ ਦਿਵਸ',
      nanakshahi: '22 Harh 557',
      gregorian: 'July 5, 2025',
      type: 'fixed',
      highlight: true,
      note: 'SGPC Corrected: Previously misidentified as Parkash Divas'
    },
    {
      name: 'Parkash Divas Sri Guru Har Krishan Ji',
      punjabi: 'ਪ੍ਰਕਾਸ਼ ਦਿਵਸ ਸ੍ਰੀ ਗੁਰੂ ਹਰਿ ਕ੍ਰਿਸ਼ਨ ਜੀ',
      nanakshahi: '8 Sawan 557',
      gregorian: 'July 29, 2025',
      type: 'fixed'
    },
    {
      name: 'Parkash Divas Sri Guru Ram Das Ji',
      punjabi: 'ਪ੍ਰਕਾਸ਼ ਦਿਵਸ ਸ੍ਰੀ ਗੁਰੂ ਰਾਮ ਦਾਸ ਜੀ',
      nanakshahi: '9 Asu 557',
      gregorian: 'September 29, 2025',
      type: 'fixed'
    },
    {
      name: 'Parkash Divas Sri Guru Teg Bahadur Ji',
      punjabi: 'ਪ੍ਰਕਾਸ਼ ਦਿਵਸ ਸ੍ਰੀ ਗੁਰੂ ਤੇਗ ਬਹਾਦਰ ਜੀ',
      nanakshahi: '5 Vaisakh 557',
      gregorian: 'April 23, 2025',
      type: 'fixed'
    },
    {
      name: 'Bandi Chhorr Divas',
      punjabi: 'ਬੰਦੀ ਛੋੜ ਦਿਵਸ',
      nanakshahi: '5 Katik 557',
      gregorian: 'October 25, 2025',
      type: 'movable'
    },
    {
      name: 'Shaheedi Divas Sri Guru Teg Bahadur Ji',
      punjabi: 'ਸ਼ਹੀਦੀ ਦਿਵਸ ਸ੍ਰੀ ਗੁਰੂ ਤੇਗ ਬਹਾਦਰ ਜੀ',
      nanakshahi: '9 Maghar 557',
      gregorian: 'November 28, 2025',
      type: 'fixed'
    }
  ]
}

// Utility functions
function formatDate (date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function addDays (date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Generate calendar HTML
function generateCalendar () {
  const calendarGrid = document.getElementById('calendar-grid')

  CALENDAR_DATA.months.forEach((month, index) => {
    const monthCard = document.createElement('div')
    monthCard.className = 'month-card'

    // Convert string date to Date object if needed
    const startDate = typeof month.startDate === 'string' ? new Date(month.startDate) : month.startDate
    const endDate = addDays(startDate, month.days - 1)

    monthCard.innerHTML = `
            <div class="month-header">
                ${month.name} ${month.punjabi}
            </div>
            <div class="month-info">
                <p><strong>Days:</strong> ${month.days} ${month.days === 32 ? '(Leap Year)' : ''}</p>
                <p><strong>Start:</strong> ${formatDate(startDate)}</p>
                <p><strong>End:</strong> ${formatDate(endDate)}</p>
                <p><strong>Month:</strong> ${index + 1}/12</p>
            </div>
        `

    // Add click handler for this specific card
    monthCard.addEventListener('click', function () {
      alert(`${month.name} (${month.punjabi}) has ${month.days} days\nStarts: ${formatDate(startDate)}\nEnds: ${formatDate(endDate)}`)
    })

    // Add hover effect
    monthCard.style.cursor = 'pointer'
    monthCard.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-2px)'
      this.style.transition = 'transform 0.2s ease'
    })

    monthCard.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)'
    })

    calendarGrid.appendChild(monthCard)
  })
}

// Generate Gurpurabs list
function generateGurpurabs () {
  const gurpurabList = document.getElementById('gurpurab-list')

  // Filter out broken gurpurabs and use fallback if needed
  const validGurpurabs = CALENDAR_DATA.gurpurabs.filter(g => g.name && g.name !== 'undefined')

  // Use fallback data if gurpurabs are broken
  const fallbackGurpurabs = [
    {
      name: 'Parkash Divas Sri Guru Gobind Singh Ji',
      punjabi: 'ਪ੍ਰਕਾਸ਼ ਦਿਵਸ ਸ੍ਰੀ ਗੁਰੂ ਗੋਬਿੰਦ ਸਿੰਘ ਜੀ',
      nanakshahi: '23 Poh 557',
      gregorian: 'January 11, 2025',
      type: 'fixed'
    },
    {
      name: 'Maghi',
      punjabi: 'ਮਾਘੀ',
      nanakshahi: '13 Magh 557',
      gregorian: 'January 31, 2025',
      type: 'fixed'
    },
    {
      name: 'Miri Piri Divas',
      punjabi: 'ਮੀਰੀ ਪੀਰੀ ਦਿਵਸ',
      nanakshahi: '22 Harh 557',
      gregorian: 'July 5, 2025',
      type: 'fixed',
      highlight: true,
      note: 'Community Corrected: Previously misidentified as Parkash Divas'
    },
    {
      name: 'Parkash Divas Sri Guru Nanak Dev Ji',
      punjabi: 'ਪ੍ਰਕਾਸ਼ ਦਿਵਸ ਸ੍ਰੀ ਗੁਰੂ ਨਾਨਕ ਦੇਵ ਜੀ',
      nanakshahi: '10 Cheit 557',
      gregorian: 'March 28, 2025',
      type: 'movable'
    },
    {
      name: 'Bandi Chhorr Divas',
      punjabi: 'ਬੰਦੀ ਛੋੜ ਦਿਵਸ',
      nanakshahi: '5 Katik 557',
      gregorian: 'October 25, 2025',
      type: 'movable'
    }
  ]

  const gurpurabsToDisplay = validGurpurabs.length > 0 ? validGurpurabs : fallbackGurpurabs

  gurpurabsToDisplay.forEach(gurpurab => {
    const gurpurabItem = document.createElement('div')
    gurpurabItem.className = 'gurpurab-item'

    if (gurpurab.highlight) {
      gurpurabItem.style.borderLeftColor = '#28a745'
      gurpurabItem.style.backgroundColor = '#f8fff8'
    }

    gurpurabItem.innerHTML = `
            <div class="gurpurab-date">
                ${gurpurab.nanakshahi} • ${gurpurab.gregorian}
                ${gurpurab.type === 'movable' ? '🌙' : '📅'}
            </div>
            <div class="gurpurab-name">${gurpurab.name}</div>
            <div class="gurpurab-punjabi">${gurpurab.punjabi}</div>
            ${gurpurab.note ? `<div style="font-size: 0.8rem; color: #28a745; margin-top: 5px;">✅ ${gurpurab.note}</div>` : ''}
        `

    // Add click handler for this specific gurpurab
    gurpurabItem.addEventListener('click', function () {
      const details = `${gurpurab.name}\n${gurpurab.punjabi}\n\n📅 Nanakshahi: ${gurpurab.nanakshahi}\n📅 Gregorian: ${gurpurab.gregorian}\n📍 Type: ${gurpurab.type === 'fixed' ? 'Fixed Date' : 'Movable (Lunar)'}${gurpurab.note ? `\n\n✅ ${gurpurab.note}` : ''}`
      alert(details)
    })

    // Add hover effect
    gurpurabItem.style.cursor = 'pointer'
    gurpurabItem.addEventListener('mouseenter', function () {
      this.style.transform = 'translateX(5px)'
      this.style.transition = 'transform 0.2s ease'
    })

    gurpurabItem.addEventListener('mouseleave', function () {
      this.style.transform = 'translateX(0)'
    })

    gurpurabList.appendChild(gurpurabItem)
  })
}

// Continuous Calendar State - Now Nanakshahi-centric
let currentNanakshahiMonth = 0 // Index of current Nanakshahi month (0-11)
let currentNanakshahiYear = CALENDAR_DATA.year

// Generate continuous calendar - Nanakshahi-centric
function generateContinuousCalendar () {
  const monthYearElement = document.getElementById('calendar-month-year')
  const monthSubtitleElement = document.getElementById('calendar-month-subtitle')
  const calendarDatesElement = document.getElementById('calendar-dates')

  // Clear existing dates
  calendarDatesElement.innerHTML = ''

  // Get current Nanakshahi month data
  if (currentNanakshahiMonth < 0 || currentNanakshahiMonth >= CALENDAR_DATA.months.length) {
    currentNanakshahiMonth = 0 // Reset to first month if out of bounds
  }

  const currentMonth = CALENDAR_DATA.months[currentNanakshahiMonth]
  const monthStartDate = typeof currentMonth.startDate === 'string'
    ? new Date(currentMonth.startDate)
    : currentMonth.startDate

  // Update header - Nanakshahi month as primary
  monthYearElement.textContent = `${currentMonth.name} ${currentMonth.punjabi}`
  monthSubtitleElement.textContent = `${currentMonth.days} days • ${currentNanakshahiYear} NS (${currentNanakshahiYear + 1468} CE)`

  // Calculate calendar grid starting from 1st of Nanakshahi month
  const firstNanakshahiDate = new Date(monthStartDate)
  const firstDayOfWeek = firstNanakshahiDate.getDay() // 0 = Sunday, 1 = Monday, etc.

  // Start grid from Sunday of the week containing 1st Nanakshahi date
  const gridStartDate = new Date(firstNanakshahiDate)
  gridStartDate.setDate(gridStartDate.getDate() - firstDayOfWeek)

  // End grid after last day of Nanakshahi month, extending to Saturday
  const lastNanakshahiDate = new Date(firstNanakshahiDate)
  lastNanakshahiDate.setDate(lastNanakshahiDate.getDate() + currentMonth.days - 1)
  const lastDayOfWeek = lastNanakshahiDate.getDay()
  const gridEndDate = new Date(lastNanakshahiDate)
  gridEndDate.setDate(gridEndDate.getDate() + (6 - lastDayOfWeek))

  const currentDate = new Date(gridStartDate)
  const today = new Date()

  // eslint-disable-next-line no-unmodified-loop-condition
  while (currentDate <= gridEndDate) {
    const dateElement = document.createElement('div')
    dateElement.className = 'calendar-date'

    // Check if this date falls within current Nanakshahi month
    const isCurrentNanakshahiMonth = currentDate >= firstNanakshahiDate && currentDate <= lastNanakshahiDate
    const isToday = currentDate.toDateString() === today.toDateString()

    // Calculate Nanakshahi date number
    let nanakshahiDateNumber = ''
    let gregorianDateInfo = ''

    if (isCurrentNanakshahiMonth) {
      // Calculate which day of the Nanakshahi month this is
      const daysDiff = Math.floor((currentDate - firstNanakshahiDate) / (1000 * 60 * 60 * 24)) + 1
      nanakshahiDateNumber = daysDiff
      gregorianDateInfo = `${currentDate.getDate()} ${currentDate.toLocaleDateString('en-US', { month: 'short' })}`
    } else {
      // This is a date from previous/next month - show Gregorian
      dateElement.classList.add('other-month')
      nanakshahiDateNumber = currentDate.getDate()
      gregorianDateInfo = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    if (isToday) {
      dateElement.classList.add('today')
    }

    // Check for events on this date
    const eventsOnDate = findEventsOnDate(currentDate)
    if (eventsOnDate.length > 0) {
      dateElement.classList.add('has-event')
    }

    // Create date content
    const dateNumberElement = document.createElement('div')
    dateNumberElement.className = 'calendar-date-number'
    dateNumberElement.textContent = nanakshahiDateNumber

    // Add Gregorian date info
    const gregorianElement = document.createElement('div')
    gregorianElement.className = 'calendar-gregorian-date'
    gregorianElement.style.fontSize = '0.7rem'
    gregorianElement.style.color = isCurrentNanakshahiMonth ? '#888' : '#ccc'
    gregorianElement.style.marginBottom = '2px'
    gregorianElement.textContent = gregorianDateInfo

    const eventsElement = document.createElement('div')
    eventsElement.className = 'calendar-date-events'
    if (eventsOnDate.length > 0) {
      eventsElement.textContent = eventsOnDate.slice(0, 1).map(e => e.shortName || e.name.substring(0, 6) + '...').join(', ')
    }

    dateElement.appendChild(gregorianElement)
    dateElement.appendChild(dateNumberElement)
    dateElement.appendChild(eventsElement)

    // Add click handler
    dateElement.addEventListener('click', function () {
      const nanakshahiInfo = isCurrentNanakshahiMonth
        ? `${nanakshahiDateNumber} ${currentMonth.name} ${currentNanakshahiYear} NS`
        : 'Other month'

      if (eventsOnDate.length > 0) {
        const eventDetails = eventsOnDate.map(e =>
                    `${e.name}\n${e.punjabi || ''}\n${e.nanakshahi || ''}`
        ).join('\n\n')
        alert(`${formatDate(currentDate)}\n${nanakshahiInfo}\n\n${eventDetails}`)
      } else {
        alert(`${formatDate(currentDate)}\n${nanakshahiInfo}\n\nNo events on this date`)
      }
    })

    calendarDatesElement.appendChild(dateElement)
    currentDate.setDate(currentDate.getDate() + 1)
  }
}

// Find current Nanakshahi month based on today's date
function findCurrentNanakshahiMonth () {
  const today = new Date()

  for (let i = 0; i < CALENDAR_DATA.months.length; i++) {
    const month = CALENDAR_DATA.months[i]
    const startDate = typeof month.startDate === 'string' ? new Date(month.startDate) : month.startDate
    const endDate = addDays(startDate, month.days - 1)

    if (today >= startDate && today <= endDate) {
      return i
    }
  }

  // If not found, return current month index based on rough estimate
  return Math.min(Math.floor((new Date().getMonth() + 9) % 12), CALENDAR_DATA.months.length - 1)
}

// Find events on a specific date
function findEventsOnDate (date) {
  const events = []

  // Check gurpurabs
  for (const gurpurab of CALENDAR_DATA.gurpurabs) {
    if (gurpurab.gregorian && gurpurab.gregorian !== 'undefined') {
      const eventDate = new Date(gurpurab.gregorian)
      if (eventDate.toDateString() === date.toDateString()) {
        events.push({
          ...gurpurab,
          shortName: gurpurab.name.includes('Parkash')
            ? 'Parkash'
            : gurpurab.name.includes('Shaheedi')
              ? 'Shaheedi'
              : gurpurab.name.includes('Miri Piri')
                ? 'Miri Piri'
                : gurpurab.name.split(' ')[0]
        })
      }
    }
  }

  // Fallback events removed - using main gurpurab data only

  return events
}

// Navigation functions - Now for Nanakshahi months
function navigateMonth (direction) {
  if (direction === 'prev') {
    currentNanakshahiMonth--
    if (currentNanakshahiMonth < 0) {
      // Go to previous year if we have data for it
      if (currentNanakshahiYear > 556) { // Don't go below year 556
        currentNanakshahiMonth = 11
        currentNanakshahiYear--
        // Note: This would require loading data for previous year
        // For now, just reset to month 0
        currentNanakshahiMonth = 0
      } else {
        currentNanakshahiMonth = 0 // Stay at first month
      }
    }
  } else {
    currentNanakshahiMonth++
    if (currentNanakshahiMonth >= CALENDAR_DATA.months.length) {
      // Go to next year if we have data for it
      if (currentNanakshahiYear < 561) { // Don't go beyond year 561
        currentNanakshahiMonth = 0
        currentNanakshahiYear++
        // Note: This would require loading data for next year
        // For now, just reset to last month
        currentNanakshahiMonth = CALENDAR_DATA.months.length - 1
      } else {
        currentNanakshahiMonth = CALENDAR_DATA.months.length - 1 // Stay at last month
      }
    }
  }
  generateContinuousCalendar()
}

// Initialize calendar when page loads
document.addEventListener('DOMContentLoaded', function () {
  // Set current Nanakshahi month
  currentNanakshahiMonth = findCurrentNanakshahiMonth()

  generateContinuousCalendar()
  generateCalendar()
  generateGurpurabs()

  // Add navigation event listeners
  document.getElementById('prev-month').addEventListener('click', () => navigateMonth('prev'))
  document.getElementById('next-month').addEventListener('click', () => navigateMonth('next'))

  // Update page title with current year
  document.title = `Enhanced Nanakshahi Calendar ${CALENDAR_DATA.year} NS (${CALENDAR_DATA.ceYear} CE)`

  // Add dynamic stats
  const totalGurpurabs = CALENDAR_DATA.gurpurabs.length
  const fixedGurpurabs = CALENDAR_DATA.gurpurabs.filter(g => g.type === 'fixed').length
  const movableGurpurabs = CALENDAR_DATA.gurpurabs.filter(g => g.type === 'movable').length

  console.log('📊 Calendar Statistics:')
  console.log(`📅 Total Days: ${CALENDAR_DATA.totalDays}`)
  console.log(`🙏 Total Gurpurabs: ${totalGurpurabs}`)
  console.log(`📌 Fixed Gurpurabs: ${fixedGurpurabs}`)
  console.log(`🌙 Movable Gurpurabs: ${movableGurpurabs}`)
  console.log('✅ Enhanced Calendar: Miri Piri Divas on July 5th (22 Harh 557)')
  console.log(`📊 Jeth Month: ${CALENDAR_DATA.months[2].days} days (Leap Year)`)
})

// Export calendar data for external use
window.SGPC_CALENDAR = CALENDAR_DATA
