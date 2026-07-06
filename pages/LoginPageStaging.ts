import { Page, expect } from '@playwright/test';

export class LoginPageStaging {

  constructor(
    private page: Page
  ) {}

  async acessarLogin() {

    await this.page.goto(
      process.env.PANEL_URL_STAGING!
    );

    await this.page.waitForLoadState(
      'networkidle'
    );
  }

  async preencherCredenciais(
    email?: string,
    senha?: string
  ) {

    const emailInput =
  this.page.locator('input').first();

await emailInput.fill(
  email ||
  process.env.PANEL_EMAIL_STAGING!
);

    await this.page
      .locator('input[type="password"]')
      .fill(
        senha ||
        process.env.PANEL_PASSWORD_STAGING!
      );
  }

  async confirmarLogin() {

    await this.page
      .getByRole('button', {
        name: /entrar|login/i
      })
      .click();
  }

  async validarLogin() {

    await expect(this.page)
      .not.toHaveURL(
        /login/,
        {
          timeout: 30000
        }
      );
  }
}