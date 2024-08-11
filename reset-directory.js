import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .option('reset', {
    describe: 'Relative paths to the folders to delete and recreate',
    type: 'string',
    demandOption: true
  })
  .help()
  .alias('help', 'h')
  .parse();

const directories = argv.reset
  .split(',')
  .map((directory) => path.join(__dirname, directory.trim()));

const deleteDirectoryContents = async (directory) => {
  if (await fs.stat(directory).catch(() => false)) {
    console.log(`Directory exists, deleting contents: ${directory}`);
    const files = await fs.readdir(directory);
    await Promise.all(
      files.map(async (file) => {
        const curPath = path.join(directory, file);
        const stat = await fs.lstat(curPath);
        if (stat.isDirectory()) {
          console.log(
            `Entering and deleting contents of directory: ${curPath}`
          );
          await deleteDirectoryContents(curPath);
          console.log(`Removing directory: ${curPath}`);
          await fs.rmdir(curPath);
        } else {
          console.log(`Deleting file: ${curPath}`);
          await fs.unlink(curPath);
        }
      })
    );
  } else {
    console.log(`Directory does not exist, skipping: ${directory}`);
  }
};

const setupDirectories = async () => {
  try {
    for (const directory of directories) {
      console.log(`--> Reset Directory <--`);
      console.log(`Starting to clean directory: ${directory}`);
      await deleteDirectoryContents(directory);
      console.log(`Contents deleted for directory: ${directory}`);
    }
  } catch (error) {
    console.error('Error setting up directories:', error);
  }
};

setupDirectories();
