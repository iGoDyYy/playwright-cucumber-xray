import dotenv from 'dotenv';

dotenv.config();

import {
  Given,
  When,
  Then,
  Before,
  After,
  setDefaultTimeout,
  Status
} from '@cucumber/cucumber';

import {
  chromium,
  Browser,
  Page,
  expect
} from '@playwright/test';

import fs from 'fs';

import { GooglePage } from '../pages/GooglePage';

setDefaultTimeout(60000);

let browser: Browser;

export let page: Page;

let googlePage: GooglePage;

Before(async function () {

  // limpa vídeos antigos
  if (fs.existsSync('reports/videos')) {
    fs.rmSync('reports/videos', {
      recursive: true,
      force: true
    });
  }

  // limpa screenshots antigos
  if (fs.existsSync('reports/screenshots')) {
    fs.rmSync('reports/screenshots', {
      recursive: true,
      force: true
    });
  }

  // recria pasta screenshots
  if (!fs.existsSync('reports/screenshots')) {
    fs.mkdirSync('reports/screenshots', {
      recursive: true
    });
  }

  // recria pasta videos
  if (!fs.existsSync('reports/videos')) {
    fs.mkdirSync('reports/videos', {
      recursive: true
    });
  }

  browser = await chromium.launch({

    // local abre navegador
    // github roda headless
    headless: process.env.CI ? true : false,

    args: [
      '--start-maximized'
    ]
  });

  page = await browser.newPage({

    viewport: {
      width: 1920,
      height: 1080
    },

    recordVideo: {

      dir: 'reports/videos',

      size: {
        width: 1920,
        height: 1080
      }
    }
  });

  googlePage = new GooglePage(page);
});

After(async function (scenario) {

  // screenshot somente em falha
  if (scenario.result?.status === Status.FAILED && page) {

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

  await page?.close();

  await browser?.close();
});

Given('que acesso o Google', async () => {

  await googlePage.acessarGoogle();
});

When('pesquiso por {string}', async (texto: string) => {

  await googlePage.pesquisar(texto);
});

Then('devo visualizar o título Google', async () => {

  await expect(page).toHaveTitle(/Google/);
});

Then('devo visualizar resultados da pesquisa', async () => {

  await expect(page).toHaveURL(/search/);
});