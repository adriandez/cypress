import { promises as fs } from 'fs';
import path from 'path';

const checkCompletionStatus = async (sharedDir) => {
  try {
    const files = await fs.readdir(sharedDir);

    const allComplete = ['chrome.txt', 'edge.txt', 'firefox.txt'].every(
      (file) => files.includes(file)
    );

    return allComplete;
  } catch (error) {
    console.error('Error reading shared directory:', error);
    return false;
  }
};

const createCompletionFile = async (sharedDir, fileName) => {
  const filePath = path.join(sharedDir, fileName);
  try {
    await fs.writeFile(filePath, 'completed');
    console.log(`Created completion file: ${filePath}`);
  } catch (error) {
    console.error('Error creating completion file:', error);
  }
};

const coordinateCompletion = async () => {
  const sharedDir = '/var/shared';
  const containerName = process.env.TEST_BROWSER;
  const completionFile = `${containerName}.txt`;

  await createCompletionFile(sharedDir, completionFile);

  while (true) {
    const allComplete = await checkCompletionStatus(sharedDir);

    if (allComplete) {
      console.log('All containers have completed. Exiting...');
      process.exit(0);
    } else {
      console.log('Waiting for other containers to complete...');
      await new Promise((resolve) => setTimeout(resolve, 30000));
    }
  }
};

coordinateCompletion();
