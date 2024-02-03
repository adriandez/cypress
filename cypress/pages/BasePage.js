class BasePage {
    navigate(path) {
        cy.visit(path);
        cy.wait(5000);
    }

    getElement(selector) {
        return cy.get(selector);
    }

  }
  
  export default BasePage;