import { btnSelector } from '../page-objects/demo-page'

export const navigateToPage = () => {
  const baseUrl = Cypress.config('baseUrl')
  cy.visit(baseUrl).then(() => {
    cy.customLog(`Navigated to ${baseUrl}`, { type: 'info' })
  })
}

export const userClicksOnButton = () => {
  // eslint-disable-next-line cypress/unsafe-to-chain-command
  cy.get(btnSelector)
    .should('be.visible')
    .click()
    .then(() => {
      cy.customLog(`Clicked ${btnSelector}`, { type: 'info' })
    })
}

export const userIsOnNextPage = () => {
  const assertUrl = Cypress.env('assertUrl')
  cy.url()
    .should('eq', assertUrl)
    .then(() => {
      cy.customLog(`assertEqURL: ${assertUrl}`, { type: 'info' })
    })
}
