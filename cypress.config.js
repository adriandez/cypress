import { defineConfig } from 'cypress'
import cucumberPreprocessor from 'cypress-cucumber-preprocessor'
import { getConfig } from './get-config.js'
import fs from 'fs/promises'
import dotenv from 'dotenv'
dotenv.config()

const allowedEnvironments = ['local', 'develop', 'testing', 'preproduction']
const logTypes = [
  'start',
  'end',
  'error',
  'info',
  'attempting',
  'success',
  'warning'
]

const validateEnvironment = (environment) => {
  if (!allowedEnvironments.includes(environment)) {
    console.error(
      `Error: '${environment}' is not a valid TEST_ENV value. Allowed values are: ${allowedEnvironments.join(', ')}.`
    )
    process.exit(1)
  }
}

const getLogFlags = () =>
  logTypes.reduce(
    (acc, logType) => ({
      ...acc,
      [logType]: process.env[`ENABLE_${logType.toUpperCase()}_LOG`] !== 'false'
    }),
    {}
  )

export default defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      on('file:preprocessor', cucumberPreprocessor.default())

      on('after:spec', async (spec, results) => {
        if (
          results.video &&
          !results.tests.some((test) =>
            test.attempts.some((attempt) => attempt.state === 'failed')
          )
        ) {
          await fs.unlink(results.video).catch(console.error)
        }
      })

      if (process.env.TEST_BROWSER === 'edge') {
        on('before:browser:launch', (browser = {}, launchOptions) => {
          if (browser.family === 'chromium' && browser.name === 'edge') {
            launchOptions.args.push('--headless')
            launchOptions.args.push('--disable-gpu')
            launchOptions.args.push('--no-sandbox')
            launchOptions.args.push('--disable-dev-shm-usage')
          }

          return launchOptions
        })
      }

      const environment = process.env.TEST_ENV || 'preproduction'
      validateEnvironment(environment)

      const environmentConfig = getConfig(environment)
      if (!environmentConfig?.baseUrl) {
        console.error(
          `Error: No 'baseUrl' found for environment '${environment}'. Please check your configurations.`
        )
        process.exit(1)
      }

      // Check if TEST_BROWSER is firefox and disable video accordingly
      const isFirefox = process.env.TEST_BROWSER === 'firefox'
      const enableVideo = process.env.ENABLE_VIDEO !== 'false' && !isFirefox

      console.log(
        `Running tests in the '${environment}' environment with config:`,
        environmentConfig
      )

      config.baseUrl = environmentConfig.baseUrl
      config.viewportWidth = parseInt(process.env.VIEWPORT_WIDTH || '1920', 10)
      config.viewportHeight = parseInt(
        process.env.VIEWPORT_HEIGHT || '1080',
        10
      )

      return {
        ...config,
        video: enableVideo,
        env: {
          loggingEnabled: process.env.ENABLE_LOGGING !== 'false',
          logLevel: parseInt(process.env.LOG_LEVEL || '0', 10),
          logTypes: getLogFlags()
        }
      }
    },
    specPattern: 'cypress/e2e/cucumber/feature/**/*.feature',
    supportFile: 'cypress/support/e2e.js',
    videoCompression: 32,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    screenshotOnRunFailure: true,
    headless: true
  }
})
