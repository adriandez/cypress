// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

before(() => {
  cy.log('BEFORE');
  cy.fixture('selector.json').then((data) => {
    Cypress.env('selectorData', data);
  });
});

afterEach(function () {
  if (window.cucumberJson?.generate && this.currentTest.state === 'failed') {
    const screenshotsEnabled = Cypress.config('screenshotOnRunFailure');
    const screenshotsFolder = Cypress.config('screenshotsFolder');
    const testState = window.testState;
    const stepResult =
      testState.runTests[testState.currentScenario.name][testState.currentStep];
    const featureName = this.currentTest.parent.title.toLowerCase();

    if (screenshotsEnabled) {
      const absoluteFilePath =
        this.currentTest.parent.invocationDetails.absoluteFile;
      const relativeFilePath = absoluteFilePath.split('cucumber/feature/')[1];
      const normalizedPath = relativeFilePath.replace(/\\/g, '/');
      const screenshotFileName = `${featureName} -- ${this.currentTest.title} (failed).png`;
      const filePath = `${screenshotsFolder}/${normalizedPath}/${screenshotFileName}`;

      cy.safeReadFile(filePath, 'base64').then((imgData) => {
        if (imgData) {
          cy.log(`Attaching image: ${filePath}`);
          attachScreenshotToReport(imgData, stepResult, testState);
        } else {
          cy.log(`Screenshot not found at ${filePath}`);
        }
      });
    }
  }
});

const attachScreenshotToReport = (imgData, stepResult, testState) => {
  if (imgData && stepResult && testState) {
    stepResult.attachment = {
      data: imgData,
      media: { type: 'image/png' },
      index: testState.currentStep,
      testCase: testState.formatTestCase(testState.currentScenario)
    };
  }
};

after(() => {
  cy.log('AFTER');
});
