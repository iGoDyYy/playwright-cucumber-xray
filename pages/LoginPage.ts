import { Page, expect } from '@playwright/test';

import { BasePage } from './BasePage';

export class LoginPage extends BasePage {

  constructor(page: Page) {

    super(page);
  }

  async acessarPainel() {

    await this.page.waitForLoadState(
      'domcontentloaded'
    );

    const botaoPainel = this.page.getByRole(
      'link',
      { name: /painel/i }
    );

    await this.clicar(botaoPainel);

    await this.page.waitForLoadState(
      'networkidle'
    );

    await this.screenshot(
      'pagina-login'
    );
  }

  async informarCredenciaisValidas() {

    const email = process.env.EMAIL_LOGIN;
    const senha = process.env.PASSWORD_LOGIN;

    if (!email || !senha) {

      throw new Error(
        'EMAIL_LOGIN ou PASSWORD_LOGIN não definidos'
      );
    }

    const emailInput = this.page
      .locator('input')
      .first();

    await this.preencher(
      emailInput,
      email
    );

    const senhaInput = this.page
      .locator('input[type="password"]')
      .first();

    await this.preencher(
      senhaInput,
      senha
    );

    await this.screenshot(
      'login-preenchido'
    );
  }

  async confirmarLogin() {

    const botaoEntrar = this.page
      .getByRole(
        'button',
        { name: /entrar/i }
      );

    await this.clicar(
      botaoEntrar
    );

    await this.page.waitForLoadState(
      'networkidle'
    );
  }

  async validarPainelLogado() {

    await expect(this.page).toHaveURL(
      /painel|dashboard|home/,
      {
        timeout: 60000
      }
    );

    await this.screenshot(
      'login-sucesso'
    );
  }
}
