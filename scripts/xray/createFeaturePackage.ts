import axios from 'axios';
import dotenv from 'dotenv';
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

dotenv.config();

function required(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável ${name} não encontrada no .env`);
  }

  return value;
}

const jiraBaseUrl = required('JIRA_BASE_URL_TEST_NOVO');
const jiraEmail = required('JIRA_EMAIL_TEST_NOVO');
const jiraApiToken = required('JIRA_API_TOKEN_TEST_NOVO');
const projectKey = required('PROJECT_KEY_TEST_NOVO');

const projectId = '10001';
const featurePath = 'features/cadastro.feature';

const issueTypes = {
  test: '10007',
  testSet: '10008',
  testPlan: '10009',
  testExecution: '10010'
};

const cucumberTypeId = '6a1eeb901dc9631a8894f160';

type ScenarioData = {
  name: string;
  scenario: string;
  tags: string[];
};

function traduzirParaCucumberIngles(text: string) {
  return text
    .replace(/^Cenario:/gm, 'Scenario:')
    .replace(/^Cenário:/gm, 'Scenario:')
    .replace(/^Dado /gm, 'Given ')
    .replace(/^Quando /gm, 'When ')
    .replace(/^Então /gm, 'Then ')
    .replace(/^Entao /gm, 'Then ')
    .replace(/^E /gm, 'And ');
}

function carregarScenariosDoFeature(pathFeature: string) {
  const feature = fs.readFileSync(pathFeature, 'utf-8');
  const lines = feature.split(/\r?\n/);

  const scenarios: ScenarioData[] = [];
  let pendingTags: string[] = [];
  let currentScenarioName = '';
  let currentScenarioLines: string[] = [];
  let currentScenarioTags: string[] = [];

  function salvarScenarioAtual() {
    if (!currentScenarioName) {
      return;
    }

    if (currentScenarioTags.includes('@cadastro-real')) {
      return;
    }

    scenarios.push({
      name: currentScenarioName,
      tags: currentScenarioTags,
      scenario: traduzirParaCucumberIngles(
        currentScenarioLines.join('\n')
      )
    });
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('@')) {
      pendingTags.push(trimmed);
      continue;
    }

    if (
      trimmed.toLowerCase().startsWith('cenario:') ||
      trimmed.toLowerCase().startsWith('cenário:')
    ) {
      salvarScenarioAtual();

      currentScenarioName = trimmed
        .replace(/^Cenario:/i, '')
        .replace(/^Cenário:/i, '')
        .trim();

      currentScenarioTags = pendingTags;
      pendingTags = [];
      currentScenarioLines = [trimmed];

      continue;
    }

    if (!currentScenarioName) {
      continue;
    }

    if (trimmed === '') {
      continue;
    }

    currentScenarioLines.push(trimmed);
  }

  salvarScenarioAtual();

  return scenarios;
}

function getJiraHeaders() {
  const token = Buffer
    .from(`${jiraEmail}:${jiraApiToken}`)
    .toString('base64');

  return {
    Authorization: `Basic ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };
}

function adf(text: string) {
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

async function criarIssue(
  summary: string,
  description: string,
  issueTypeId: string
) {
  const response = await axios.post(
    `${jiraBaseUrl}/rest/api/3/issue`,
    {
      fields: {
        project: {
          key: projectKey
        },
        summary,
        description: adf(description),
        issuetype: {
          id: issueTypeId
        }
      }
    },
    {
      headers: getJiraHeaders()
    }
  );

  return {
    issueId: response.data.id,
    issueKey: response.data.key
  };
}

async function getXrayToken() {
  const response = await axios.post(
    'https://xray.cloud.getxray.app/api/v2/authenticate',
    {
      client_id: required('XRAY_CLIENT_ID_TEST_NOVO'),
      client_secret: required('XRAY_CLIENT_SECRET_TEST_NOVO')
    }
  );

  return response.data;
}

async function graphql(query: string) {
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

async function capturarDadosXray(
  issueId: string,
  issueKey: string
) {
  const userDataDir = path.resolve(
    'scripts/xray/chrome-profile'
  );

  const context = await chromium.launchPersistentContext(
    userDataDir,
    {
      headless: false,
      channel: 'chrome',
      args: [
        '--disable-blink-features=AutomationControlled'
      ]
    }
  );

  const page = context.pages()[0] || await context.newPage();

  let xAcpt = '';
  let testVersionId = '';

  page.on('request', request => {
    const headers = request.headers();
    const url = request.url();

    if (
      !xAcpt &&
      url.includes('us.xray.cloud.getxray.app') &&
      headers['x-acpt']
    ) {
      xAcpt = headers['x-acpt'];
    }

    const match = url.match(/testVersionId=([^&]+)/);

    if (!testVersionId && match) {
      testVersionId = match[1];
    }
  });

  page.on('response', async response => {
    const url = response.url();

    if (
      url.includes('/api/internal/tests/versions') &&
      response.status() === 200
    ) {
      try {
        const data = await response.json();
        const versions = data[issueId];

        if (
          Array.isArray(versions) &&
          versions.length > 0 &&
          versions[0].testVersionId
        ) {
          testVersionId = versions[0].testVersionId;
        }
      } catch {
        // Ignora resposta não JSON.
      }
    }
  });

  await page.goto(
    `${jiraBaseUrl}/browse/${issueKey}`,
    {
      waitUntil: 'domcontentloaded'
    }
  );

  console.log(`Aguardando Test Details do Xray em ${issueKey}...`);

  for (let i = 0; i < 120; i++) {
    if (xAcpt && testVersionId) {
      break;
    }

    await page.waitForTimeout(1000);
  }

  await context.close();

  if (!xAcpt) {
    throw new Error('Não foi possível capturar o x-acpt.');
  }

  if (!testVersionId) {
    throw new Error('Não foi possível capturar o testVersionId.');
  }

  return {
    xAcpt,
    testVersionId
  };
}

async function converterParaCucumber(
  issueId: string,
  testVersionId: string,
  xAcpt: string
) {
  const response = await axios.put(
    `https://us.xray.cloud.getxray.app/api/internal/${projectId}/test/${issueId}/type?testVersionId=${testVersionId}`,
    {
      value: cucumberTypeId
    },
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-acpt': xAcpt,
        'x-addon-key': 'com.xpandit.plugins.xray'
      }
    }
  );

  return response.data;
}

