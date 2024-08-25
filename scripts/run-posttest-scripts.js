// scripts/run-posttest-scripts.js

import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

// Function to run a script synchronously
const runScript = (scriptPath) => {
  try {
    execSync(`node ${scriptPath}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing script: ${scriptPath}`, error);
  }
};

// Conditionally run scripts based on environment variables
if (process.env.GENERATE_REPORT === 'true') {
  runScript('generate-report.js');
}

if (process.env.IMPORT_EMBEDDINGS_REMOVER_RESULTS_CLOUD === 'true') {
  runScript(
    'scripts/xray-integration/import-embeddings-remover-results-cloud.js'
  );
}

if (process.env.IMPORT_PREPARE_INFO_RESULT_CLOUD === 'true') {
  runScript('scripts/xray-integration/import-prepare-info-result-cloud.js');
}

if (process.env.IMPORT_MULTIPART_RESULTS_CLOUD === 'true') {
  runScript('scripts/xray-integration/import-multipart-results-cloud.js');
}

if (process.env.CHECK_ALL_CONTAINERS_COMPLETE === 'true') {
  runScript('scripts/check-all-containers-complete.js');
}
