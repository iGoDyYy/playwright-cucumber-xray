import axios from 'axios';
import { getXrayToken } from './getToken';

const testSetIssueId = '10097'; // QA-62
const testIssueId = '10096'; // QA-61

async function main() {
  try {
    const token = await getXrayToken();

    const query = `
      mutation {
        addTestsToTestSet(
          issueId: "${testSetIssueId}",
          testIssueIds: ["${testIssueId}"]
        ) {
          addedTests
          warning
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

    console.log('TEST ADICIONADO AO TEST SET');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.log('ERRO AO ADICIONAR TEST AO TEST SET');
    console.log(error?.response?.data || error.message);
  }
}

main();
