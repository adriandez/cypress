import { wrapPageActions } from '../../utilities/action-wrapper.js';
import { btnSelector } from '../../page-objects/demo-page/demo-page-objects.js';

const pageActions = {
  navigateToPage: () => {
    console.log('navigateToPage');
    const baseUrl = Cypress.config('baseUrl');
    cy.visit(baseUrl).then(() => {
      cy.customLog(`Navigated to ${baseUrl}`, { type: 'info' });
    });
  },

  userClicksOnButton: () => {
    console.log('userClicksOnButton');

    cy.get(btnSelector)
      .should('be.visible')
      .click()
      .then(() => {
        cy.customLog(`Clicked ${btnSelector}`, { type: 'info' });
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

const wrappedPageActions = wrapPageActions(pageActions, 'DemoPage');

export default wrappedPageActions;
