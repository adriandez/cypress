import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

function runScript(scriptPath) {
  try {
    execSync(scriptPath, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing script: ${scriptPath}`, error);
  }
}

if (process.env.RESET_DIR_CUCUMBER_JSON === 'true') {
  runScript('node reset-directory.js --reset cypress/cucumber-json');
}

if (process.env.RESET_DIR_CLOUD_IMPORT_RESULTS === 'true') {
  runScript('node reset-directory.js --reset cypress/cloud-import-results');
}

if (process.env.RESET_DIR_REPORTS === 'true') {
  runScript('node reset-directory.js --reset cypress/reports');
}
