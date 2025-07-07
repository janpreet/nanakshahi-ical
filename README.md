# 📅 Nanakshahi Calendar iCal Generator

A Nanakshahi calendar system that generates accurate iCal files for Sikh religious observances, using data from official SGPC sources.

## 🙏 **About This Project**

This is **not affiliated with SGPC** but uses data from their official calendar publications to provide enhanced calendar accuracy for everyone.

### 📚 **Data Sources**
- **Primary**: Official SGPC Jantri publications (https://sgpc.net)
- **Enhancement**: Corrections and validation from various sources

## 🚀 **Key Features**

✅ **SGPC Compliant**: July 5th correctly shows "Miri Piri Divas" (not "Parkash Divas")
✅ **Variable Month Lengths**: Jeth 2025 has 32 days as per SGPC calendar
✅ **Enhanced Accuracy**: Improved with corrections from SGPC official sources
✅ **Easy Integration**: Drop-in replacement for nanakshahi-js
✅ **Automated Updates**: GitHub Actions for yearly calendar updates  
✅ **Open Source**: GitHub-based corrections database
✅ **Web Calendar**: Beautiful interactive calendar interface

## 🌐 **Live Web Calendar**

View the interactive Enhanced Nanakshahi Calendar online:
**🔗 https://janpreet.github.io/nanakshahi-ical/**

## 📦 **Quick Start**

### Install

```bash
npm install nanakshahi-ical
```

### Generate iCal File

```bash
node main.js
```

This creates `nanakshahi.ics` with all Gurpurabs and events for the current year.

### Use in Your Project

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


## 🔧 **Update Process**

I've set up multiple ways to keep the calendar accurate:

1. **SGPC Corrections** → Official calendar data (highest priority)
2. **Corrections Database** → Crowd-sourced corrections
3. **nanakshahi-js** → Baseline calculations
4. **Manual Input** → When needed

### Corrections Database

The `sgpc-corrections.json` file contains verified corrections:
- Month length adjustments
- Gurpurab date corrections  
- Historical validation data

## 🛠️ **Development & Testing**

### Run Tests

```bash
npm test                    # All tests
npm run test-sgpc          # SGPC compliance tests
npm run validate-calendar  # Calendar validation
```

### Code Coverage

I use [CodeCov](https://codecov.io) to track test coverage. Coverage reports are automatically uploaded on:
- Every push to main branch
- All pull requests  
- Calendar update workflows

[![codecov](https://codecov.io/gh/janpreet/nanakshahi-ical/graph/badge.svg?token=OMQ92VQEBI)](https://codecov.io/gh/janpreet/nanakshahi-ical)

### Available Scripts

```bash
npm run fetch-calendar     # Fetch latest SGPC data
npm run validate-calendar  # Validate calendar data
npm run update-calendar    # Full update process
npm run build:web          # Build web calendar
```

## 🔄 **API Compatibility**

This works as a drop-in replacement for nanakshahi-js:

```javascript
// Original nanakshahi-js approach
const nanakshahi = require('nanakshahi')

// Enhanced approach (same API, additional features!)
const sgpc = require('./sgpc-nanakshahi')

// Both work the same way
const date = sgpc.getNanakshahiDate(new Date('2025-07-05'))
```

## 🤝 **Contributing**

Found an issue with the calendar? Here's how to help:

### Quick Calendar Fix

Edit `sgpc-corrections.json` directly:

```json
{
  "557": {
    "corrections": {
      "july_5": "miri_piri_divas"
    }
  }
}
```

### Adding SGPC Data

1. **Get official SGPC calendar** (usually PDF from https://sgpc.net)
2. **Extract month lengths** and Gurpurab dates
3. **Add to corrections database**
4. **Run validation** with `npm run validate-calendar`
5. **Submit pull request**

### Reporting Issues

- 📅 **Calendar issues**: Compare with official SGPC calendar
- 🐛 **Bugs**: Include steps to reproduce
- 💡 **Features**: Explain the use case

## 📄 **License**

MIT License - feel free to use this in your projects!

## 🛡️ **Security & Community**

### Security

Found a security vulnerability? Please report it responsibly:
- 📧 **Email**: singh@janpreet.com with subject "SECURITY: [Brief Description]"
- 🔒 **Private**: We handle security issues privately until fixed
- ⏱️ **Response**: Within 48 hours

See [SECURITY.md](SECURITY.md) for detailed security reporting guidelines.

### Community Guidelines

This project follows a Code of Conduct to ensure a welcoming environment for all contributors:
- 🤝 **Respectful**: Be respectful of all viewpoints and experiences
- 🎯 **Accuracy**: Prioritize calendar accuracy and SGPC compliance
- 🙏 **Seva Spirit**: Maintain the service-oriented nature of the project

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for full community guidelines.

## 🙏 **Acknowledgments**

- **SGPC** for maintaining the official Nanakshahi calendar
- **nanakshahi-js contributors** for the excellent foundation
- **Everyone** who provides feedback and validation

---

**🙏 This project serves the Sikh community with accurate calendar data sourced from official SGPC publications and enhanced through various contributions.**