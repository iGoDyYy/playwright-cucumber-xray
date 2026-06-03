import axios from 'axios';
import { getXrayToken } from './getToken';

const testExecutionKey = 'QA-68';
const testKey = 'QA-65';

async function main() {
  try {
    const token = await getXrayToken();

    const payload = {
      testExecutionKey,
      tests: [
        {
          testKey,
          status: 'PASSED',
          comment: 'Teste marcado como PASSED via API do Xray.'
        }
      ]
    };

    const response = await axios.post(
      'https://xray.cloud.getxray.app/api/v2/import/execution',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('RESULTADO ENVIADO AO XRAY');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.log('ERRO AO ENVIAR RESULTADO AO XRAY');
    console.log(error?.response?.data || error.message);
  }
}

main();