import {
  Given,
  When,
  Then
} from '@cucumber/cucumber';

import {
  expect
} from '@playwright/test';

import { GooglePage } from '../pages/GooglePage';

import { page } from '../hooks/hooks';

let googlePage: GooglePage;

Given('que acesso o Google', async () => {

  googlePage = new GooglePage(page);

  await googlePage.acessarGoogle();
});

When(
  'pesquiso por {string}',
  async (texto: string) => {

    await googlePage.pesquisar(texto);
  }
);

Then(
  'devo visualizar o título Google',
  async () => {

    await expect(page)
      .toHaveTitle(/Google/);
  }
);

Then(
  'devo visualizar resultados da pesquisa',
  async () => {

    await expect(page)
      .toHaveURL(/search/);
  }
);