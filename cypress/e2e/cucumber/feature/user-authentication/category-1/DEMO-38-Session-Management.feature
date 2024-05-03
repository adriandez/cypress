@REQ_DEMO-38
Feature: DEMO-38-Session-Management
	#Manages user sessions to ensure that users are automatically logged out after a period of inactivity.
	#
	#* *Preconditions:*
	#** The user must be logged in.
	#** A preset period of inactivity must have been reached.

	Background:
		#@PRECOND_DEMO-61
		Given the system has a preset inactivity timeout of 30 minutes

	@TEST_DEMO-56 @TESTSET_DEMO-62
	Scenario: DEMO-56-User-is-automatically-logged-out-after-inactivity
		Given a user "user@example.com" is logged in
		When the user does not interact with the system for 30 minutes
		Then the user should be automatically logged out
		And a message "You have been logged out due to inactivity" should be displayed
		
	@TEST_DEMO-57 @TESTSET_DEMO-62
	Scenario: DEMO-57-User-remains-active-and-is-not-logged-out
		Given a user "user@example.com" is logged in
		When the user interacts with the system at least once every 29 minutes
		Then the user should not be logged out
		And the session should be extended by 30 minutes after each interaction
		
	@TEST_DEMO-58 @TESTSET_DEMO-62
	Scenario: DEMO-58-User-activity-just-before-inactivity-timeout-expires
		Given a user "user@example.com" is logged in
		When the user interacts with the system at 29 minutes and 59 seconds
		Then the user should not be logged out
		And the session should be extended by 30 minutes from the time of the last interaction
		
	@TEST_DEMO-59 @TESTSET_DEMO-62
	Scenario: DEMO-59-User-logs-out-manually-before-automatic-logout
		Given a user "user@example.com" is logged in
		When the user chooses to log out manually after 15 minutes of activity
		Then the user should be successfully logged out
		And a message "You have been logged out successfully" should be displayed
		
	@TEST_DEMO-60 @TESTSET_DEMO-62
	Scenario: DEMO-60-Automatic-logout-when-user-leaves-browser-idle
		Given a user "user@example.com" is logged in and leaves the browser idle
		When 30 minutes of inactivity have passed
		Then the user should be automatically logged out
		And a message "Your session has expired due to inactivity" should be displayed
		
