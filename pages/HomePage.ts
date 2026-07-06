import { Page, expect } from '@playwright/test';

import { BasePage } from './BasePage';

import { environment } from '../utils/environment';

export class HomePage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  async acessarSite() {
  
    if (environment.isStaging) {
      await this.navegar(environment.loginUrl);
      return;
    }
  
    await this.navegar(environment.baseUrl);
  
    await this.page.waitForLoadState(
      'domcontentloaded'
    );
  }

  async validarHomeCarregada() {

    if (environment.isStaging) {
      await expect(this.page).toHaveURL(/painel\/login/);
      return;
    }

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