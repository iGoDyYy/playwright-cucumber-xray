import dotenv from 'dotenv';
import { chromium } from 'playwright';
import path from 'path';
import axios from 'axios';

import {
  criarIssue,
  criarIssueLink,
  issueTypes,
  jiraConfig
} from './lib/jira';

import {
  adicionarPreconditionsAoTest,
  adicionarTestsAoTestExecution,
  adicionarTestsAoTestPlan,
  adicionarTestsAoTestSet,
  associarTestExecutionAoTestPlan,
  cucumberTypeId,
  projectId
} from './lib/xray';

import {
  carregarPreconditionDoFeature,
  carregarScenariosDoFeature
} from './lib/feature';

import {
  salvarExecutionData
} from './lib/execution';

dotenv.config();

const featurePath = process.argv[2];
const developmentIssueKey = process.argv[3];

if (!featurePath) {
  throw new Error(
    'Informe o caminho da feature. Exemplo: features/cadastro.feature'
  );
}

if (!developmentIssueKey) {
  throw new Error(
    'Informe a AP vinculada. Exemplo: AP-123'
  );
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
    `${jiraConfig.baseUrl}/browse/${issueKey}`,
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

async function atualizarCucumberContent(
  issueId: string,
  testVersionId: string,
  xAcpt: string,
  cucumberContent: string
) {
  const response = await axios.put(
    `https://us.xray.cloud.getxray.app/api/internal/${projectId}/test/${issueId}/cucumber?testVersionId=${testVersionId}`,
    {
      value: cucumberContent
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

async function criarPreconditionAutomatica() {
  const precondition = carregarPreconditionDoFeature(featurePath);

  if (!precondition) {
    console.log('Nenhum Contexto encontrado. Nenhuma Precondition será criada.');
    return null;
  }

  console.log(`Criando Precondition automática: ${precondition.name}`);

  const issue = await criarIssue(
    `[PRECONDITION] ${precondition.name}`,
    `Precondition gerada automaticamente a partir do Contexto da feature: ${featurePath}

${precondition.scenario}`,
    issueTypes.precondition
  );

  console.log('PRECONDITION CRIADA:');
  console.log(issue);

  return {
    id: issue.issueId,
    key: issue.issueKey,
    name: precondition.name
  };
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

    const precondition = await criarPreconditionAutomatica();

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

      await atualizarCucumberContent(
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

    if (precondition) {
      console.log('Ligando Precondition automática aos Tests...');

      for (const test of tests) {
        await adicionarPreconditionsAoTest(
          test.id,
          [precondition.id]
        );
      }

      console.log('PRECONDITION LIGADA AOS TESTS COM SUCESSO');
    }

    console.log('Criando Test Set...');

    const testSet = await criarIssue(
      'Validação do fluxo de cadastro Apponte.me',
      'Agrupamento dos testes automatizados do fluxo de cadastro Apponte.me.',
      issueTypes.testSet
    );

    await adicionarTestsAoTestSet(
      testSet.issueId,
      testIds
    );

    console.log('Criando Test Plan...');

    const testPlan = await criarIssue(
      'Validação do fluxo de cadastro Apponte.me',
      'Plano de testes automatizados do fluxo de cadastro Apponte.me.',
      issueTypes.testPlan
    );

    await adicionarTestsAoTestPlan(
      testPlan.issueId,
      testIds
    );

    console.log('Criando Test Execution...');

    const testExecution = await criarIssue(
      'Execução - Cadastro Apponte.me',
      'Execução automatizada dos testes do fluxo de cadastro Apponte.me.',
      issueTypes.testExecution
    );

    await adicionarTestsAoTestExecution(
      testExecution.issueId,
      testIds
    );

    await associarTestExecutionAoTestPlan(
      testPlan.issueId,
      testExecution.issueId
    );

    console.log('Criando vínculos Jira para rastreabilidade...');

    for (const test of tests) {
      await criarIssueLink(testSet.issueKey, test.key);
      await criarIssueLink(testPlan.issueKey, test.key);
      await criarIssueLink(testExecution.issueKey, test.key);

      if (precondition) {
        await criarIssueLink(precondition.key, test.key);
      }
    }

    await criarIssueLink(testPlan.issueKey, testExecution.issueKey);

    console.log(`Vinculando AP ${developmentIssueKey} aos artefatos Xray...`);

    await criarIssueLink(developmentIssueKey, testSet.issueKey);
    await criarIssueLink(developmentIssueKey, testPlan.issueKey);
    await criarIssueLink(developmentIssueKey, testExecution.issueKey);

    if (precondition) {
      await criarIssueLink(developmentIssueKey, precondition.key);
    }

    console.log('AP VINCULADA AO TEST SET, TEST PLAN, TEST EXECUTION E PRECONDITION');

    console.log('VÍNCULOS JIRA CRIADOS COM SUCESSO');

    const executionData = {
      featurePath,
      developmentIssueKey,
      precondition,
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

    salvarExecutionData(executionData);

    console.log('PACOTE DA FEATURE CRIADO COM SUCESSO');
    console.log(JSON.stringify(executionData, null, 2));
  } catch (error: any) {
    console.log('ERRO AO CRIAR PACOTE DA FEATURE');
    console.log(error?.response?.data || error.message);
  }
}

main();