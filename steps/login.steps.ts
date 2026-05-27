import {
  When,
  Then
} from '@cucumber/cucumber';

import {
  expect
} from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';

import { page } from '../hooks/hooks';

let loginPage: LoginPage;

When('clico no botão Painel', async () => {

  loginPage = new LoginPage(page);

  await loginPage.clicarPainel();
});

When('preencho email e senha válidos', async () => {

  const email = process.env.EMAIL_LOGIN;
  const senha = process.env.PASSWORD_LOGIN;

  if (!email || !senha) {

    throw new Error(
      'EMAIL_LOGIN ou PASSWORD_LOGIN não definidos'
    );
  }

  await loginPage.preencherLogin(
    email,
    senha
  );
});

When('clico no botão Entrar', async () => {

  await loginPage.clicarEntrar();
});

Then('devo visualizar o painel logado', async () => {

  await expect(page).toHaveURL(
    /painel|dashboard|home/,
    {
      timeout: 60000
    }
  );

  await page.screenshot({
    path: 'reports/screenshots/login-sucesso.png',
    fullPage: true
  });
});