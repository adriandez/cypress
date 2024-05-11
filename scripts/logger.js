import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsDir = path.join(__dirname, 'logs');
try {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
} catch (error) {
  console.error('Failed to create log directory:', error);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const logFile = path.join(logsDir, `app-${timestamp}.log`);

export const logger = {
  log: (level, message) => {
    const now = new Date().toISOString();
    const color = logger.getColor(level);
    const formattedMessages = logger.formatMessage(level, now, message);

    formattedMessages.forEach((formattedMessage) => {
      // Console output
      console.log(`${color}${formattedMessage}\x1b[0m`);

      // File output
      try {
        fs.appendFileSync(logFile, formattedMessage + '\n', 'utf8');
      } catch (error) {
        console.error('Error writing to log file:', error);
      }
    });
  },
  info: (message) => logger.log('INFO', message),
  warn: (message) => logger.log('WARN', message),
  error: (message) => logger.log('ERROR', message),
  debug: (message) => logger.log('DEBUG', message),
  getColor: (level) => {
    switch (level) {
      case 'INFO':
        return '\x1b[32m'; // green
      case 'WARN':
        return '\x1b[33m'; // yellow
      case 'ERROR':
        return '\x1b[31m'; // red
      case 'DEBUG':
        return '\x1b[34m'; // blue
      default:
        return '\x1b[0m'; // reset
    }
  },
  formatMessage: (level, timestamp, message) => {
    const prefix = `[${level}] [${timestamp}] - `;
    const lineLength = 130 - prefix.length;
    const lines = [];

    for (let i = 0; i < message.length; i += lineLength) {
      const segment = message.substring(i, i + lineLength);
      lines.push(`${prefix}${segment}`);
    }

    return lines;
  }
};
