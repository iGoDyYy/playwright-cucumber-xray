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

const testSetIssueTypeId = '10008';

const summary =
  'Validação do fluxo de cadastro Apponte.me';

const description =
  `Eu como QA,

Gostaria de validar os fluxos automatizados relacionados ao cadastro Apponte.me,

Porque assim consigo garantir o funcionamento correto do fluxo de cadastro, validações obrigatórias, preenchimento de dados, endereço, documentos, termos e prontidão para conclusão.`;

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

async function main() {
  try {
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
          id: testSetIssueTypeId
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

    console.log('TEST SET CRIADO COM SUCESSO');
    console.log(response.data);
  } catch (error: any) {
    console.log('ERRO AO CRIAR TEST SET');
    console.log(error?.response?.data || error.message);
  }
}

main();
