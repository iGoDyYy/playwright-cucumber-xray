import { Page, expect } from '@playwright/test';

import { BasePage } from './BasePage';

export class HomePage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  async acessarSite() {

    await this.navegar('https://apponte.me');

    await this.page.waitForLoadState(
      'domcontentloaded'
    );
  }

  async validarHomeCarregada() {

    await expect(
      this.page.getByRole(
        'img',
        {
          name: /Apponte/i
        }
      ).first()
    ).toBeVisible();
  }
}