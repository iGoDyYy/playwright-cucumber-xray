import axios from 'axios';
import dotenv from 'dotenv';
import { chromium } from 'playwright';
import path from 'path';

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
const cucumberTypeId = '6a1eeb901dc9631a8894f160';

const summary =
  '[AUTOMAÇÃO] Realizar cadastro completo com validação de email';

const description =
  'Validar o comportamento do sistema durante o fluxo de cadastro completo com validação de email.';

const scenario = `Scenario: Realizar cadastro completo com validacao de email

Given que acesso a página de cadastro
When preencho os dados do novo usuário
And confirmo o cadastro
And preencho os dados de endereço
And confirmo o endereço
And preencho os documentos da empresa
And confirmo os documentos
And preencho os termos
And confirmo os termos
Then o usuário deve ser cadastrado com sucesso
And valido o email enviado`;

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

async function criarTestNoJira() {
  const payload = {
    fields: {
      project: {
        key: projectKey
      },
      summary,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: description
              }
            ]
          }
        ]
      },
      issuetype: {
        id: '10007'
      }
    }
  };

  const response = await axios.post(
    `${jiraBaseUrl}/rest/api/3/issue`,
    payload,
    {
      headers: getJiraHeaders()
    }
  );

  return {
    issueId: response.data.id,
    issueKey: response.data.key
  };
}

async function capturarDadosXray(issueId: string, issueKey: string) {
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
        // Ignora respostas que não forem JSON.
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
    console.log('Criando Test no Jira...');

    const test = await criarTestNoJira();

    console.log('TEST CRIADO:');
    console.log(test);

    console.log('Capturando x-acpt e testVersionId...');

    const xrayData = await capturarDadosXray(
      test.issueId,
      test.issueKey
    );

    console.log('DADOS XRAY CAPTURADOS:');
    console.log({
      testVersionId: xrayData.testVersionId,
      xAcpt: 'capturado'
    });

    console.log('Convertendo Test para Cucumber...');

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

    console.log('PROCESSO CONCLUÍDO COM SUCESSO');
    console.log(`Test criado: ${test.issueKey}`);
  } catch (error: any) {
    console.log('ERRO AO CRIAR TEST AUTOMATIZADO');
    console.log(error?.response?.data || error.message);
  }
}

main();
