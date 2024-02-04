const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.groupseres.com/',
    specPattern: 'cypress/e2e/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    video: true,
    videosFolder: 'cypress/videos',
    videoCompression: 32,
    videoUploadOnPasses: false,
    screenshotsFolder: 'cypress/screenshots',
    screenshotOnRunFailure: true,
    browser: 'electron',
    headless: true,
    // Consider adding environment-specific configurations here if necessary
  },
});
