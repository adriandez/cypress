import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const { EXPORT_DIR, PROJECT_FEATURE_DIR, KEY } = process.env;

if (!EXPORT_DIR || !PROJECT_FEATURE_DIR || !KEY) {
  console.error(
    'Error: Missing environment variables. Please ensure .env file contains EXPORT_DIR, PROJECT_FEATURE_DIR, and KEY.'
  );
  process.exit(1);
}

console.log('Processing feature files...');

const getAllFiles = (dirPath, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file.name);
    if (file.isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (file.isFile()) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
};

const processFeatureFiles = () => {
  try {
    const featureFiles = fs
      .readdirSync(EXPORT_DIR)
      .filter((file) => file.endsWith('.feature'));

    featureFiles.forEach((exportFile) => {
      const exportFilePath = path.join(EXPORT_DIR, exportFile);
      const keyNum = exportFile.match(new RegExp(`^${KEY}-[0-9]+`));

      if (!keyNum) {
        console.error(
          `Failed to process ${exportFile} - Key-NUM prefix not found.`
        );
        return;
      }

      console.log(
        `Searching for matches for ${keyNum} in ${PROJECT_FEATURE_DIR}...`
      );

      let matches = [];
      matches = getAllFiles(PROJECT_FEATURE_DIR, matches).filter((file) =>
        path.basename(file).startsWith(keyNum)
      );

      matches.forEach((match) => {
        try {
          execSync(`mv "${exportFilePath}" "${match}"`);
          console.log(`Moved ${exportFilePath} to ${match}`);
        } catch (error) {
          console.error(
            `Failed to move ${exportFilePath} to ${match}: ${error.message}`
          );
        }
      });

      if (matches.length === 0) {
        console.error(`No matches found for ${keyNum}.`);
      } else {
        console.log(`Processing of ${exportFile} completed.`);
      }
    });

    console.log('Feature file processing complete.');
  } catch (error) {
    console.error(`Error during processing: ${error.message}`);
    process.exit(1);
  }
};

processFeatureFiles();
