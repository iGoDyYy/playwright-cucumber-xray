import axios from 'axios';
import { getXrayToken } from './getToken';

const testExecutionIssueId = '10103'; // QA-68
const testIssueId = '10100'; // QA-65

async function main() {
  try {
    const token = await getXrayToken();

    const query = `
      mutation {
        addTestsToTestExecution(
          issueId: "${testExecutionIssueId}",
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

    console.log('TEST ADICIONADO AO TEST EXECUTION');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.log('ERRO AO ADICIONAR TEST AO TEST EXECUTION');
    console.log(error?.response?.data || error.message);
  }
}

main();
