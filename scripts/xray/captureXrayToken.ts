import { chromium } from 'playwright';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function main() {
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

  const page =
    context.pages()[0] || await context.newPage();

  let xAcptToken = '';

  page.on('request', request => {
    const headers = request.headers();

    if (
      !xAcptToken &&
      request.url().includes('us.xray.cloud.getxray.app') &&
      headers['x-acpt']
    ) {
      xAcptToken = headers['x-acpt'];

      const outputPath = path.resolve(
        'scripts/xray/xray-token.json'
      );

      fs.writeFileSync(
        outputPath,
        JSON.stringify(
          {
            xAcpt: xAcptToken,
            capturedAt: new Date().toISOString()
          },
          null,
          2
        )
      );

      console.log('X-ACPT CAPTURADO COM SUCESSO');
      console.log(`Arquivo salvo em: ${outputPath}`);
    }
  });

  await page.goto(
    'https://detonador12345677.atlassian.net/browse/QA-60',
    {
      waitUntil: 'domcontentloaded'
    }
  );

  console.log('Chrome aberto com perfil persistente.');
  console.log('Faça login se necessário.');
  console.log('Depois espere o Test Details do Xray carregar.');
  console.log('Quando aparecer X-ACPT CAPTURADO, pode fechar o navegador.');

  for (let i = 0; i < 120; i++) {
    if (xAcptToken) {
      break;
    }
  
    await page.waitForTimeout(1000);
  }
  
  if (!xAcptToken) {
    console.log('Nenhum x-acpt foi capturado.');
    console.log('Dica: com o navegador aberto, recarregue a página QA-60 e espere o Xray carregar.');
  }
  
  await context.close();
}

main();