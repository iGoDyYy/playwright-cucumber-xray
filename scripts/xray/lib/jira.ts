import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export function required(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável ${name} não encontrada no .env`);
  }

  return value;
}

export const jiraConfig = {
  baseUrl: required('JIRA_BASE_URL_TEST_NOVO'),
  email: required('JIRA_EMAIL_TEST_NOVO'),
  apiToken: required('JIRA_API_TOKEN_TEST_NOVO'),
  projectKey: required('PROJECT_KEY_TEST_NOVO')
};

export const issueTypes = {
  test: '10007',
  testSet: '10008',
  testPlan: '10009',
  testExecution: '10010',
  precondition: '10011'
};

export function getJiraHeaders() {
  const token = Buffer
    .from(`${jiraConfig.email}:${jiraConfig.apiToken}`)
    .toString('base64');

  return {
    Authorization: `Basic ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };
}

export function adf(text: string) {
  return {
    type: 'doc',
    version: 1,
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text
          }
        ]
      }
    ]
  };
}

export async function criarIssue(
  summary: string,
  description: string,
  issueTypeId: string
) {
  const response = await axios.post(
    `${jiraConfig.baseUrl}/rest/api/3/issue`,
    {
      fields: {
        project: { key: jiraConfig.projectKey },
        summary,
        description: adf(description),
        issuetype: { id: issueTypeId }
      }
    },
    { headers: getJiraHeaders() }
  );

  return {
    issueId: response.data.id,
    issueKey: response.data.key
  };
}

export async function criarIssueLink(
  outwardIssueKey: string,
  inwardIssueKey: string,
  typeName = 'Relates'
) {
  const exists = await issueLinkExiste(
    outwardIssueKey,
    inwardIssueKey
  );

  if (exists) {
    console.log(
      `Vínculo Jira já existe: ${outwardIssueKey} -> ${inwardIssueKey}`
    );
    return;
  }

  await axios.post(
    `${jiraConfig.baseUrl}/rest/api/3/issueLink`,
    {
      type: {
        name: typeName
      },
      outwardIssue: {
        key: outwardIssueKey
      },
      inwardIssue: {
        key: inwardIssueKey
      }
    },
    {
      headers: getJiraHeaders()
    }
  );

  console.log(
    `Vínculo Jira criado: ${outwardIssueKey} -> ${inwardIssueKey}`
  );
}

export async function buscarIssuePorSummary(
  summary: string,
  issueTypeId?: string
) {
  const issueTypeFilter = issueTypeId
    ? ` AND issuetype = ${issueTypeId}`
    : '';

  const jql =
    `project = ${jiraConfig.projectKey}` +
    issueTypeFilter +
    ` ORDER BY created DESC`;

  const response = await axios.post(
    `${jiraConfig.baseUrl}/rest/api/3/search/jql`,
    {
      jql,
      maxResults: 100,
      fields: [
        'summary',
        'issuetype'
      ]
    },
    {
      headers: getJiraHeaders()
    }
  );

  const issue = response.data.issues?.find(
    (item: any) => item.fields.summary === summary
  );

  if (!issue) {
    return null;
  }

  return {
    issueId: issue.id,
    issueKey: issue.key,
    summary: issue.fields.summary
  };
}

export async function issueLinkExiste(
  outwardIssueKey: string,
  inwardIssueKey: string
) {
  const response = await axios.get(
    `${jiraConfig.baseUrl}/rest/api/3/issue/${outwardIssueKey}?fields=issuelinks`,
    {
      headers: getJiraHeaders()
    }
  );

  const links = response.data.fields?.issuelinks || [];

  return links.some((link: any) => {
    const outwardKey = link.outwardIssue?.key;
    const inwardKey = link.inwardIssue?.key;

    return (
      outwardKey === inwardIssueKey ||
      inwardKey === inwardIssueKey
    );
  });
}