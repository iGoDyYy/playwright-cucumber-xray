import { Page } from '@playwright/test';

export class LoginPage {

  constructor(private page: Page) {}

  async clicarPainel() {

    await this.page.waitForLoadState('networkidle');

    const botaoPainel = this.page
      .locator('a[href="https://apponte.me/painel"]')
      .first();

    await botaoPainel.waitFor({
      state: 'visible'
    });

    await botaoPainel.click();
  }

  async preencherLogin(email: string, senha: string) {

    await this.page
      .locator('input[type="email"]')
      .fill(email);

    await this.page
      .locator('input[type="password"]')
      .fill(senha);
  }

  async clicarEntrar() {

    await this.page
      .getByRole('button', { name: 'Entrar' })
      .click();
  }
}