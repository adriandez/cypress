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
Cypress.Commands.add(
  'customLog',
  (message, { type = 'info', enabled = true } = {}) => {
    const loggingEnabled = Cypress.env('loggingEnabled') // Global logging switch
    const logTypes = Cypress.env('logTypes') || {}

    // Ensure the log type is considered enabled if not explicitly set in `logTypes`.
    const isLogTypeEnabled = Object.prototype.hasOwnProperty.call(
      logTypes,
      type
    )
      ? logTypes[type]
      : true

    // Log if globally enabled, the action's logging is not explicitly disabled, and the log type is enabled.
    if (loggingEnabled !== false && enabled && isLogTypeEnabled) {
      let prefix
      switch (type) {
        case 'start':
          prefix = '🚀'
          break
        case 'end':
          prefix = '🏁'
          break
        case 'error':
          prefix = '❌'
          break
        case 'attempting':
          prefix = '🔍'
          break
        case 'success':
          prefix = '✅'
          break
        case 'warning':
          prefix = '⚠️'
          break
        default:
          prefix = 'ℹ️'
      }
      cy.log(`${prefix} ${message}`)
      console.log(`${prefix} ${message}`)
    }
  }
)
