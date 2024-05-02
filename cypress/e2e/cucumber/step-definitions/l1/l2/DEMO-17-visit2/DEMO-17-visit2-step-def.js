import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import * as DemoPageActions from '../../../../../../support/actions/demo-page/demo-page-actions';

Given('User is on the webpage 2', () => {
  DemoPageActions.navigateToPage();
});

When('User clicks on button 2', () => {
  DemoPageActions.userClicksOnButton();
});

Then('User is on the next page 2', () => {
  DemoPageActions.userIsOnNextPage();
});
