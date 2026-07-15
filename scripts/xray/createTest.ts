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

      summary:
        '[AUTOMAÇÃO] Realizar cadastro completo com validação de email',

      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text:
                  'Validar o comportamento do sistema durante o fluxo de cadastro completo com validação de email.'
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

  console.log(
    'TEST CRIADO COM SUCESSO'
  );

  console.log(
    response.data
  );
}

main();
