import {
  Given,
  Then
} from '@cucumber/cucumber';

import {
  expect
} from '@playwright/test';

import { HomePage } from '../pages/HomePage';

import { page } from './google.steps';

let homePage: HomePage;

Given('que acesso o Apponte.me', async () => {

  homePage = new HomePage(page);

  await homePage.acessarSite();
});

Then('devo visualizar a home carregada', async () => {

  await expect(page).toHaveURL(/apponte.me/);

  await expect(
    homePage.logoApponte()
  ).toBeVisible();
});