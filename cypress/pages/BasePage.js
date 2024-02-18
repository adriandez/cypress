class BasePage {
    navigate() {
        const baseUrl = Cypress.config('baseUrl');
        cy.log(`Base URL: ${baseUrl}`);
        cy.visit(baseUrl);
        cy.wait(5000);
    }

    getElement(selector) {
        return cy.get(selector);
    }

    getSelectorData() {
        const data = Cypress.env('selectorData');
        if (!data) {
            throw new Error('Fixture data is not loaded');
        }
        return data;
    }

    assertEqURL(url){
        cy.url().should('eq', url);
    }

  }
  
  export default BasePage;