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
    console.log(`logTypes: ${logTypes}`)

    const isLogTypeEnabled = Object.prototype.hasOwnProperty.call(
      logTypes,
      type
    )
      ? logTypes[type]
      : true

    if (enabled && loggingEnabled !== false && isLogTypeEnabled) {
      const prefix =
        type === 'start'
          ? '🚀'
          : type === 'end'
            ? '🏁'
            : type === 'error'
              ? '❌'
              : 'ℹ️'
      cy.log(`${prefix} ${message}`)
      console.log(`${prefix} ${message}`)
    }
  }
)
