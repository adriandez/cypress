const fs = require('fs');
const path = require('path');

// Function to load and return configuration based on the environment
function getConfig(environment) {
  // Path to the configurations file
  const configPath = path.resolve(__dirname, 'configurations.json');
  const configData = fs.readFileSync(configPath);
  const configs = JSON.parse(configData);
  
  // Default to 'local' if no environment is specified
  const env = environment || 'local';
  return configs[env];
}

module.exports = getConfig;
