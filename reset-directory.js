import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const directoryPath = path.join(__dirname, 'cypress', 'cucumber-json');

async function deleteDirectory(directory) {
  if (await fs.stat(directory).catch(() => false)) {
    console.log(`Directory exists, deleting: ${directory}`);
    const files = await fs.readdir(directory);
    await Promise.all(files.map(async (file) => {
      const curPath = path.join(directory, file);
      const stat = await fs.lstat(curPath);
      if (stat.isDirectory()) {
        console.log(`Entering directory: ${curPath}`);
        await deleteDirectory(curPath);
      } else {
        console.log(`Deleting file: ${curPath}`);
        await fs.unlink(curPath);
      }
    }));
    console.log(`Removing directory: ${directory}`);
    await fs.rmdir(directory);
  } else {
    console.log(`Directory does not exist, skipping: ${directory}`);
  }
}

async function setupDirectory() {
  try {
    console.log(`Starting to delete and recreate directory: ${directoryPath}`);
    await deleteDirectory(directoryPath);
    console.log(`Directory deleted, now creating: ${directoryPath}`);
    await fs.mkdir(directoryPath, { recursive: true });
    console.log(`Directory created: ${directoryPath}`);
  } catch (error) {
    console.error('Error setting up directories:', error);
  }
}

setupDirectory();
