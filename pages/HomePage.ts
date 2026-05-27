import { Page, expect } from '@playwright/test';

import { BasePage } from './BasePage';

export class HomePage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  async acessarSite() {

    await this.page.goto('https://apponte.me');
    await this.page.waitForLoadState('networkidle');
  }

  async validarHomeCarregada() {

    await expect(this.page).toHaveURL(/apponte.me/);
    await expect(this.page.getByRole('img')).toBeVisible();
  }
}