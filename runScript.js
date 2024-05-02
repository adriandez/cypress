import ProgressBar from 'progress';
import { spawn } from 'child_process';

const scriptPath = process.argv[2];
const bar = new ProgressBar(':bar :current/:total', { total: 10 });

const childProcess = spawn('bash', [scriptPath]);

childProcess.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
  bar.tick();
});

childProcess.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

childProcess.on('close', (code) => {
  console.log(`Child process exited with code ${code}`);
  if (bar.complete) {
    console.log('Operation completed successfully');
  }
});
