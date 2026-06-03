import axios from 'axios';
import { getXrayToken } from './getToken';

const testPlanIssueId = '10102';      // QA-67
const testExecutionIssueId = '10103'; // QA-68

async function main() {
  try {
    const token = await getXrayToken();

    const query = `
      mutation {
        addTestExecutionsToTestPlan(
          issueId: "${testPlanIssueId}",
          testExecIssueIds: ["${testExecutionIssueId}"]
        ) {
          addedTestExecutions
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

    console.log('TEST EXECUTION ADICIONADO AO TEST PLAN');
    console.log(JSON.stringify(response.data, null, 2));

  } catch (error: any) {

    console.log('ERRO AO ASSOCIAR TEST EXECUTION AO TEST PLAN');
    console.log(error?.response?.data || error.message);

  }
}

main();