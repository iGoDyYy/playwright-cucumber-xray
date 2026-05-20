import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { chromium, Browser, Page, expect } from '@playwright/test';
import { GooglePage } from '../pages/GooglePage';

let browser: Browser;
let page: Page;
let googlePage: GooglePage;

Before(async () => {
  browser = await chromium.launch({
    headless: false
  });

  page = await browser.newPage();

  googlePage = new GooglePage(page);
});

After(async () => {
  await browser.close();
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
