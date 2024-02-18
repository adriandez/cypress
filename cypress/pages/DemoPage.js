import BasePage from './BasePage';

class DemoPage extends BasePage {
  
  constructor() {
    super();
  }

  clickDoc() {
    const data = this.getSelectorData();
    this.getElement(data.demoPage.btnSelector)
      .should('be.visible')
      .click();
  }

  assertNextPage(){
    const assertUrl = Cypress.env('assertUrl');
    cy.log(`Assert URL: ${assertUrl}`);
    this.assertEqURL(assertUrl);
  }
  
}

export default DemoPage;