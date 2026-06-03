import axios from 'axios';
import { getXrayToken } from './getToken';

const testSetIssueId = '10097'; // QA-62

async function main() {
  try {
    const token = await getXrayToken();

    const query = `
      {
        getTestSet(issueId: "${testSetIssueId}") {
          issueId
          jira(fields: ["key", "summary"])
          tests(limit: 100) {
            results {
              issueId
              jira(fields: ["key", "summary"])
            }
          }
        }
      }
    `;

    const response = await axios.post(
      'https://xray.cloud.getxray.app/api/v2/graphql',
      { query },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.log('ERRO AO CONSULTAR TEST SET');
    console.log(error?.response?.data || error.message);
  }
}

main();