import axios from 'axios';
import { getXrayToken } from './getToken';

const testPlanIssueId = '10099'; // QA-64
const testIssueId = '10096'; // QA-61

async function main() {
  try {
    const token = await getXrayToken();

    const query = `
      mutation {
        addTestsToTestPlan(
          issueId: "${testPlanIssueId}",
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

    console.log('TEST ADICIONADO AO TEST PLAN');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.log('ERRO AO ADICIONAR TEST AO TEST PLAN');
    console.log(error?.response?.data || error.message);
  }
}

main();
