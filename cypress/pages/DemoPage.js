import BasePage from './BasePage'

class DemoPage extends BasePage {
  constructor() {
    super()
  }

  clickDoc() {
    const data = this.getSelectorData()
    this.getElement(data.demoPage.btnSelector)
      .should('be.visible')
      .click()
      .then(() => {
        cy.customLog(`Clicked ${data.demoPage.btnSelector}`, { type: 'info' })
      })
  }

  assertNextPage() {
    const assertUrl = Cypress.env('assertUrl')
    this.assertEqURL(assertUrl)
  }
}

export default DemoPage
