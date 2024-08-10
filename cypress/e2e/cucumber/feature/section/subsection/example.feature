Feature: Access a URL and assert you are on that URL

  Scenario: Access the home page and verify the URL
    Given I open "https://www.google.com"
    Then I should be on "https://www.google.com"
