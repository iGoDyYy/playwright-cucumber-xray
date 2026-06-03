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

const issueTypes = {
  test: '10007',
  testSet: '10008',
  testPlan: '10009',
  testExecution: '10010'
};

const cucumberTypeId = '6a1eeb901dc9631a8894f160';

function carregarScenarioDoFeature(
  featurePath: string,
  scenarioName: string
) {
  const feature = fs.readFileSync(featurePath, 'utf-8');

  const lines = feature.split(/\r?\n/);

  const scenarioStartIndex = lines.findIndex(line =>
    line
      .trim()
      .toLowerCase()
      .startsWith(`cenario: ${scenarioName.toLowerCase()}`)
  );

  if (scenarioStartIndex === -1) {
    throw new Error(
      `Cenário "${scenarioName}" não encontrado em ${featurePath}`
    );
  }

  const scenarioLines: string[] = [];

  for (let i = scenarioStartIndex; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (
      i !== scenarioStartIndex &&
      trimmed.toLowerCase().startsWith('cenario:')
    ) {
      break;
    }

    if (trimmed.startsWith('@') || trimmed === '') {
      continue;
    }

    scenarioLines.push(trimmed);
  }

  return scenarioLines
    .join('\n')
    .replace(/^Cenario:/gm, 'Scenario:')
    .replace(/^Cenário:/gm, 'Scenario:')
    .replace(/^Dado /gm, 'Given ')
    .replace(/^Quando /gm, 'When ')
    .replace(/^Então /gm, 'Then ')
    .replace(/^Entao /gm, 'Then ')
    .replace(/^E /gm, 'And ');
}

const pacote = {
  nome: 'Cadastro Apponte.me',

  testSummary:
    '[AUTOMAÇÃO] Realizar cadastro completo com validação de email',

  testDescription:
    'Validar o comportamento do sistema durante o fluxo de cadastro completo com validação de email.',

  testSetSummary:
    'Validação do fluxo de cadastro Apponte.me',

  testSetDescription:
    `Eu como QA,

Gostaria de validar os fluxos automatizados relacionados ao cadastro Apponte.me,

Porque assim consigo garantir o funcionamento correto do fluxo de cadastro, validações obrigatórias, preenchimento de dados, endereço, documentos, termos e prontidão para conclusão.`,

  testPlanSummary:
    'Validação do fluxo de cadastro Apponte.me',

  testPlanDescription:
    `Eu como QA

Gostaria de testar todas as funcionalidades relacionadas ao cadastro Apponte.me

Porque assim consigo garantir o correto funcionamento do fluxo de cadastro, preenchimento de dados, endereço, documentos, termos, validações e confirmação de e-mail.`,

  scenario: carregarScenarioDoFeature(
    'features/cadastro.feature',
    'Realizar cadastro completo com validacao de email'
  )
};

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
    {
      query
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data;
}

async function adicionarTestAoTestSet(
  testSetIssueId: string,
  testIssueId: string
) {
  return graphql(`
    mutation {
      addTestsToTestSet(
        issueId: "${testSetIssueId}",
        testIssueIds: ["${testIssueId}"]
      ) {
        addedTests
        warning
      }
    }
  `);
}

async function adicionarTestAoTestPlan(
  testPlanIssueId: string,
  testIssueId: string
) {
  return graphql(`
    mutation {
      addTestsToTestPlan(
        issueId: "${testPlanIssueId}",
        testIssueIds: ["${testIssueId}"]
      ) {
        addedTests
        warning
      }
    }
  `);
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

  console.log('Aguardando carregar Test Details do Xray...');

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
  xAcpt: string
) {
  const response = await axios.put(
    `https://us.xray.cloud.getxray.app/api/internal/${projectId}/test/${issueId}/cucumber?testVersionId=${testVersionId}`,
    {
      value: pacote.scenario
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
    console.log('Scenario carregado do feature:');
    console.log(pacote.scenario);

    console.log('Criando Test...');

    const test = await criarIssue(
      pacote.testSummary,
      pacote.testDescription,
      issueTypes.test
    );

    console.log('TEST CRIADO:');
    console.log(test);

    console.log('Capturando dados do Xray...');

    const xrayData = await capturarDadosXray(
      test.issueId,
      test.issueKey
    );

    console.log('DADOS XRAY CAPTURADOS:');
    console.log({
      testVersionId: xrayData.testVersionId,
      xAcpt: 'capturado'
    });

    console.log('Convertendo para Cucumber...');

    const typeResult = await converterParaCucumber(
      test.issueId,
      xrayData.testVersionId,
      xrayData.xAcpt
    );

    console.log('TIPO ALTERADO:');
    console.log(typeResult);

    console.log('Atualizando Scenario...');

    const scenarioResult = await atualizarScenario(
      test.issueId,
      xrayData.testVersionId,
      xrayData.xAcpt
    );

    console.log('SCENARIO ATUALIZADO:');
    console.log(scenarioResult);

    console.log('Criando Test Set...');

    const testSet = await criarIssue(
      pacote.testSetSummary,
      pacote.testSetDescription,
      issueTypes.testSet
    );

    console.log('TEST SET CRIADO:');
    console.log(testSet);

    console.log('Adicionando Test ao Test Set...');

    const testSetResult = await adicionarTestAoTestSet(
      testSet.issueId,
      test.issueId
    );

    console.log('TEST ADICIONADO AO TEST SET:');
    console.log(JSON.stringify(testSetResult, null, 2));

    console.log('Criando Test Plan...');

    const testPlan = await criarIssue(
      pacote.testPlanSummary,
      pacote.testPlanDescription,
      issueTypes.testPlan
    );

    console.log('TEST PLAN CRIADO:');
    console.log(testPlan);

    console.log('Adicionando Test ao Test Plan...');

    const testPlanResult = await adicionarTestAoTestPlan(
      testPlan.issueId,
      test.issueId
    );

    console.log('TEST ADICIONADO AO TEST PLAN:');
    console.log(JSON.stringify(testPlanResult, null, 2));

    console.log('Criando Test Execution...');

    const testExecution = await criarIssue(
      `Execução - ${pacote.nome}`,
      `Execução automatizada dos testes relacionados a ${pacote.nome}.`,
      issueTypes.testExecution
    );

    console.log('TEST EXECUTION CRIADO:');
    console.log(testExecution);

    console.log('Adicionando Test ao Test Execution...');

    const testExecutionResult = await graphql(`
      mutation {
        addTestsToTestExecution(
          issueId: "${testExecution.issueId}",
          testIssueIds: ["${test.issueId}"]
        ) {
          addedTests
          warning
        }
      }
    `);

    console.log('TEST ADICIONADO AO TEST EXECUTION:');
    console.log(JSON.stringify(testExecutionResult, null, 2));

    console.log('Associando Test Execution ao Test Plan...');

    const executionPlanResult = await graphql(`
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

    console.log('TEST EXECUTION ASSOCIADO AO TEST PLAN:');
    console.log(JSON.stringify(executionPlanResult, null, 2));

    const executionData = {
      test: {
        id: test.issueId,
        key: test.issueKey
      },
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

    console.log('PACOTE DE AUTOMAÇÃO CRIADO COM SUCESSO');
    console.log(executionData);
    console.log('Arquivo salvo em scripts/xray/current-execution.json');
  } catch (error: any) {
    console.log('ERRO AO CRIAR PACOTE DE AUTOMAÇÃO');
    console.log(error?.response?.data || error.message);
  }
}

main();