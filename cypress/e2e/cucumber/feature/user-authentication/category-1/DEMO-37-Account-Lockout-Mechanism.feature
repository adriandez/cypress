@REQ_DEMO-37
Feature: DEMO-37-Account-Lockout-Mechanism
	#Locks out the account after several unsuccessful login attempts to prevent brute force attacks.
	#
	#* *Preconditions:*
	#** The user must have failed login attempts that exceed the system's configured threshold.

	Background:
		#@PRECOND_DEMO-68
		Given the system's configured threshold for unsuccessful login attempts is 5

	@user-authentication @category-1
	@TEST_DEMO-63 @TESTSET_DEMO-69
	Scenario: DEMO-63-Account-is-locked-after-exceeding-unsuccessful-login-attempts
		Given a user "user@example.com" with a known password "SecurePass123!"
		When the user enters the wrong password more than 5 times
		Then the user's account should be locked
		And a message "Your account has been locked due to multiple failed login attempts" should be displayed
		
	@user-authentication @category-1
	@TEST_DEMO-64 @TESTSET_DEMO-69
	Scenario: DEMO-64-Login-attempt-just-before-reaching-the-lockout-threshold
		Given a user "user@example.com" with a known password "SecurePass123!"
		When the user enters the wrong password 4 times
		And then enters the correct password on the 5th attempt
		Then the user should be successfully logged in
		And the user's account should not be locked
		
	@user-authentication @category-1
	@TEST_DEMO-65 @TESTSET_DEMO-69
	Scenario: DEMO-65-Account-lockout-duration-before-automatic-reset
		Given a user "user@example.com" whose account has been locked
		When the user tries to log in within the lockout period of 30 minutes
		Then the login should fail
		And a message "Your account is temporarily locked. Please try again later" should be displayed
		
	@user-authentication @category-1
	@TEST_DEMO-66 @TESTSET_DEMO-69
	Scenario: DEMO-66-Account-automatically-unlocks-after-the-lockout-period
		Given a user "user@example.com" whose account has been locked
		And 30 minutes have passed since the account was locked
		When the user attempts to log in with the correct password
		Then the user should be successfully logged in
		And the user's account should no longer be locked
		
	@user-authentication @category-1
	@TEST_DEMO-67 @TESTSET_DEMO-69
	Scenario: DEMO-67-Reset-password-after-account-lockout
		Given a user "user@example.com" whose account has been locked
		When the user resets their password through the "Forgot Password" link
		And successfully sets a new password
		Then the account should be unlocked
		And the user should be able to log in with the new password
		
