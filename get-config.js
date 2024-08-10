import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Since __dirname is not available in ESM, we use a workaround to get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file (if it exists)
dotenv.config();

// Function to load and return configuration based on the environment
const getConfig = (environment) => {
  // Load environment variables for each environment
  const configs = {
    local: {
      baseUrl: process.env.LOCAL_BASE_URL || 'http://localhost:3000'
    },
    develop: {
      baseUrl: process.env.DEVELOP_BASE_URL || 'https://www.google.com'
    },
    testing: {
      baseUrl: process.env.TESTING_BASE_URL || 'https://www.google.com'
    },
    preproduction: {
      baseUrl: process.env.PREPRODUCTION_BASE_URL || 'https://www.google.com'
    }
  };

  // Default to 'local' if no environment is specified
  const env = environment || 'local';
  return configs[env];
};

// Using named export for getConfig function
export { getConfig };
