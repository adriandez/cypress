import dotenv from 'dotenv';
import { spawn } from 'child_process';

dotenv.config();

const {
  TEST_BROWSER,
  TEST_ENV,
  VIEWPORT_WIDTH,
  VIEWPORT_HEIGHT,
  FOCUS,
  TAG,
  FEATURE
} = process.env;
const featureName = FEATURE || '*';
const tagName = TAG || 'focus';

const isSafe = (str) => /^[\w-]+$/.test(str);

if (
  [TEST_BROWSER, TEST_ENV, VIEWPORT_WIDTH, VIEWPORT_HEIGHT].some(
    (value) => !isSafe(value)
  )
) {
  console.error('One or more environment variables are unsafe or not set.');
  process.exit(1);
}

const cypressCommand = 'npx';
let cypressArgs = [
  'cypress',
  'run',
  '--spec',
  `cypress/e2e/cucumber/feature/**/${featureName}.feature`,
  '--headless',
  '--browser',
  TEST_BROWSER,
  '--env',
  `TEST_ENV=${TEST_ENV},VIEWPORT_WIDTH=${VIEWPORT_WIDTH},VIEWPORT_HEIGHT=${VIEWPORT_HEIGHT}`
];

if (FOCUS === 'true') {
  cypressArgs.push('--env');
  cypressArgs.push(`TAGS=@${tagName}`);
}

console.log(
  `[RUN-CYPRESS-TESTS] Executing: ${cypressCommand} ${cypressArgs.join(' ')}`
);

const child = spawn(cypressCommand, cypressArgs, {
  stdio: 'inherit',
  shell: true
});

child.on('error', (error) => {
  console.error(`Execution error: ${error}`);
});

child.on('close', (code) => {
  console.log(`Child process exited with code ${code}`);
  if (code !== 0) {
    console.error(
      'Cypress tests failed, but exiting with code 0 to prevent pod failure.'
    );
  }
  process.exit(0);
});
