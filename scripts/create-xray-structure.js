const axios = require('axios');

const jiraUrl = 'https://apponteme.atlassian.net';

const email = process.env.JIRA_EMAIL;
const apiToken = process.env.JIRA_API_TOKEN;

const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');

async function buscarIssue() {

  console.log('BUSCANDO ISSUE QA-330...\n');

  try {

    const response = await axios.get(
      `${jiraUrl}/rest/api/3/issue/QA-330`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: 'application/json'
        },

        timeout: 30000
      }
    );

    console.log('\nISSUE ENCONTRADA!\n');

    console.log('SUMMARY:', response.data.fields.summary);

    console.log('\nPROJECT:\n');

    console.log('Nome:', response.data.fields.project.name);
    console.log('Key:', response.data.fields.project.key);
    console.log('ID:', response.data.fields.project.id);

    console.log('\nISSUE TYPE:\n');

    console.log('Nome:', response.data.fields.issuetype.name);
    console.log('ID:', response.data.fields.issuetype.id);

  } catch (error) {

    console.log('\nERRO:\n');

    if (error.response) {
      console.log(JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(error.message);
    }
  }
}

buscarIssue();