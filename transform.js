import fs from 'fs';
import path from 'path';

// Define the path to the directory where the JSON files are located
const jsonFilesDir = path.join('cypress', 'cucumber-json');

// Define the path to the output directory at the project root
const outputDir = path.join('cloud-import-results');

function transform(data) {
    // Ensure the uri property exists before trying to use it
    if (data.uri) {
        data.uri = `cypress\\e2e\\cucumber\\feature\\${data.uri}`;
    }

    // Check if elements exist and are an array before iterating
    if (Array.isArray(data.elements)) {
        data.elements.forEach(element => {
            if (Array.isArray(element.steps)) {
                element.steps.forEach(step => {
                    step.match = { location: "not available:0" };
                    if (step.result && step.result.error_message) {
                        step.result.error_message = step.result.error_message.split('\n')[0];
                    }
                });
            }
        });
    }
    return data;
}

try {
    // Read all files in the JSON files directory
    const files = fs.readdirSync(jsonFilesDir);

    // Filter files that start with 'DEMO' and end with '.json'
    const demoFiles = files.filter(file => file.startsWith('DEMO') && file.endsWith('.json'));

    // Process each file and transform the data
    const finalReport = demoFiles.map(file => {
        const filePath = path.join(jsonFilesDir, file);
        const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        return transform(fileData);
    });

    // Ensure the output directory exists, if not, create it
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Define the output file path
    const outputFile = path.join(outputDir, 'cucumber-report.json');

    // Write to a new JSON file inside the specified folder
    fs.writeFileSync(outputFile, JSON.stringify(finalReport, null, 2), 'utf8');
    console.log(`Report generated: ${outputFile}`);
} catch (error) {
    console.error('Failed to process JSON files:', error);
}
