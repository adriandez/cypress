import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { logger } from '../logger.js';

// Load environment settings
dotenv.config();

const baseDir =
  process.env.PROJECT_FEATURE_DIR || 'cypress/e2e/cucumber/feature';
const stepDefDir = path.join(baseDir, '../step-definitions');

// Log the initial setup information for directories
logger.info(`Starting script. Feature directory: ${baseDir}`);
logger.info(`Step definitions directory: ${stepDefDir}`);

// Read and parse a .feature file
const readFeatureFile = async (featureFilePath) => {
  try {
    await fs.access(featureFilePath);
    const data = await fs.readFile(featureFilePath, 'utf-8');
    return parseFeatureFile(data);
  } catch (error) {
    logger.error(
      `Failed to read feature file: ${featureFilePath}. Error: ${error}`
    );
    throw error;
  }
};

const parseFeatureFile = (data) => {
  const lines = data.split('\n');
  const featureObject = { scenarios: [] };

  let currentScenario = null;

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('Feature:')) {
      featureObject.feature = trimmedLine.replace('Feature: ', '').trim();
    } else if (trimmedLine.startsWith('Scenario:')) {
      currentScenario = {
        name: trimmedLine.replace('Scenario: ', '').trim(),
        steps: []
      };
      featureObject.scenarios.push(currentScenario);
    } else if (trimmedLine.startsWith('Given ')) {
      currentScenario.steps.push({
        keyword: 'Given',
        text: trimmedLine.replace('Given ', '').trim()
      });
    } else if (trimmedLine.startsWith('When ')) {
      currentScenario.steps.push({
        keyword: 'When',
        text: trimmedLine.replace('When ', '').trim()
      });
    } else if (trimmedLine.startsWith('Then ')) {
      currentScenario.steps.push({
        keyword: 'Then',
        text: trimmedLine.replace('Then ', '').trim()
      });
    }
  });

  return featureObject;
};

const constructDynamicImportPath = (featurePath, featureFileName) => {
  const featureDirStructure = path
    .dirname(featurePath)
    .split(path.sep)
    .slice(-4)
    .join('/');
  const baseFeatureName = featureFileName.replace('.feature', '');
  return `../../../../support/actions/${featureDirStructure}/${baseFeatureName}-step-def.js`;
};

export const fillTemplateWithData = async (featurePath, featureFileName) => {
  const completeFeaturePath = path.normalize(`${baseDir}/${featurePath}`);
  const featureObject = await readFeatureFile(completeFeaturePath);
  const importPath = constructDynamicImportPath(featurePath, featureFileName);

  logger.info(
    `Filling template with featureObject: ${JSON.stringify(featureObject)}`
  );

  let template = `
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { template } from '{{importPath}}';

{{steps}}
`;

  template = template.replace('{{importPath}}', importPath);

  let steps = '';

  featureObject.scenarios.forEach((scenario) => {
    scenario.steps.forEach((step) => {
      steps += `${step.keyword}(\n  '${step.text}',\n  () => {}\n);\n\n`;
    });
  });

  template = template.replace('{{steps}}', steps.trim());

  logger.info(`Generated step definition template: ${template.trim()}`);
  return template;
};
