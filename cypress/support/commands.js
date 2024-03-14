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
    const loggingEnabled = Cypress.env('loggingEnabled')
    const logTypes = Cypress.env('logTypes') || {}

    console.log(`loggingEnabled: ${loggingEnabled}`)
    console.log(`logTypes: ${JSON.stringify(logTypes)}`)

    const isLogTypeEnabled = logTypes.hasOwnProperty(type)
      ? logTypes[type]
      : true

    if (enabled && loggingEnabled !== false && isLogTypeEnabled) {
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
