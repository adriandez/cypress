import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs/promises';
import { Buffer } from 'buffer';

dotenv.config();

const updateJiraIssueLabels = async (newLabels) => {
  try {
    // Load the API token from the JSON file
    const authData = await fs.readFile('./jira-auth.json', 'utf8');
    const { API_TOKEN, EMAIL } = JSON.parse(authData);

    const credentials = `${EMAIL}:${API_TOKEN}`;
    const token = Buffer.from(credentials).toString('base64');

    // Set the URL to update the Jira issue
    const url = `${process.env.JIRA_BASE_URL}/rest/api/3/issue/${process.env.GET_JIRA_ISSUE}`;

    // Configure headers with the API token
    const headers = {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };

    // Define the payload to update labels
    const data = {
      update: {
        labels: newLabels.map((label) => ({ add: label }))
      }
    };

    // Perform the PUT request to update the issue
    const response = await axios.put(url, data, { headers });
    console.log('Issue updated successfully:', response.data);
  } catch (error) {
    console.error('Error updating Jira issue:', error.message);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    }
  }
};

// Example usage: updateJiraIssueLabels(['new_label1', 'new_label2']);
updateJiraIssueLabels(['L1_Dir_user-authentication', 'L2_Dir_category-1']); // Replace with actual labels you want to add
