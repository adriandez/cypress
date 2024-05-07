import { wrapPageActions } from '../../utilities/action-wrapper.js';
import { failSelector } from '../../page-objects/fail-page/fail-page-objects.js';

const actions = {
  navigateToPageFail: () => {
    console.log('navigateToPageFail');
    const baseUrl = Cypress.config('baseUrl');
    cy.visit(baseUrl).then(() => {
      cy.customLog(`Navigated to ${baseUrl}`, { type: 'info' });
    });
  },

  userFailClicksOnButton: () => {
    cy.get(failSelector)
      .should('be.visible')
      .click()
      .then(() => {
        cy.customLog(`Clicked ${failSelector}`, { type: 'info' });
      });
  },

  userIsOnNextPage: () => {
    const assertUrl = Cypress.env('assertUrl');
    cy.url()
      .should('eq', assertUrl)
      .then(() => {
        cy.customLog(`assertEqURL: ${assertUrl}`, { type: 'info' });
      });
  }
};

const wrappedActions = wrapPageActions(actions, 'FailPage');

export default wrappedActions;
