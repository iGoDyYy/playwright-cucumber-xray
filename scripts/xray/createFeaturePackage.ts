import dotenv from 'dotenv';
import { chromium } from 'playwright';
import path from 'path';
import axios from 'axios';

import {
  criarIssue,
  issueTypes,
  jiraConfig
} from './lib/jira';

import {
  adicionarTestsAoTestExecution,
  adicionarTestsAoTestPlan,
  adicionarTestsAoTestSet,
  associarTestExecutionAoTestPlan,
  cucumberTypeId,
  projectId
} from './lib/xray';

import {
  carregarScenariosDoFeature
} from './lib/feature';

import {
  salvarExecutionData
} from './lib/execution';

dotenv.config();

const featurePath = process.argv[2];

if (!featurePath) {
  throw new Error(
    'Informe o caminho da feature. Exemplo: features/cadastro.feature'
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

    salvarExecutionData(executionData);

    console.log('PACOTE DA FEATURE CRIADO COM SUCESSO');
    console.log(JSON.stringify(executionData, null, 2));
  } catch (error: any) {
    console.log('ERRO AO CRIAR PACOTE DA FEATURE');
    console.log(error?.response?.data || error.message);
  }
}

main();