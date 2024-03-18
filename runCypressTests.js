import dotenv from 'dotenv';
import { spawn } from 'child_process';

dotenv.config();

const { TEST_BROWSER, TEST_ENV, VIEWPORT_WIDTH, VIEWPORT_HEIGHT, FOCUS } = process.env;

// Simple validation/sanitization. Add more rules as needed.
const isSafe = (str) => /^[\w-]+$/.test(str);

if (
  [TEST_BROWSER, TEST_ENV, VIEWPORT_WIDTH, VIEWPORT_HEIGHT].some(
    (value) => !isSafe(value)
  )
) {
  console.error('One or more environment variables are unsafe or not set.');
  process.exit(1);
}

// Construct the Cypress command using environment variables
const cypressCommand = 'npx';
let cypressArgs = [
  'cypress',
  'run',
  '--headless',
  '--browser',
  TEST_BROWSER,
  '--env',
  `TEST_ENV=${TEST_ENV},VIEWPORT_WIDTH=${VIEWPORT_WIDTH},VIEWPORT_HEIGHT=${VIEWPORT_HEIGHT}`
];

// Conditionally add a tag if FOCUS is true
if (FOCUS === 'true') {
  cypressArgs.push('--env');
  cypressArgs.push(`TAGS=@focus`);
}

console.log(`Executing: ${cypressCommand} ${cypressArgs.join(' ')}`);

const child = spawn(cypressCommand, cypressArgs, {
  stdio: 'inherit',
  shell: true
});

child.on('error', (error) => {
  console.error(`Execution error: ${error}`);
});

child.on('close', (code) => {
  console.log(`Child process exited with code ${code}`);
  process.exit(code);
});
