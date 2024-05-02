import fs from 'fs';
import path from 'path';

// Define the path to the directory where the JSON files are located
const jsonFilesDir = path.join('cypress', 'cucumber-json');

// Define the path to the output directory at the project root
const outputDir = path.join('cloud-import-results');

try {
  // Read all files in the JSON files directory
  const files = fs.readdirSync(jsonFilesDir);
  console.log('Found JSON files:', files);

  // Ensure the output directory exists, if not, create it
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  files.forEach((file) => {
    if (file.startsWith('DEMO') && file.endsWith('.json')) {
      const filePath = path.join(jsonFilesDir, file);
      console.log('Processing file:', filePath);
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      fileData.forEach((feature) => {
        feature.elements.forEach((element) => {
          element.steps.forEach((step) => {
            if (step.embeddings) {
              console.log(
                `Step "${step.keyword}${step.name}" has embeddings, removing them...`
              );
              delete step.embeddings;
            }
          });
        });
      });

      const outputFile = path.join(outputDir, file);
      fs.writeFileSync(outputFile, JSON.stringify(fileData, null, 2), 'utf8');
      console.log(`Processed file saved: ${outputFile}`);
    }
  });

  console.log('All files processed successfully.');
} catch (error) {
  console.error('Failed to process JSON files:', error);
}
