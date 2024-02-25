require('dotenv').config()
const report = require('multiple-cucumber-html-reporter')

report.generate({
  jsonDir: './cypress/cucumber-json',
  reportPath: './cypress/reports',
  metadata: {
    browser: {
      name: process.env.TEST_BROWSER || 'unknown',
      version: ''
    },
    device: 'Local test machine',
    platform: {
      name: process.platform,
      version: ''
    }
  }
})
