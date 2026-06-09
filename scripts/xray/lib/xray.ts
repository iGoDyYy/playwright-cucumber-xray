import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const projectId = '10001';
export const cucumberTypeId = '6a1eeb901dc9631a8894f160';

function required(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável ${name} não encontrada no ambiente`);
  }

  return value;
}

export async function getXrayToken() {
  const response = await axios.post(
    'https://xray.cloud.getxray.app/api/v2/authenticate',
    {
      client_id: required('XRAY_CLIENT_ID_TEST_NOVO'),
      client_secret: required('XRAY_CLIENT_SECRET_TEST_NOVO')
    }
  );

  return response.data;
}

export async function graphql(query: string) {
  const token = await getXrayToken();

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

  return response.data;
}

export async function adicionarTestsAoTestSet(
  testSetIssueId: string,
  testIssueIds: string[]
) {
  return graphql(`
    mutation {
      addTestsToTestSet(
        issueId: "${testSetIssueId}",
        testIssueIds: ${JSON.stringify(testIssueIds)}
      ) {
        addedTests
        warning
      }
    }
  `);
}

export async function adicionarTestsAoTestPlan(
  testPlanIssueId: string,
  testIssueIds: string[]
) {
  return graphql(`
    mutation {
      addTestsToTestPlan(
        issueId: "${testPlanIssueId}",
        testIssueIds: ${JSON.stringify(testIssueIds)}
      ) {
        addedTests
        warning
      }
    }
  `);
}

export async function adicionarTestsAoTestExecution(
  testExecutionIssueId: string,
  testIssueIds: string[]
) {
  return graphql(`
    mutation {
      addTestsToTestExecution(
        issueId: "${testExecutionIssueId}",
        testIssueIds: ${JSON.stringify(testIssueIds)}
      ) {
        addedTests
        warning
      }
    }
  `);
}

export async function associarTestExecutionAoTestPlan(
  testPlanIssueId: string,
  testExecutionIssueId: string
) {
  return graphql(`
    mutation {
      addTestExecutionsToTestPlan(
        issueId: "${testPlanIssueId}",
        testExecIssueIds: ["${testExecutionIssueId}"]
      ) {
        addedTestExecutions
        warning
      }
    }
  `);
}