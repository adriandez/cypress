import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs/promises';
import { Buffer } from 'buffer';

dotenv.config();

const getJiraIssue = async () => {
  try {
    // Load the API token from the JSON file
    const authData = await fs.readFile('./jira-auth.json', 'utf8');
    const { API_TOKEN, EMAIL } = JSON.parse(authData);

    const credentials = `${EMAIL}:${API_TOKEN}`;

    // Set the URL to the Jira issue API
    const url = `${process.env.JIRA_BASE_URL}/rest/api/3/issue/${process.env.GET_JIRA_ISSUE}`;

    const token = Buffer.from(credentials).toString('base64');

    // Configure headers with the API token
    const headers = {
      Authorization: `Basic ${token}`,
      Accept: 'application/json'
    };

    const response = await axios.get(url, { headers });
    console.log(response.data);
    //console.log(response.data.fields.issuelinks);
    //console.log(response.data.fields.issuelinks[0].type); // Output the issue details
  } catch (error) {
    console.error('Error fetching Jira issue:', error.message);
    console.error('Error status:', error.response.status);
    console.error('Error data:', error.response.data);
  }
};

getJiraIssue();
