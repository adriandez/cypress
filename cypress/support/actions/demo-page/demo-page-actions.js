const { wrapPageActions } = require('../../utilities/action-wrapper')
const { btnSelector } = require('../../page-objects/demo-page/demo-page')

const pageActions = {
  navigateToPage: () => {
    console.log('navigateToPage')
    const baseUrl = Cypress.config('baseUrl')
    cy.visit(baseUrl).then(() => {
      cy.customLog(`Navigated to ${baseUrl}`, { type: 'info' })
    })
  },

  userClicksOnButton: () => {
    console.log('userClicksOnButton')
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get(btnSelector)
      .should('be.visible')
      .click()
      .then(() => {
        cy.customLog(`Clicked ${btnSelector}`, { type: 'info' })
      })
  },

  userIsOnNextPage: () => {
    const assertUrl = Cypress.env('assertUrl')
    cy.url()
      .should('eq', assertUrl)
      .then(() => {
        cy.customLog(`assertEqURL: ${assertUrl}`, { type: 'info' })
      })
  }
}

const wrappedPageActions = wrapPageActions(pageActions, 'DemoPage')

module.exports = wrappedPageActions
