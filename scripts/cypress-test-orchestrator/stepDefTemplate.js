import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { logger } from '../logger.js';

dotenv.config();

const baseDir =
  process.env.PROJECT_FEATURE_DIR || 'cypress/e2e/cucumber/feature';
const stepDefDir = path.join(baseDir, '../step-definitions');

logger.info(`Starting script. Feature directory: ${baseDir}`);
logger.info(`Step definitions directory: ${stepDefDir}`);

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
  let isBackground = false;
  let lastKeyword = '';

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('Feature:')) {
      featureObject.feature = trimmedLine.replace('Feature: ', '').trim();
    } else if (trimmedLine.startsWith('Background:')) {
      isBackground = true;
    } else if (trimmedLine.startsWith('Scenario:')) {
      isBackground = false;
      currentScenario = {
        name: trimmedLine.replace('Scenario: ', '').trim(),
        steps: []
      };
      featureObject.scenarios.push(currentScenario);
    } else if (
      !isBackground &&
      (trimmedLine.startsWith('Given ') ||
        trimmedLine.startsWith('When ') ||
        trimmedLine.startsWith('Then ') ||
        trimmedLine.startsWith('And '))
    ) {
      let keyword = trimmedLine.split(' ')[0];
      if (keyword === 'And') {
        keyword = lastKeyword;
      } else {
        lastKeyword = keyword;
      }
      const text = trimmedLine
        .replace(/^(Given|When|Then|And) /, '')
        .trim()
        .replace(/'/g, "\\'");
      const step = {
        keyword,
        text
      };

      if (currentScenario) {
        currentScenario.steps.push(step);
      } else {
        logger.error(`Step found without a scenario: ${trimmedLine}`);
      }
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
