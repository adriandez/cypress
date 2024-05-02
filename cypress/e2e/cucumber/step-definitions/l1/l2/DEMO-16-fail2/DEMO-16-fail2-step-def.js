import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import * as DemoPageActions from '../../../../../../support/actions/fail-page/fail-page-actions';

Given('User is on the webpage fail 2', () => {
  DemoPageActions.navigateToPageFail();
});

When('User clicks on button fail 2', () => {
  DemoPageActions.userFailClicksOnButton();
});

Then('User is on the next page fail 2', () => {
  DemoPageActions.userIsOnNextPage();
});
