import BasePage from './BasePage';

class DemoPage extends BasePage {
  
  constructor() {
    super();
  }

  clickDoc() {
    this.getElement('#hs_cos_wrapper_header_navigation_primary > nav > ul > li.no-submenu.menu-item.hs-skip-lang-url-rewrite > a')
    .should('be.visible')
    .click();
  }
  
}

export default DemoPage;