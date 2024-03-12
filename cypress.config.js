import { defineConfig } from 'cypress'
import cucumberPreprocessor from 'cypress-cucumber-preprocessor'
const cucumber = cucumberPreprocessor.default
import { getConfig } from './get-config.js'
import fs from 'fs' // Use native fs module for file operations
import dotenv from 'dotenv'
dotenv.config()

// Adding a list of allowed environments for validation
const allowedEnvironments = ['local', 'develop', 'testing', 'preproduction']

const environment = process.env.TEST_ENV || 'preproduction'
const environmentConfig = getConfig(environment)

const enableVideo = process.env.ENABLE_VIDEO !== 'false'

export default defineConfig({
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

      // Validate that the environment is one of the allowed values
      if (!allowedEnvironments.includes(environment)) {
        console.error(
          `Error: '${environment}' is not a valid TEST_ENV value. Allowed values are: ${allowedEnvironments.join(', ')}.`
        )
        process.exit(1) // Exit to avoid running tests with an invalid environment
      }

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
    video: enableVideo, // Control video recording based on the .env variable
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
