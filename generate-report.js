import dotenv from 'dotenv'
import report from 'multiple-cucumber-html-reporter'

dotenv.config()

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
