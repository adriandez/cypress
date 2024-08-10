import { Given, Then } from 'cypress-cucumber-preprocessor/steps';

Given('I open {string}', (url) => {
  cy.visit(url);
});

Then('I should be on {string}', (url) => {
  cy.url().should('contains', url);
});
