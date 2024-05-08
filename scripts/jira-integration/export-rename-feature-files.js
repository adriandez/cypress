import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs/promises';
import { Buffer } from 'buffer';
import path from 'path';

dotenv.config();

const EXPORT_DIR = process.env.EXPORT_DIR || 'cloud-export';

const getJiraIssueSummary = async (issueKey) => {
  try {
    const authData = await fs.readFile('./jira-auth.json', 'utf8');
    const { API_TOKEN, EMAIL } = JSON.parse(authData);
    const credentials = `${EMAIL}:${API_TOKEN}`;
    const token = Buffer.from(credentials).toString('base64');
    const url = `${process.env.JIRA_BASE_URL}/rest/api/3/issue/${issueKey}`;
    const headers = {
      Authorization: `Basic ${token}`,
      Accept: 'application/json'
    };

    const response = await axios.get(url, { headers });
    return response.data.fields.summary;
  } catch (error) {
    console.error(
      `Error fetching Jira issue for key ${issueKey}:`,
      error.message
    );
    return null; // Return null if there is an error
  }
};

const renameFeatureFiles = async () => {
  try {
    const files = await fs.readdir(EXPORT_DIR);
    const featureFiles = files.filter((file) => file.endsWith('.feature'));

    for (const file of featureFiles) {
      const issueKey = file.split('.')[0]; // Assuming the issue key is the part before the first dot in the filename
      const summary = await getJiraIssueSummary(issueKey);
      if (summary) {
        // Assuming the summary always starts with the issue key followed by a space
        const cleanSummary = summary.replace(`${issueKey} `, ''); // Remove the issue key and trailing space from the summary
        const newFilename = `${issueKey} ${cleanSummary}.feature`;
        await fs.rename(
          path.join(EXPORT_DIR, file),
          path.join(EXPORT_DIR, newFilename)
        );
        console.log(`Renamed ${file} to ${newFilename}`);
      }
    }
  } catch (error) {
    console.error('Error processing feature files:', error.message);
  }
};

renameFeatureFiles();
