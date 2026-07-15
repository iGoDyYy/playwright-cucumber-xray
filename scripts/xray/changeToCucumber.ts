import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const projectId = '10001';
const issueId = '10063';
const testVersionId = '6a1f28d147e885e433e69daa';

const cucumberTypeId = '6a1eeb901dc9631a8894f160';

const tokenFile = JSON.parse(
    fs.readFileSync(
      'scripts/xray/xray-token.json',
      'utf-8'
    )
  );
  
  const xAcpt = tokenFile.xAcpt;

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

async function main() {
  try {
    const typeResponse = await axios.put(
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

    console.log('TIPO ALTERADO:');
    console.log(typeResponse.data);

    const scenarioResponse = await axios.put(
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

    console.log('SCENARIO ATUALIZADO:');
    console.log(scenarioResponse.data);
  } catch (error: any) {
    console.log('STATUS:', error?.response?.status);
    console.log(error?.response?.data || error.message);
  }
}

main();