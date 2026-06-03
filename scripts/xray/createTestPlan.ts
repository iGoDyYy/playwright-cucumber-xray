import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function main() {

  const token = Buffer
    .from(
      `${process.env.JIRA_EMAIL_TEST_NOVO}:${process.env.JIRA_API_TOKEN_TEST_NOVO}`
    )
    .toString('base64');

  const payload = {
    fields: {
      project: {
        key: process.env.PROJECT_KEY_TEST_NOVO
      },
      summary: '[TESTE AUTOMAÇÃO] Test Plan criado via API',
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Teste de criação automática via API.'
              }
            ]
          }
        ]
      },
      issuetype: {
        name: 'Test Plan'
      }
    }
  };

  const response = await axios.post(
    `${process.env.JIRA_BASE_URL_TEST_NOVO}/rest/api/3/issue`,
    payload,
    {
      headers: {
        Authorization: `Basic ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
  );

  console.log('CRIADO COM SUCESSO');
  console.log(response.data);
}

main();