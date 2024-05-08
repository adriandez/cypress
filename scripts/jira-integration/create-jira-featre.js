import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs/promises';
import { Buffer } from 'buffer';

dotenv.config();

const createJiraIssue = async () => {
  try {
    const authData = await fs.readFile('./jira-auth.json', 'utf8');
    const { API_TOKEN, EMAIL } = JSON.parse(authData);
    const credentials = `${EMAIL}:${API_TOKEN}`;
    const token = Buffer.from(credentials).toString('base64');

    const url = `${process.env.JIRA_BASE_URL}/rest/api/3/issue`;
    const headers = {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };

    const data = {
      fields: {
        project: {
          id: '10001'
        },
        summary: 'DEMO-XX Test Feature Creation Automation',
        issuetype: {
          id: '10017'
        },
        labels: ['L1_Dir_user-authentication', 'L2_Dir_category-1']
      }
    };

    const response = await axios.post(url, data, { headers });
    console.log(`Jira issue created successfully with ID: ${response.data.id}`);
  } catch (error) {
    console.error(`Error creating Jira issue: ${error.message}`);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    }
  }
};

// Call the function to create a Jira issue
createJiraIssue();
