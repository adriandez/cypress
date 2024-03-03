// Assuming wrapPageActions is properly defined in '../../utilities/action-wrapper'
const { wrapPageActions } = require('../../utilities/action-wrapper')
const { failSelector } = require('../../page-objects/fail-page/fail-page')

const actions = {
  navigateToPageFail: () => {
    console.log('navigateToPageFail')
    const baseUrl = Cypress.config('baseUrl')
    cy.visit(baseUrl).then(() => {
      cy.customLog(`Navigated to ${baseUrl}`, { type: 'info' })
    })
  },

  userFailClicksOnButton: () => {
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.get(failSelector)
      .should('be.visible')
      .click()
      .then(() => {
        cy.customLog(`Clicked ${failSelector}`, { type: 'info' })
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

// Wrap all actions for the fail page
const wrappedActions = wrapPageActions(actions, 'FailPage')

module.exports = wrappedActions
