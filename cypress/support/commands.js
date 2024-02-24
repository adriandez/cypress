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
Cypress.Commands.add('safeAction', (fn) => {
  try {
    // Log before attempting the action
    cy.customLog('Attempting safe action', { type: 'start' })
    return fn()
  } catch (err) {
    // Log the error
    cy.customLog(`Error caught in safeAction: ${err.message}`, {
      type: 'error'
    })
    throw err
  } finally {
    // Log after the action attempt, regardless of success or failure
    cy.customLog('Completed safe action attempt', { type: 'end' })
  }
})

Cypress.Commands.add(
  'customLog',
  (message, { type = 'info', enabled = true } = {}) => {
    const loggingEnabled = Cypress.env('loggingEnabled')
    const logTypes = Cypress.env('logTypes') || {}

    // Safely determine if the specific log type is enabled
    const isLogTypeEnabled = Object.prototype.hasOwnProperty.call(
      logTypes,
      type
    )
      ? logTypes[type]
      : true

    // Only log if enabled both globally, at the call level, and for the specific log type
    if (enabled && loggingEnabled !== false && isLogTypeEnabled) {
      const prefix =
        type === 'start'
          ? '🚀'
          : type === 'end'
            ? '🏁'
            : type === 'error'
              ? '❌'
              : 'ℹ️' // Added 'error' type handling
      cy.log(`${prefix} ${message}`)
      console.log(`${prefix} ${message}`)
    }
  }
)
