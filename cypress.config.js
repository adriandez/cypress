// cypress.config.js
const { defineConfig } = require('cypress');
const cucumber = require('cypress-cucumber-preprocessor').default;

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber());
    },
    baseUrl: process.env.CYPRESS_BASE_URL,
    specPattern: 'cypress/e2e/cucumber/feature/*.feature',
    supportFile: 'cypress/support/e2e.js',
    video: true,
    videosFolder: 'cypress/videos',
    videoCompression: 32,
    screenshotsFolder: 'cypress/screenshots',
    screenshotOnRunFailure: true,
    browser: 'electron',
    headless: true,
  },
});
