import { Page, expect } from '@playwright/test';

import { BasePage } from './BasePage';

export class GooglePage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  async acessarGoogle() {
    await this.page.goto('https://www.google.com');

    await this.page.waitForLoadState('networkidle');
  }

  async pesquisar(texto: string) {
    const campoPesquisa = this.page.getByRole('combobox');

    await campoPesquisa.waitFor({
      state: 'visible',
      timeout: 30000
    });

    await campoPesquisa.click();

    await campoPesquisa.fill(texto);

    await this.page.keyboard.press('Enter');

    await this.page.waitForURL('**/search**', {
      timeout: 30000
    });
  }

  async validarTituloGoogle() {
    await expect
      .poll(
        async () => this.page.title(),
        { timeout: 30000 }
      )
      .toMatch(/Google/i);
  }

  async validarResultadosDaPesquisa() {
    await expect(this.page).toHaveURL(/search/);
  }
}