import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define file and directory names based on the current file URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Specify the directory where log files will be stored
const logsDir = path.join(__dirname, 'logs');

// Create the logs directory if it does not exist
try {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
} catch (error) {
  console.error('Failed to create log directory:', error);
}

// Helper function to create a timestamp for filenames
const timestamp = () => new Date().toISOString().replace(/[:.]/g, '-');

// Determine the filename for logging based on the current timestamp
const logFile = path.join(logsDir, `app-${timestamp()}.log`);

// Logger object with various logging methods
export const logger = {
  log: (level, message) => {
    const now = new Date().toISOString();
    const color = logger.getColor(level);
    const formattedMessages = logger.formatMessage(level, now, message);

    formattedMessages.forEach((formattedMessage) => {
      // Output to the console with color formatting
      console.log(`${color}${formattedMessage}\x1b[0m`);

      // Write to the log file
      try {
        fs.appendFileSync(logFile, `${formattedMessage}\n`, 'utf8');
      } catch (error) {
        console.error('Error writing to log file:', error);
      }
    });
  },
  info: (message) => logger.log('INFO', message),
  warn: (message) => logger.log('WARN', message),
  error: (message) => logger.log('ERROR', message),
  debug: (message) => logger.log('DEBUG', `Debugging: ${message}`),
  start: (message) => logger.log('START', `Starting: ${message}`),
  end: (message) => logger.log('END', `Ending: ${message}`),
  attempting: (message) => logger.log('ATTEMPT', `Attempting: ${message}`),
  success: (message) => logger.log('SUCCESS', `Success: ${message}`),

  // Color codes for different log levels
  getColor: (level) => {
    switch (level) {
      case 'INFO':
        return '\x1b[0m';
      case 'WARN':
        return '\x1b[33m'; // yellow
      case 'ERROR':
        return '\x1b[31m'; // red
      case 'DEBUG':
        return '\x1b[34m'; // blue
      case 'START':
        return '\x1b[35m'; // magenta
      case 'END':
        return '\x1b[35m'; // magenta
      case 'ATTEMPT':
        return '\x1b[36m'; // cyan
      case 'SUCCESS':
        return '\x1b[32m'; // bold green
      default:
        return '\x1b[0m'; // reset
    }
  },

  // Format the message for logging with borders and timestamps
  formatMessage: (level, timestamp, message) => {
    const prefix = `[${level}] [${timestamp}] - `;
    const lineLength = 130 - prefix.length;
    const maxMessageLength = message.length + prefix.length;
    const borderLength = Math.max(maxMessageLength, 60); // Ensure minimum border length of 60
    const borderType =
      level === 'DEBUG'
        ? '-'
        : level === 'ATTEMPT' || level === 'SUCCESS'
          ? '='
          : '*';
    const border = borderType.repeat(borderLength);
    const lines = [];

    // Add borders for certain log levels
    if (
      level === 'START' ||
      level === 'END' ||
      level === 'ATTEMPT' ||
      level === 'SUCCESS' ||
      level === 'DEBUG'
    ) {
      lines.push(border);
    }

    lines.push(`${prefix}${message}`);

    if (
      level === 'START' ||
      level === 'END' ||
      level === 'ATTEMPT' ||
      level === 'SUCCESS' ||
      level === 'DEBUG'
    ) {
      lines.push(border);
    }

    return lines;
  }
};
