// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add("safeAction", (fn) => {
    try {
      return fn();
    } catch (err) {
      // Handle error or log
      cy.log(`Error caught in safeAction: ${err.message}`);
      throw err; // or handle it differently
    }
  });

  Cypress.Commands.add("customLog", (message, { type = 'info', enabled = true } = {}) => {
    // Check the global loggingEnabled setting from Cypress configuration
    const loggingEnabled = Cypress.env('loggingEnabled');

    // Only log if enabled both globally and at the call level
    if (enabled && loggingEnabled !== false) { // Explicit check to allow for undefined
      const prefix = type === 'start' ? '🚀' : type === 'end' ? '🏁' : 'ℹ️';
      cy.log(`${prefix} ${message}`);
      console.log(`${prefix} ${message}`);
    }
});
  