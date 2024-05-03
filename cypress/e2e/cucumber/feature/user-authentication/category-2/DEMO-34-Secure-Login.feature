@REQ_DEMO-34
Feature: DEMO-34-Secure-Login
	#Users can log in using their credentials with the option for multi-factor authentication.
	#
	#* *Preconditions:*
	#** The user must have an existing account.
	#** The user must enter the correct username and password combination.
	#** If MFA is enabled, the user must complete the second verification step.

	#Tests Users can log in using their credentials with the option for multi-factor authentication.
	#
	#* *Preconditions:*
	#** The user must have an existing account.
	#** The user must enter the correct username and password combination.
	#** If MFA is enabled, the user must complete the second verification step.
	@TEST_DEMO-88 @TESTSET_DEMO-94
	Scenario: DEMO-88-Successful-login-without-MFA
		Given a user with the username "user@example.com" and password "SecurePassword123"
		When the user logs in with username "user@example.com" and password "SecurePassword123"
		Then the user should be successfully logged in
		And the user should be redirected to their dashboard
		
	@TEST_DEMO-89 @TESTSET_DEMO-94
	Scenario: DEMO-89-Failed-login-with-incorrect-password
		Given a user with the username "user@example.com" and password "SecurePassword123"
		When the user attempts to log in with username "user@example.com" and password "WrongPassword"
		Then the login should fail
		And a message "Incorrect username or password" should be displayed
		
	@TEST_DEMO-90 @TESTSET_DEMO-94
	Scenario: DEMO-90-Successful-login-with-MFA-enabled
		Given a user with MFA enabled and the username "user@example.com" and password "SecurePassword123"
		And the user has a registered authentication app
		When the user logs in with username "user@example.com" and password "SecurePassword123"
		And the user enters the correct MFA code from their authentication app
		Then the user should be successfully logged in
		And the user should be redirected to their dashboard
		
	@TEST_DEMO-91 @TESTSET_DEMO-94
	Scenario: DEMO-91-Failed-login-with-MFA-enabled-and-incorrect-MFA-code
		Given a user with MFA enabled and the username "user@example.com" and password "SecurePassword123"
		And the user has a registered authentication app
		When the user logs in with username "user@example.com" and password "SecurePassword123"
		And the user enters an incorrect MFA code from their authentication app
		Then the login should fail
		And a message "Incorrect MFA code" should be displayed
		
	@TEST_DEMO-92 @TESTSET_DEMO-94
	Scenario: DEMO-92-Failed-login-due-to-expired-MFA-code
		Given a user with MFA enabled and the username "user@example.com" and password "SecurePassword123"
		And the user has a registered authentication app
		When the user logs in with username "user@example.com" and password "SecurePassword123"
		And the user enters an expired MFA code from their authentication app
		Then the login should fail
		And a message "Expired MFA code" should be displayed
		
	@TEST_DEMO-93 @TESTSET_DEMO-94
	Scenario: DEMO-93-Login-attempt-after-multiple-failed-attempts
		Given a user with the username "user@example.com" and password "SecurePassword123"
		And the user has made three failed login attempts
		When the user attempts to log in with username "user@example.com" and password "SecurePassword123"
		Then the login should be temporarily blocked
		And a message "Account temporarily locked due to multiple failed attempts" should be displayed
		
