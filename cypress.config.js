const { defineConfig } = require('cypress')
const cucumber = require('cypress-cucumber-preprocessor').default
const getConfig = require('./getConfig')
const fs = require('fs') // Use native fs module for file operations
require('dotenv').config()

// Adding a list of allowed environments for validation
const allowedEnvironments = ['local', 'develop', 'testing', 'preproduction']

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber())

      // After a spec is run, delete the video if there were no failures
      on('after:spec', (spec, results) => {
        if (results && results.video) {
          // Check if there are any failing tests
          const failures = results.tests.some((test) =>
            test.attempts.some((attempt) => attempt.state === 'failed')
          )
          if (!failures) {
            // Delete the video if the spec passed and no tests retried
            fs.unlinkSync(results.video)
          }
        }
      })

      const environment = process.env.TEST_ENV || 'preproduction'

      // Validate that the environment is one of the allowed values
      if (!allowedEnvironments.includes(environment)) {
        console.error(
          `Error: '${environment}' is not a valid TEST_ENV value. Allowed values are: ${allowedEnvironments.join(', ')}.`
        )
        process.exit(1) // Exit to avoid running tests with an invalid environment
      }

      const environmentConfig = getConfig(environment)
      console.log(
        `Running tests in the '${environment}' environment with config:`,
        environmentConfig
      )

      if (!environmentConfig || !environmentConfig.baseUrl) {
        console.error(
          `Error: No 'baseUrl' found for environment '${environment}'. Please check your configurations.json.`
        )
        process.exit(1) // Exit to avoid running tests without baseUrl
      }

      config.baseUrl = environmentConfig.baseUrl

      const viewportWidth = process.env.VIEWPORT_WIDTH || 1920
      const viewportHeight = process.env.VIEWPORT_HEIGHT || 1080

      console.log(
        `VIEWPORT_WIDTH: ${viewportWidth} and VIEWPORT_HEIGHT: ${viewportHeight}`
      )

      config.viewportWidth = parseInt(viewportWidth, 10)
      config.viewportHeight = parseInt(viewportHeight, 10)

      return config
    },
    specPattern: 'cypress/e2e/cucumber/feature/*.feature',
    supportFile: 'cypress/support/e2e.js',
    video: true, // Keep video recording enabled
    videosFolder: 'cypress/videos',
    videoCompression: 32,
    screenshotsFolder: 'cypress/screenshots',
    screenshotOnRunFailure: true,
    headless: true,
    env: {
      loggingEnabled: true,
      logTypes: {
        start: true,
        end: true,
        error: true,
        info: true
      }
    }
  }
})
