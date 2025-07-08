# nanakshahi-ical
[![SGPC Nanakshahi Calendar CI](https://github.com/janpreet/nanakshahi-ical/actions/workflows/main.yml/badge.svg)](https://github.com/janpreet/nanakshahi-ical/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/janpreet/nanakshahi-ical/graph/badge.svg?token=OMQ92VQEBI)](https://codecov.io/gh/janpreet/nanakshahi-ical)

This script generates an ICS file for the Nanakshahi calendar that includes both daily calendar dates and Sikh religious holidays. It displays:
- Daily Nanakshahi dates in both English and Punjabi.
- Day of the week in both languages.
- All Gurpurabs and historical events.
- Nanakshahi year (NS - Nanakshahi Samvat).

## Key Features

- **SGPC Compliant**: July 5th correctly shows "Miri Piri Divas" instead of "Parkash Divas"
- **Accurate Month Lengths**: Jeth 2025 has 32 days as per SGPC calendar
- **Enhanced Data**: Uses official SGPC calendar data with community corrections
- **Automated Updates**: GitHub Actions workflow for yearly calendar maintenance

## Usage

### Apple Calendar
You can subscribe to this calendar from your Apple calendar by following these steps:

1. Open the Calendar app on your Mac.
2. Choose File > New Calendar Subscription.
3. Enter [this URL](https://raw.githubusercontent.com/janpreet/nanakshahi-ical/main/nanakshahi.ics) in the "Calendar URL" field.
4. Click Subscribe.
5. Customize the settings for the calendar subscription, such as the name and color.
6. Click OK.

### Google Calendar
To add this calendar to Google Calendar:

1. Open Google Calendar
2. Click the "+" next to "Other calendars"
3. Select "From URL"
4. Enter [this URL](https://raw.githubusercontent.com/janpreet/nanakshahi-ical/main/nanakshahi.ics)
5. Click "Add calendar"

### Web Calendar
View the interactive calendar online: https://janpreet.github.io/nanakshahi-ical/

## Development

### Generate Calendar Locally

```bash
npm install
npm start
```

This creates `nanakshahi.ics` with all Gurpurabs and events for the current year.

### Using in Your Project

```javascript
const sgpc = require('./sgpc-nanakshahi')

// Get all Gurpurabs for current year
const gurpurabs = sgpc.getAllGurpurabsForYear(557) // 2025

// Convert dates
const gregorianDate = new Date('2025-07-05')
const nanakshahiDate = sgpc.getNanakshahiDate(gregorianDate)
console.log(nanakshahiDate) // 21 Harh 557

// Check for Gurpurabs on a specific date
const gurpurabsToday = sgpc.getGurpurabsForDay(gregorianDate)
console.log(gurpurabsToday) // [{ en: 'Miri Piri Divas', pa: 'ਮੀਰੀ ਪੀਰੀ ਦਿਵਸ', type: 'gurpurab' }]
```

### Testing

```bash
npm test                    # All tests
npm run test-sgpc          # SGPC compliance tests
npm run validate-calendar  # Calendar validation
```

## Data Sources

This project uses data from official SGPC calendar publications and is enhanced through community corrections. It is not affiliated with SGPC but serves the community by providing accurate calendar data.

- **Primary Source**: Official SGPC Jantri publications (https://sgpc.net)
- **Corrections**: Community-verified corrections database
- **Baseline**: nanakshahi-js library calculations

## Contributing

To contribute calendar corrections, edit the `sgpc-corrections.json` file or report issues comparing with official SGPC calendar data.

## Acknowledgments

This script is built on top of the [nanakshahi-js](https://github.com/Sarabveer/nanakshahi-js) library, which provides the necessary functions to calculate Gurpurab dates and Nanakshahi calendar conversions. Additional data sourced from official SGPC publications and community contributions.
