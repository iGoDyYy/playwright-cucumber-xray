import axios from 'axios';
import { execSync } from 'child_process';
import { getXrayToken } from './getToken';

const testExecutionKey = 'QA-68';
const testKey = 'QA-65';

async function sendResultToXray(status: 'PASSED' | 'FAILED') {
  const token = await getXrayToken();

  const payload = {
    testExecutionKey,
    tests: [
      {
        testKey,
        status,
        comment: `Resultado enviado automaticamente após execução do Cucumber. Status: ${status}`
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

  return response.data;
}

async function main() {
  let status: 'PASSED' | 'FAILED' = 'PASSED';

  try {
    console.log('Executando testes Cucumber...');
    execSync('npm run test:cadastro', {
      stdio: 'inherit'
    });

    status = 'PASSED';
  } catch {
    status = 'FAILED';
  }

  console.log(`Enviando resultado para o Xray: ${status}`);

  try {
    const result = await sendResultToXray(status);

    console.log('RESULTADO ENVIADO AO XRAY');
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.log('ERRO AO ENVIAR RESULTADO AO XRAY');
    console.log(error?.response?.data || error.message);
    process.exit(1);
  }

  if (status === 'FAILED') {
    process.exit(1);
  }
}

main();