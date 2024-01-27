import DemoPage from '../pages/DemoPage';

describe('Demo Test', () => {
  it('should log in successfully', () => {
    
    cy.visit('https://www.groupseres.com/');
    cy.wait(5000);

    const demoPage = new DemoPage();

    demoPage.clickDoc();
    cy.url().should('eq', 'https://www.groupseres.com/casos-de-exito');
  });
});