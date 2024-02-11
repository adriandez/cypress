const { defineConfig } = require('cypress');
const cucumber = require('cypress-cucumber-preprocessor').default;
const getConfig = require('./getConfig');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber());
      const environment = process.env.TEST_ENV || 'preproduction';
      const browser = process.env.TEST_BROWSER || 'electron';
      const viewportWidth = parseInt(process.env.VIEWPORT_WIDTH) || 1280;
      const viewportHeight = parseInt(process.env.VIEWPORT_HEIGHT) || 720;
      const environmentConfig = getConfig(environment);
      console.log(`-------> Running tests in the '${environment}'`);
      config.baseUrl = environmentConfig.baseUrl;
      config.browser = browser; 
      config.viewportWidth = viewportWidth;
      config.viewportHeight = viewportHeight; 
      return config;
    },
    specPattern: 'cypress/e2e/cucumber/feature/*.feature',
    supportFile: 'cypress/support/e2e.js',
    video: true,
    videosFolder: 'cypress/videos',
    videoCompression: 32,
    screenshotsFolder: 'cypress/screenshots',
    screenshotOnRunFailure: true,
    headless: true,
  },
});
