// scripts/run-posttest-scripts.js

import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

function runScript(scriptPath) {
  try {
    execSync(`node ${scriptPath}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing script: ${scriptPath}`, error);
  }
}

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
