import axios from 'axios';
import dotenv from 'dotenv';

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

const testExecutionIssueTypeId = '10010';

const summary =
  'Execução dos testes automatizados do fluxo de cadastro Apponte.me';

const description =
  `Eu como QA

Gostaria de executar os testes automatizados relacionados ao fluxo de cadastro Apponte.me

Porque assim consigo validar o comportamento do cadastro, preenchimento de dados, endereço, documentos, termos e confirmação de e-mail através da automação.`;

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

async function main() {
  try {
    const payload = {
      fields: {
        project: {
          key: projectKey
        },
        summary,
        description: adf(description),
        issuetype: {
          id: testExecutionIssueTypeId
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

    console.log('TEST EXECUTION CRIADO COM SUCESSO');
    console.log(response.data);
  } catch (error: any) {
    console.log('ERRO AO CRIAR TEST EXECUTION');
    console.log(error?.response?.data || error.message);
  }
}

main();