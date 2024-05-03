@REQ_DEMO-39
Feature: DEMO-39-Account-Activity-Logs
	#Keeps track of all account-related activities, including logins, password changes, and settings adjustments for auditing purposes.
	#
	#* *Preconditions:*
	#** The user must perform actions that are logged by the system.
	#** The system must have logging enabled and properly configured.

	Background:
		#@PRECOND_DEMO-54
		Given the system logging is enabled and properly configured

	@TEST_DEMO-49 @TESTSET_DEMO-55
	Scenario: DEMO-49-Logging-User-Login-Activity
		Given a registered user with the email "user@example.com" and password "SecurePass123!"
		When the user logs in to the system
		Then the login activity should be logged with details "user@example.com logged in successfully"
		
	@TEST_DEMO-50 @TESTSET_DEMO-55
	Scenario: DEMO-50-Logging-Password-Change-Activity
		Given a logged-in user with the email "user@example.com"
		When the user changes their password to "NewSecurePass123!"
		Then the password change activity should be logged with details "user@example.com changed password"
		
	@TEST_DEMO-51 @TESTSET_DEMO-55
	Scenario: DEMO-51-Logging-Settings-Adjustment-Activity
		Given a logged-in user with the email "user@example.com"
		When the user updates their notification settings
		Then the settings adjustment activity should be logged with details "user@example.com updated notification settings"
		
	@TEST_DEMO-52 @TESTSET_DEMO-55
	Scenario: DEMO-52-Logging-Failures-Due-to-Disabled-Logging-System
		Given the system logging is disabled
		And a logged-in user with the email "user@example.com"
		When the user logs out
		Then no activity should be logged
		And a system alert "Logging failed - logging system disabled" should be issued
		
	@TEST_DEMO-53 @TESTSET_DEMO-55
	Scenario: DEMO-53-Logging-Multiple-Activities
		Given a logged-in user with the email "user@example.com"
		When the user changes their email to "newUser@example.com" and logs out
		Then the email change activity should be logged with details "user@example.com changed email to newUser@example.com"
		And the logout activity should be logged with details "newUser@example.com logged out"
		
