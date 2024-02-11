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

  }
  
  export default BasePage;