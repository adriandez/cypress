import { exec } from 'child_process';
import { platform } from 'os';

const scriptPath = process.argv[2];

let bashPath;

if (platform() === 'win32') {
  bashPath = 'C:\\Program Files\\Git\\bin\\bash.exe';
} else {
  bashPath = '/bin/bash';
}

if (scriptPath === './import_results_cloud.sh') {
  console.log('Uploading Results... Please wait');
}

exec(`"${bashPath}" "${scriptPath}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Execution error: ${error}`);
    console.error(`Error code: ${error.code}`);
    console.error(`Error signal: ${error.signal}`);
    return;
  }
  if (stdout) {
    console.log(`Standard Output: ${stdout}`);
  }
  if (stderr) {
    console.error(`Standard Error: ${stderr}`);
  }
});
