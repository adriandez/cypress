import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Since __dirname is not available in ESM, we use a workaround to get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to load and return configuration based on the environment
const getConfig = (environment) => {
  // Path to the configurations file
  const configPath = path.resolve(__dirname, 'configurations.json');
  const configData = fs.readFileSync(configPath);
  const configs = JSON.parse(configData);

  // Default to 'local' if no environment is specified
  const env = environment || 'local';
  return configs[env];
};

// Using named export for getConfig function
export { getConfig };
