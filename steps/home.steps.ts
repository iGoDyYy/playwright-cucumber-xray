import {
  Given,
  Then
} from '@cucumber/cucumber';

import { HomePage } from '../pages/HomePage';

import { page } from '../hooks/hooks';

let homePage: HomePage;

Given('que acesso o Apponte.me', async () => {

  homePage = new HomePage(page);

  await homePage.acessarSite();
});

Then('devo visualizar a home carregada', async () => {

  await homePage.validarHomeCarregada();
});