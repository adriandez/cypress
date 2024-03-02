import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'
import * as DemoPageActions from '../../../../support/actions/demo-page-actions'

Given('User is on the webpage', () => {
  DemoPageActions.navigateToPage()
})

When('User clicks on button', () => {
  DemoPageActions.userClicksOnButton()
})

Then('User is on the next page', () => {
  DemoPageActions.userIsOnNextPage()
})
