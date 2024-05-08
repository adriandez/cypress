import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs/promises';
import { Buffer } from 'buffer';

dotenv.config();

const updateJiraIssueSummary = async (issueKeys) => {
  const authData = await fs.readFile('./jira-auth.json', 'utf8');
  const { API_TOKEN, EMAIL } = JSON.parse(authData);
  const credentials = `${EMAIL}:${API_TOKEN}`;
  const token = Buffer.from(credentials).toString('base64');

  for (const issueKey of issueKeys) {
    try {
      const url = `${process.env.JIRA_BASE_URL}/rest/api/3/issue/${issueKey}`;
      const headers = {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      };

      const currentIssue = await axios.get(url, { headers });
      const currentSummary = currentIssue.data.fields.summary;

      const parts = issueKey.split('-');
      const description = currentSummary.split('-').slice(2).join(' ');
      const newSummary = `${parts[0]}-${parts[1]} ${description}`;

      const data = {
        update: {
          summary: [
            {
              set: newSummary
            }
          ]
        }
      };

      const response = await axios.put(url, data, { headers });
      console.log(
        `Issue summary updated successfully for ${issueKey}:`,
        response.data
      );
    } catch (error) {
      console.error(
        `Error updating Jira issue summary for ${issueKey}:`,
        error.message
      );
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
      }
    }
  }
};

// Example usage
updateJiraIssueSummary([
  'DEMO-33',
  'DEMO-41',
  'DEMO-47',
  'DEMO-45',
  'DEMO-46',
  'DEMO-44'
]); // Pass an array of issue keys to update
