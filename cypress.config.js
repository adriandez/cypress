import { defineConfig } from 'cypress';
import cucumberPreprocessor from 'cypress-cucumber-preprocessor';
import { getConfig } from './get-config.js';
import fsPromises from 'fs/promises';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { format } from 'date-fns';
import { logDirectoryStructure } from './cypress/utils/log-directory-structure.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

      on('task', {
        async findScreenshot({ screenshotsFolder, screenshotFileName }) {
          console.log(
            `Searching for screenshot '${screenshotFileName}' in folder '${screenshotsFolder}'`
          );

          const screenshotPath = await findScreenshotRecursively(
            screenshotsFolder,
            screenshotFileName
          );

          const logFileName = `log_${format(new Date(), 'yyyyMMdd_HHmmss')}.txt`;
          const logFilePath = path.join(__dirname, logFileName);

          if (screenshotPath) {
            console.log(`Screenshot found at: ${screenshotPath}`);
            return screenshotPath;
          } else {
            console.log(`Screenshot not found. Logging directory structure...`);

            // Only log the structure of the screenshots folder recursively (full content)
            await logDirectoryStructure(screenshotsFolder, logFilePath, true);

            console.log(`Directory structure logged to: ${logFilePath}`);
            return null;
          }
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
