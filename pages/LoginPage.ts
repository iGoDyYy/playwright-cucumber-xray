import { Page } from '@playwright/test';

export class LoginPage {

  constructor(private page: Page) {}

  async clicarPainel() {

    await this.page.locator('#menu-main')
      .getByText('Painel')
      .click();
  }

  async preencherLogin(email: string, senha: string) {

    await this.page.locator('input[type="email"]')
      .fill(email);

    await this.page.locator('input[type="password"]')
      .fill(senha);
  }

  async clicarEntrar() {

    await this.page
      .getByRole('button', { name: 'Entrar' })
      .click();
  }
}