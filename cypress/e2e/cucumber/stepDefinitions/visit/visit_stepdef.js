import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import DemoPage from '../../../../pages/DemoPage';

const demoPage = new DemoPage();

Given('User is on the webpage', () => {
  demoPage.navigate();
});

When('User clicks on button', () => {
  demoPage.clickDoc();
});

Then('User is on the next page', () => {
  demoPage.assertNextPage();
});
