import { defineConfig } from 'cypress';
import cucumberPreprocessor from 'cypress-cucumber-preprocessor';
import { getConfig } from './get-config.js';
import fsPromises from 'fs/promises'; // For async operations
import fs from 'fs'; // For synchronous operations
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const allowedEnvironments = ['local', 'develop', 'testing', 'preproduction'];
const logTypes = [
  'start',
  'end',
  'error',
  'info',
  'attempting',
  'success',
  'warning'
];

const validateEnvironment = (environment) => {
  if (!allowedEnvironments.includes(environment)) {
    console.error(
      `Error: '${environment}' is not a valid TEST_ENV value. Allowed values are: ${allowedEnvironments.join(', ')}.`
    );
    process.exit(1);
  }
};

const getLogFlags = () =>
  logTypes.reduce(
    (acc, logType) => ({
      ...acc,
      [logType]: process.env[`ENABLE_${logType.toUpperCase()}_LOG`] !== 'false'
    }),
    {}
  );

const findScreenshotRecursively = async (dir, screenshotFileName) => {
  const files = await fsPromises.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const res = path.resolve(dir, file.name);
    if (file.isDirectory()) {
      const result = await findScreenshotRecursively(res, screenshotFileName);
      if (result) return result;
    } else if (file.name === screenshotFileName) {
      return res;
    }
  }
  return null;
};

export default defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      on('file:preprocessor', cucumberPreprocessor.default());

      on('after:spec', async (spec, results) => {
        if (
          results.video &&
          !results.tests.some((test) =>
            test.attempts.some((attempt) => attempt.state === 'failed')
          )
        ) {
          await fsPromises.unlink(results.video).catch(console.error);
        }
      });

      // Task for reading file if exists
      on('task', {
        readFileIfExists({ filePath, options = 'utf8' }) {
          console.log(
            `Attempting to read file at path: ${filePath} with options: ${options}`
          ); // Added log
          if (fs.existsSync(filePath)) {
            console.log(`File exists. Reading now.`); // Added log
            return fs.readFileSync(filePath, options);
          } else {
            console.log(`File not found at path: ${filePath}`); // Added log
          }
          return null; // File does not exist
        },
        findScreenshot({ screenshotsFolder, screenshotFileName }) {
          console.log(
            `Searching for screenshot '${screenshotFileName}' in folder '${screenshotsFolder}'`
          );
          return findScreenshotRecursively(
            screenshotsFolder,
            screenshotFileName
          );
        }
      });

      if (process.env.TEST_BROWSER === 'edge') {
        on('before:browser:launch', (browser = {}, launchOptions) => {
          if (browser.family === 'chromium' && browser.name === 'edge') {
            launchOptions.args.push('--headless');
            launchOptions.args.push('--disable-gpu');
            launchOptions.args.push('--no-sandbox');
            launchOptions.args.push('--disable-dev-shm-usage');
          }
          return launchOptions;
        });
      }

      const environment = process.env.TEST_ENV || 'preproduction';
      validateEnvironment(environment);

      const environmentConfig = getConfig(environment);
      if (!environmentConfig?.baseUrl) {
        console.error(
          `Error: No 'baseUrl' found for environment '${environment}'. Please check your configurations.`
        );
        process.exit(1);
      }

      // Check if TEST_BROWSER is firefox and disable video accordingly
      const isFirefox = process.env.TEST_BROWSER === 'firefox';
      const enableVideo = process.env.ENABLE_VIDEO !== 'false' && !isFirefox;

      const enableScreenshotsFail =
        process.env.ENABLE_SCREENSHOTS_FAIL !== 'false';

      console.log(
        `Running tests in the '${environment}' environment with config:`,
        environmentConfig
      );

      config.baseUrl = environmentConfig.baseUrl;
      config.viewportWidth = parseInt(process.env.VIEWPORT_WIDTH || '1920', 10);
      config.viewportHeight = parseInt(
        process.env.VIEWPORT_HEIGHT || '1080',
        10
      );

      return {
        ...config,
        video: enableVideo,
        screenshotOnRunFailure: enableScreenshotsFail,
        env: {
          loggingEnabled: process.env.ENABLE_LOGGING !== 'false',
          logLevel: parseInt(process.env.LOG_LEVEL || '0', 10),
          logTypes: getLogFlags()
        }
      };
    },
    specPattern: 'cypress/e2e/cucumber/feature/**/*.feature',
    supportFile: 'cypress/support/e2e.js',
    videoCompression: 32,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    headless: true
  }
});
