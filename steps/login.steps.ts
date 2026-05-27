import {
  When,
  Then
} from '@cucumber/cucumber';

import { LoginPage } from '../pages/LoginPage';

import { page } from '../hooks/hooks';

let loginPage: LoginPage;

When('acesso a tela de login do painel', async () => {

  loginPage = new LoginPage(page);

  await loginPage.acessarPainel();
});

When('informo credenciais válidas', async () => {

  await loginPage.informarCredenciaisValidas();
});

When('confirmo o login', async () => {

  await loginPage.confirmarLogin();
});

Then('devo estar autenticado no painel', async () => {

  await loginPage.validarPainelLogado();
});
