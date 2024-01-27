class DemoPage {

  clickDoc() {
    cy.get('#hs_cos_wrapper_header_navigation_primary > nav > ul > li.no-submenu.menu-item.hs-skip-lang-url-rewrite > a')
    .should('be.visible')
    .click();
  } 

}

export default DemoPage;