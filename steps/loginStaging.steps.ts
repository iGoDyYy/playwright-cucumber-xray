import {
  Given,
  When,
  Then
} from '@cucumber/cucumber';

import { page } from '../hooks/hooks';

import { LoginPageStaging } from '../pages/LoginPageStaging';

let loginPageStaging: LoginPageStaging;

Given(
  'que acesso o Apponte.me staging',
  async () => {

    loginPageStaging =
      new LoginPageStaging(page);

    await loginPageStaging
      .acessarLogin();
  }
);

When(
  'acesso a tela de login do painel staging',
  async () => {
    // já estamos na página de login
  }
);

When(
  'informo credenciais válidas do staging',
  async () => {

    await loginPageStaging
      .preencherCredenciais();
  }
);

When(
  'confirmo o login do staging',
  async () => {

    await loginPageStaging
      .confirmarLogin();
  }
);

Then(
  'devo estar autenticado no painel staging',
  async () => {

    await loginPageStaging
      .validarLogin();
  }
);