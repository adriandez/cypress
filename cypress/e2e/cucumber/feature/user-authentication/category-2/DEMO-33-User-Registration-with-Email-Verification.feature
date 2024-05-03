@REQ_DEMO-33
Feature: DEMO-33-User-Registration-with-Email-Verification
	#Allows new users to securely register for an account with email verification.
	#
	#* *Preconditions:*
	#** The user must not already have an account with the same email address.
	#** The user must provide all required fields, including a valid email address and a strong password.

	Background:
		#@PRECOND_DEMO-42
		Given no existing user with the email "test@example.com"

	@TEST_DEMO-41 @TESTSET_DEMO-43
	Scenario: DEMO-41-Successful-Registration-with-Valid-Credentials
		When a new user attempts to register with the following details:
		      | email             | password  |
		      | test@example.com  | Pass1234! |
		Then the registration should be successful
		And a verification email should be sent to "test@example.com"
		
	@TEST_DEMO-44 @TESTSET_DEMO-43
	Scenario: DEMO-44-Registration-with-Already-Used-Email
		Given an existing user with the email "existing@example.com"
		When a new user attempts to register with the following details:
		  | email                | password  |
		  | existing@example.com | Pass1234! |
		Then the registration should fail
		And a message "Email already in use" should be displayed
		
	@TEST_DEMO-45 @TESTSET_DEMO-43
	Scenario: DEMO-45-Registration-with-Invalid-Email-Format
		When a new user attempts to register with the following details:
		  | email          | password  |
		  | notanemail.com | Pass1234! |
		Then the registration should fail
		And a message "Invalid email format" should be displayed
		
	@TEST_DEMO-46 @TESTSET_DEMO-43
	Scenario: DEMO-46-Registration-with-Weak-Password
		When a new user attempts to register with the following details:
		  | email             | password |
		  | test@example.com  | password |
		Then the registration should fail
		And a message "Password does not meet security requirements" should be displayed
		
	@TEST_DEMO-47 @TESTSET_DEMO-43
	Scenario: DEMO-47-Registration-with-Missing-Required-Fields
		When a new user attempts to register with the following details:
		  | email             | password |
		  |                   |          |
		Then the registration should fail
		And a message "All fields are required" should be displayed
		
