import { Page } from '@playwright/test';

export class GooglePage {
  constructor(private page: Page) {}

  async acessarGoogle() {
    await this.page.goto('https://google.com');
  }

  async pesquisar(texto: string) {
    await this.page.getByRole('combobox', { name: 'Pesquisar' }).fill(texto);

    await this.page.keyboard.press('Enter');
  }
}
