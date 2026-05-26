import {
  When,
  Then
} from '@cucumber/cucumber';

import {
  expect
} from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';

import { page } from './google.steps';

let loginPage: LoginPage;

When('clico no botão Painel', async () => {

  loginPage = new LoginPage(page);

  await loginPage.clicarPainel();
});

When('preencho email e senha válidos', async () => {

  await loginPage.preencherLogin(
    process.env.EMAIL_LOGIN!,
    process.env.PASSWORD_LOGIN!
  );
});

When('clico no botão Entrar', async () => {

  await loginPage.clicarEntrar();
});

Then('devo visualizar o painel logado', async () => {

  await expect(page).toHaveURL(/painel|dashboard|home/);
});