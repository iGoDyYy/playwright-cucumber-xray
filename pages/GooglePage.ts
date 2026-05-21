import { Page, expect } from '@playwright/test';

export class GooglePage {
  constructor(private page: Page) {}

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
}