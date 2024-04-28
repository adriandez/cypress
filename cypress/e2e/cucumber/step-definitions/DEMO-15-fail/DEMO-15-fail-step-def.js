import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import * as FailPageActions from '../../../../support/actions/fail-page/fail-page-actions'

Given('User is on the webpage fail', () => {
  FailPageActions.navigateToPageFail()
})

When('User clicks on button fail', () => {
  FailPageActions.userFailClicksOnButton()
})

Then('User is on the next page fail', () => {
  FailPageActions.userIsOnNextPage()
})
