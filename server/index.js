import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

const JENKINS_URL = process.env.JENKINS_URL;
const JENKINS_TOKEN = process.env.JENKINS_TOKEN;
const JENKINS_USER = process.env.JENKINS_USER;
const JENKINS_BASE_URL = process.env.JENKINS_BASE_URL;

const getJenkinsCrumb = async () => {
  const crumbUrl = `${JENKINS_BASE_URL}/crumbIssuer/api/json`;
  try {
    const response = await axios.get(crumbUrl, {
      auth: {
        username: JENKINS_USER,
        password: JENKINS_TOKEN
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Jenkins crumb:', error);
    throw error;
  }
};

const triggerJenkinsPipeline = async (browser, branch, launchManual) => {
  try {
    const crumb = await getJenkinsCrumb();

    const response = await axios.post(JENKINS_URL, null, {
      auth: {
        username: JENKINS_USER,
        password: JENKINS_TOKEN
      },
      headers: {
        [crumb.crumbRequestField]: crumb.crumb
      },
      params: {
        BROWSER: browser,
        BRANCH: branch,
        LAUNCH_MANUAL: launchManual
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error triggering Jenkins pipeline:', error);
    throw error;
  }
};

app.post('/trigger-pipeline', (req, res) => {
  const { browser, branch, launchManual } = req.body;

  if (!browser || !branch || launchManual === undefined) {
    return res
      .status(400)
      .send('Missing required parameters: browser, branch, or launchManual');
  }

  triggerJenkinsPipeline(browser, branch, launchManual)
    .then((jenkinsResponse) => {
      res.status(200).send({
        message: 'Pipeline triggered successfully',
        jenkinsResponse
      });
    })
    .catch((error) => {
      res.status(500).send({
        message: 'Error triggering Jenkins pipeline',
        error
      });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
