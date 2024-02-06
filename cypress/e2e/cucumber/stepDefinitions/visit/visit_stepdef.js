import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import DemoPage from '../../../../pages/DemoPage';

const demoPage = new DemoPage();

Given('User is on the webpage', () => {
  const baseUrl = Cypress.env('baseUrl');
  cy.log(`Base URL: ${baseUrl}`);
  demoPage.navigate(baseUrl);
});

When('User clicks on button', () => {
  demoPage.clickDoc();
});

Then('User is on the next page', () => {
  const assertUrl = Cypress.env('assertUrl');
  cy.log(`Assert URL: ${assertUrl}`);
  cy.url().should('eq', assertUrl);
});