async function atualizarScenario(
  issueId: string,
  testVersionId: string,
  xAcpt: string,
  scenario: string
) {
  const response = await axios.put(
    `https://us.xray.cloud.getxray.app/api/internal/${projectId}/test/${issueId}/cucumber?testVersionId=${testVersionId}`,
    {
      value: scenario
    },
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-acpt': xAcpt,
        'x-addon-key': 'com.xpandit.plugins.xray'
      }
    }
  );

  return response.data;
}

async function main() {
  try {
    const scenarios = carregarScenariosDoFeature(featurePath);

    console.log('Cenários que serão criados:');
    console.log(
      scenarios.map(scenario => scenario.name)
    );

    if (scenarios.length === 0) {
      throw new Error('Nenhum cenário encontrado para criação.');
    }

    const tests: {
      id: string;
      key: string;
      name: string;
    }[] = [];

    for (const scenario of scenarios) {
      console.log(`Criando Test para: ${scenario.name}`);

      const test = await criarIssue(
        `[AUTOMAÇÃO] ${scenario.name}`,
        `Validar o cenário automatizado: ${scenario.name}`,
        issueTypes.test
      );

      console.log('TEST CRIADO:');
      console.log(test);

      const xrayData = await capturarDadosXray(
        test.issueId,
        test.issueKey
      );

      await converterParaCucumber(
        test.issueId,
        xrayData.testVersionId,
        xrayData.xAcpt
      );

      await atualizarScenario(
        test.issueId,
        xrayData.testVersionId,
        xrayData.xAcpt,
        scenario.scenario
      );

      console.log(`SCENARIO ATUALIZADO EM ${test.issueKey}`);

      tests.push({
        id: test.issueId,
        key: test.issueKey,
        name: scenario.name
      });
    }

    const testIds = tests.map(test => test.id);

    console.log('Criando Test Set...');

    const testSet = await criarIssue(
      'Validação do fluxo de cadastro Apponte.me',
      'Agrupamento dos testes automatizados do fluxo de cadastro Apponte.me.',
      issueTypes.testSet
    );

    await graphql(`
      mutation {
        addTestsToTestSet(
          issueId: "${testSet.issueId}",
          testIssueIds: ${JSON.stringify(testIds)}
        ) {
          addedTests
          warning
        }
      }
    `);

    console.log('Criando Test Plan...');

    const testPlan = await criarIssue(
      'Validação do fluxo de cadastro Apponte.me',
      'Plano de testes automatizados do fluxo de cadastro Apponte.me.',
      issueTypes.testPlan
    );

    await graphql(`
      mutation {
        addTestsToTestPlan(
          issueId: "${testPlan.issueId}",
          testIssueIds: ${JSON.stringify(testIds)}
        ) {
          addedTests
          warning
        }
      }
    `);

    console.log('Criando Test Execution...');

    const testExecution = await criarIssue(
      'Execução - Cadastro Apponte.me',
      'Execução automatizada dos testes do fluxo de cadastro Apponte.me.',
      issueTypes.testExecution
    );

    await graphql(`
      mutation {
        addTestsToTestExecution(
          issueId: "${testExecution.issueId}",
          testIssueIds: ${JSON.stringify(testIds)}
        ) {
          addedTests
          warning
        }
      }
    `);

    await graphql(`
      mutation {
        addTestExecutionsToTestPlan(
          issueId: "${testPlan.issueId}",
          testExecIssueIds: ["${testExecution.issueId}"]
        ) {
          addedTestExecutions
          warning
        }
      }
    `);

    const executionData = {
      featurePath,
      tests,
      testSet: {
        id: testSet.issueId,
        key: testSet.issueKey
      },
      testPlan: {
        id: testPlan.issueId,
        key: testPlan.issueKey
      },
      testExecution: {
        id: testExecution.issueId,
        key: testExecution.issueKey
      }
    };

    fs.writeFileSync(
      'scripts/xray/current-execution.json',
      JSON.stringify(executionData, null, 2)
    );

    console.log('PACOTE DA FEATURE CRIADO COM SUCESSO');
    console.log(JSON.stringify(executionData, null, 2));
  } catch (error: any) {
    console.log('ERRO AO CRIAR PACOTE DA FEATURE');
    console.log(error?.response?.data || error.message);
  }
}

main();
