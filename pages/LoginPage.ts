import { Page } from '@playwright/test';

export class LoginPage {

  constructor(private page: Page) {}

  async clicarPainel() {

    await this.page.waitForLoadState('networkidle');

    const linksPainel = this.page.locator('a[href="https://apponte.me/painel"]');

    const total = await linksPainel.count();

    for (let i = 0; i < total; i++) {

      const elemento = linksPainel.nth(i);

      if (await elemento.isVisible()) {

        await elemento.click();

        break;
      }
    }
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