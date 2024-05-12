import fs from 'fs';
import path from 'path';
import { logger } from '../logger.js'; // Import logger from the logger.js module

// Define the path to the directory where the JSON files are located
const jsonFilesDir = path.join('cypress', 'cucumber-json');

// Define the path to the output directory at the project root
const outputDir = path.join('cloud-import-results');

try {
  logger.start('import-embeddings-remover-results-cloud');
  // Read all files in the JSON files directory
  const files = fs.readdirSync(jsonFilesDir);
  logger.info(`Found JSON files: ${files}`); // Replace console.log with logger.info

  // Ensure the output directory exists, if not, create it
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  files.forEach((file) => {
    if (file.startsWith('DEMO') && file.endsWith('.json')) {
      const filePath = path.join(jsonFilesDir, file);
      logger.info(`Processing file: ${filePath}`); // Replace console.log with logger.info
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      fileData.forEach((feature) => {
        feature.elements.forEach((element) => {
          element.steps.forEach((step) => {
            if (step.embeddings) {
              logger.info(
                `Step "${step.keyword} ${step.name}" has embeddings, removing them...`
              ); // Replace console.log with logger.info
              delete step.embeddings;
            }
          });
        });
      });

      // Create a specific directory for each JSON file within the output directory
      const fileOutputDir = path.join(outputDir, path.basename(file, '.json'));
      if (!fs.existsSync(fileOutputDir)) {
        fs.mkdirSync(fileOutputDir, { recursive: true });
      }

      const outputFile = path.join(fileOutputDir, file);
      fs.writeFileSync(outputFile, JSON.stringify(fileData, null, 2), 'utf8');
      logger.success(`Processed file saved ${outputFile}`); // Replace console.log with logger.info
    }
  });

  logger.end('All files processed successfully.'); // Replace console.log with logger.info
} catch (error) {
  logger.error(`Failed to process JSON files: ${error}`); // Replace console.error with logger.error
}
