import dotenv from 'dotenv';
import axios from 'axios';
import fs from 'fs/promises';
import { Buffer } from 'buffer';
import { logger } from '../logger.js'; // Import the logger

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
    console.log(response.data); // Log the full response data
    console.log(response.data.fields.labels); // Log specific parts of the data
    //logger.info(response.data.fields.issuelinks); // Uncomment if needed
    //logger.info(response.data.fields.issuelinks[0].type); // Log specific issue details
  } catch (error) {
    logger.error(`Error fetching Jira issue: ${error.message}`); // Log the error message
    logger.error(`Error status: ${error.response.status}`); // Log the status code
    logger.error(`Error data: ${error.response.data}`); // Log the error data
  }
};

getJiraIssue();
