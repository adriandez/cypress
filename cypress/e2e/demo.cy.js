import DemoPage from '../pages/DemoPage';

describe('Demo Test', () => {
  it('should log in successfully', () => {
    const demoPage = new DemoPage();
    const baseUrl = Cypress.env('baseUrl');
    const assertUrl = Cypress.env('assertUrl');

    cy.log(`Base URL: ${baseUrl}`);
    cy.log(`Assert URL: ${assertUrl}`);
    
    demoPage.navigate(baseUrl);
    demoPage.clickDoc();
    cy.url().should('eq', assertUrl);
  });
});