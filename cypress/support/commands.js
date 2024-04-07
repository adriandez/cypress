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
    const logLevel = Cypress.env('logLevel') || 0 // Default log level to 0 if not set
    const logTypes = {
      error: 1, // Log level 1 - Errors
      warning: 1, // Log level 1 - Warnings
      start: 2, // Log level 2 - Start events
      end: 2, // Log level 2 - End events
      attempting: 3, // Log level 3 - Attempting actions
      success: 3, // Log level 3 - Success actions
      // Future or other types can be added here as needed
      info: 4 // Log level 4 - Informational messages
    }

    // Determine if the type of log message is enabled based on the current log level
    const isTypeEnabled =
      logTypes[type] !== undefined && logLevel >= logTypes[type]

    if (loggingEnabled !== false && enabled && isTypeEnabled) {
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

Cypress.Commands.add('safeReadFile', (filePath, options = 'utf8') => {
  return cy.task('readFileIfExists', { filePath, options }).then((content) => {
    if (content === null) {
      cy.log(`File not found: ${filePath}`);
      return null;
    }
    return content;
  });
});