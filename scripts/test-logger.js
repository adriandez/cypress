// Import the logger module
import { logger } from './logger.js'; // Adjust the path as necessary

// Function to simulate application behavior and test logger
const testLogger = () => {
  console.log('Testing logger functionality...');

  // Test different log types
  logger.info('This is an informational message.');
  logger.warn('This is a warning message.');
  logger.error('This is an error message.');
  logger.debug('This is a debug message.');
  logger.start('A process is starting.');
  logger.attempting('Attempting to perform an action.');
  logger.success('The action has been performed successfully.');
  logger.end('The process has ended.');

  console.log('All log types have been tested.');
};

testLogger();
