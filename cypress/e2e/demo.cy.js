import DemoPage from '../pages/DemoPage';
const demoPage = new DemoPage();

describe('Demo Test', () => {
  it('should log in successfully', () => {
    demoPage.navigate('https://www.groupseres.com/');
    demoPage.clickDoc();
    cy.url().should('eq', 'https://www.groupseres.com/casos-de-exito');
  });
});