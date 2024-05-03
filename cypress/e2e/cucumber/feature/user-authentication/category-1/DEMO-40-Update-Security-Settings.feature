@REQ_DEMO-40
Feature: DEMO-40-Update-Security-Settings
	#Allows users to update their security settings, including changing passwords and toggling MFA.
	#
	## *Preconditions:*
	##* The user must be logged in.
	##* The user must know their current password to change it.

	@TEST_DEMO-70 @TESTSET_DEMO-75
	Scenario: DEMO-70-Successful-password-change
		Given a logged-in user "user@example.com" who knows their current password "OldPass123!"
		When the user changes their password from "OldPass123!" to "NewPass123!"
		Then the password change should be successful
		And a message "Your password has been updated successfully" should be displayed
		
	@TEST_DEMO-71 @TESTSET_DEMO-75
	Scenario: DEMO-71-Failed-password-change-with-incorrect-current-password
		Given a logged-in user "user@example.com" who attempts to use an incorrect current password "Incorrect123"
		When the user tries to change their password to "NewPass123!"
		Then the password change should fail
		And a message "Incorrect current password" should be displayed
		
	@TEST_DEMO-72 @TESTSET_DEMO-75
	Scenario: DEMO-72-Enable-Multi-factor-Authentication
		Given a logged-in user "user@example.com" with current password "Secure123!"
		When the user opts to enable MFA
		Then MFA should be enabled for the user's account
		And a message "Multi-factor authentication has been enabled" should be displayed
		
	@TEST_DEMO-73 @TESTSET_DEMO-75
	Scenario: DEMO-73-Disable-Multi-factor-Authentication
		Given a logged-in user "user@example.com" with MFA enabled and current password "Secure123!"
		When the user opts to disable MFA
		Then MFA should be disabled for the user's account
		And a message "Multi-factor authentication has been disabled" should be displayed
		
	@TEST_DEMO-74 @TESTSET_DEMO-75
	Scenario: DEMO-74-Update-Security-Settings-without-changing-password
		Given a logged-in user "user@example.com" with current password "StablePass123!"
		When the user updates their security settings without changing their password
		Then the update should be successful
		And no change to the user's password should occur
		And a message "Your security settings have been updated" should be displayed
		
