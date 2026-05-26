import { Page } from '@playwright/test';

export class LoginPage {

  constructor(private page: Page) {}

  async acessarSite() {

    await this.page.goto(process.env.BASE_URL!);
  }

  async clicarPainel() {

    await this.page
      .getByRole('link', { name: 'Painel' })
      .first()
      .click();
  }

  async preencherLogin() {

    const inputs = this.page.locator('input');

    await inputs.nth(0)
      .fill(process.env.LOGIN_EMAIL!);

    await inputs.nth(1)
      .fill(process.env.LOGIN_PASSWORD!);
  }

  async clicarEntrar() {

    await this.page
      .getByRole('button', { name: /Entrar/i })
      .click();
  }
}