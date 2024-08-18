Feature: Access a URL and assert fail you are on that URL

  Scenario: Access the home page and verify assert fail
    Given I open "https://www.google.com"
    Then I should be on "https://www.youtube.com"
