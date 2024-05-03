@REQ_DEMO-36
Feature: DEMO-36-Multi-factor-Authentication-Setup
	#Users can opt into an additional security layer by setting up MFA.
	#
	#* *Preconditions:*
	#** The user must be logged in to their account.
	#** The user must have a valid phone number or an authenticator app installed.

	#Tests Users can opt into an additional security layer by setting up MFA.
	#
	#* *Preconditions:*
	#** The user must be logged in to their account.
	#** The user must have a valid phone number or an authenticator app installed.
	@TEST_DEMO-76 @TESTSET_DEMO-81
	Scenario: DEMO-76-Successfully-enable-MFA-with-phone-number
		Given a logged-in user "user@example.com" with a verified phone number "123-456-7890"
		When the user opts to enable MFA using their phone number
		Then MFA should be successfully enabled
		And a verification code should be sent to "123-456-7890"
		And a message "Multi-factor authentication has been enabled" should be displayed
		
	@TEST_DEMO-77 @TESTSET_DEMO-81
	Scenario: DEMO-77-Successfully-enable-MFA-with-an-authenticator-app
		Given a logged-in user "user@example.com" with an authenticator app installed
		When the user opts to enable MFA using the authenticator app
		Then MFA should be successfully enabled
		And the user should be prompted to scan a QR code
		And a message "Multi-factor authentication has been enabled" should be displayed
		
	@TEST_DEMO-78 @TESTSET_DEMO-81
	Scenario: DEMO-78-Failed-attempt-to-enable-MFA-without-a-phone-number
		Given a logged-in user "user@example.com" without a verified phone number
		When the user tries to enable MFA using a phone number
		Then the MFA setup should fail
		And a message "No verified phone number found" should be displayed
		
	@TEST_DEMO-79 @TESTSET_DEMO-81
	Scenario: DEMO-79-Failed-attempt-to-enable-MFA-without-an-authenticator-app
		Given a logged-in user "user@example.com" without an authenticator app installed
		When the user tries to enable MFA using the authenticator app
		Then the MFA setup should fail
		And a message "Authenticator app not detected" should be displayed
		
	@TEST_DEMO-80 @TESTSET_DEMO-81
	Scenario: DEMO-80-Disable-MFA-after-enabling-it
		Given a logged-in user "user@example.com" with MFA enabled
		When the user opts to disable MFA
		Then MFA should be successfully disabled
		And a message "Multi-factor authentication has been disabled" should be displayed
		
