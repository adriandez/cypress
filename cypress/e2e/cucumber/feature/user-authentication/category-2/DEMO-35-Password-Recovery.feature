@REQ_DEMO-35
Feature: DEMO-35-Password-Recovery
	#Enables users to reset their password through a secure process involving email verification.
	#
	#* *Preconditions:*
	#** The user must provide a registered email address.
	#** The user must be able to access the email to click on the recovery link.

	#Tests Enables users to reset their password through a secure process involving email verification.
	#
	#* *Preconditions:*
	#** The user must provide a registered email address.
	#** The user must be able to access the email to click on the recovery link.
	@TEST_DEMO-82 @TESTSET_DEMO-87
	Scenario: DEMO-82-Successful-password-reset-with-email-verification
		Given a user with a registered email "user@example.com"
		When the user requests a password reset for "user@example.com"
		Then a password reset email should be sent to "user@example.com"
		And when the user clicks the verification link in the email
		And the user sets their new password to "NewSecurePassword123!"
		Then the password reset should be successful
		And a message "Your password has been reset successfully" should be displayed
		
	@TEST_DEMO-83 @TESTSET_DEMO-87
	Scenario: DEMO-83-Password-reset-attempt-with-unregistered-email
		Given an email address "unregistered@example.com" that is not linked to any account
		When the user requests a password reset for "unregistered@example.com"
		Then no password reset email should be sent to "unregistered@example.com"
		And a message "No account found with that email address" should be displayed
		
	@TEST_DEMO-84 @TESTSET_DEMO-87
	Scenario: DEMO-84-Password-reset-with-email-access-issue
		Given a user with a registered email "user@example.com"
		But the user cannot access the email account "user@example.com"
		When the user requests a password reset for "user@example.com"
		Then a password reset email should be sent to "user@example.com"
		But the user is unable to click the verification link due to access issues
		Then the password reset should not proceed
		And a message "Unable to access your email? Contact support for help." should be displayed
		
	@TEST_DEMO-85 @TESTSET_DEMO-87
	Scenario: DEMO-85-Password-reset-without-completing-email-verification
		Given a user with a registered email "user@example.com"
		When the user requests a password reset for "user@example.com"
		And a password reset email is sent to "user@example.com"
		But the user does not click the verification link within 24 hours
		Then the password reset link should expire
		And the user should receive a message "Your password reset link has expired. Please request a new one."
		
	@TEST_DEMO-86 @TESTSET_DEMO-87
	Scenario: DEMO-86-Password-reset-and-subsequent-login
		Given a user with a registered email "user@example.com"
		When the user successfully resets their password to "NewPassword123!"
		And logs in with email "user@example.com" and password "NewPassword123!"
		Then the login should be successful
		And the user should have access to their account with the new password
		
