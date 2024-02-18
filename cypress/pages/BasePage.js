class BasePage {
    constructor() {
        this.wrapMethodsWithLogging();
      }
    
      wrapMethodsWithLogging() {
        Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach(methodName => {
          const originalMethod = this[methodName];
          if (typeof originalMethod === 'function' && methodName !== 'constructor' && methodName !== 'wrapMethodsWithLogging') {
            this[methodName] = function(...args) {
              // Log before the original method execution
              cy.customLog(`Starting execution: ${methodName}`, { type: 'info' });
              // Wrap the execution in a cy.then() to ensure it's managed in the command queue
              cy.then(() => {
                // Execute the original method and capture any direct return value (if any)
                const possibleReturnValue = originalMethod.apply(this, args);
              }).then(() => {
                // Log after the method execution
                cy.customLog(`Completed execution: ${methodName}`, { type: 'info' });
              });
            };
          }
        });
      }

    navigate() {
        const baseUrl = Cypress.config('baseUrl');
        cy.visit(baseUrl).then(() => {
            cy.customLog(`Navigated to ${baseUrl}`, { type: 'info' });
        });
    }

    getElement(selector) {
        return cy.get(selector);
    }

    getSelectorData() {
        const data = Cypress.env('selectorData')
        if (data) {
            cy.customLog('Using saved selectorData from env', { type: 'info' });
        } else {
            cy.customLog('No selectorData found in env', { type: 'warning' });
        }
        return data;
    }

    assertEqURL(url){
        cy.url().should('eq', url).then(() => {
            cy.customLog(`assertEqURL: ${url}`, { type: 'info' });
        });
    }
  }
  
  export default BasePage;