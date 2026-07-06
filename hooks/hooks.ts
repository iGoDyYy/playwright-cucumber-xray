import dotenv from 'dotenv';

dotenv.config();

import {
  BeforeAll,
  Before,
  After,
  Status,
  setDefaultTimeout
} from '@cucumber/cucumber';

import {
  chromium,
  Browser,
  BrowserContext,
  Page
} from '@playwright/test';

import fs from 'fs';

setDefaultTimeout(300000);

export let browser: Browser;

export let context: BrowserContext;

export let page: Page;

function limparDiretorioSeguro(diretorio: string) {
  if (!fs.existsSync(diretorio)) {
    return;
  }

  fs.rmSync(diretorio, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 200
  });
}

function prepararPastasDeRelatorio() {

  // limpa vídeos antigos
  limparDiretorioSeguro('reports/videos');

  // limpa screenshots antigos
  limparDiretorioSeguro('reports/screenshots');

  // recria screenshots
  fs.mkdirSync('reports/screenshots', {
    recursive: true
  });

  // recria vídeos
  fs.mkdirSync('reports/videos', {
    recursive: true
  });
}

function aguardar(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let ultimoEnvioEmail = 0;

BeforeAll(async function () {
  prepararPastasDeRelatorio();
});

Before(
  { tags: '@cadastro-real' },
  async function () {

    if (process.env.CADASTRO_REAL !== 'true') {

      console.log(
        '⏭️ Cenário @cadastro-real ignorado. ' +
        'Defina CADASTRO_REAL=true no .env apenas com permissão para cadastrar.'
      );

      return 'skipped';
    }
  }
);

Before(async function () {

  if (ultimoEnvioEmail > 0) {

    const tempoDecorrido = Date.now() - ultimoEnvioEmail;
  
    const tempoMinimo = 180000; // 3 minutos
  
    if (tempoDecorrido < tempoMinimo) {
  
      const restante = tempoMinimo - tempoDecorrido;
  
      console.log(
        `⏳ Aguardando ${Math.ceil(restante / 1000)} segundos antes do próximo cenário...`
      );
  
      await aguardar(restante);
    }
  }

  browser = await chromium.launch({

    headless: process.env.CI === 'true',

    args: [
      '--start-maximized'
    ]
  });

  context = await browser.newContext({

    viewport: {
      width: 1920,
      height: 1080
    },
  
    httpCredentials: process.env.MAILHOG_USER && process.env.MAILHOG_PASSWORD
      ? {
          username: process.env.MAILHOG_USER,
          password: process.env.MAILHOG_PASSWORD
        }
      : undefined,
  
    recordVideo: {
  
      dir: 'reports/videos',
  
      size: {
        width: 1920,
        height: 1080
      }
    }
  });

  page = await context.newPage();
});

After(async function (scenario) {

  if (
    scenario.result?.status === Status.FAILED
    && page
  ) {

    const nomeArquivo = scenario.pickle.name
      .replace(/ /g, '_')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    await page.screenshot({

      path: `reports/screenshots/ERRO_${nomeArquivo}.png`,

      fullPage: true
    });

    console.log('📸 Screenshot salva!');
  }

  if (page) {
    await page.close();
  }

  if (context) {
    await context.close();
  }

  if (browser) {
    await browser.close();
  }

});