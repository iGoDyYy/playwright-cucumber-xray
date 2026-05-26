import { Page } from '@playwright/test';

export class LoginPage {

  private page: Page;

  constructor(page: Page) {

    this.page = page;
  }

  async clicarPainel() {

    await this.page.waitForLoadState('domcontentloaded');

    // botão/menu painel
    const botaoPainel = this.page.getByRole(
      'link',
      { name: /painel/i }
    );

    await botaoPainel.waitFor({
      state: 'visible',
      timeout: 60000
    });

    console.log('CLICANDO NO BOTÃO PAINEL');

    await botaoPainel.click();

    // espera carregamento
    await this.page.waitForLoadState('networkidle');

    console.log(
      'URL APÓS CLIQUE:',
      await this.page.url()
    );

    // screenshot debug
    await this.page.screenshot({
      path: 'screenshots/pagina-login.png',
      fullPage: true
    });
  }

  async preencherLogin(email: string, senha: string) {

    const emailInput = this.page.locator(
      'input[type="email"]'
    );

    console.log('AGUARDANDO INPUT EMAIL');

    await emailInput.waitFor({
      state: 'visible',
      timeout: 60000
    });

    console.log('INPUT EMAIL ENCONTRADO');

    await emailInput.click();

    await emailInput.fill(email);

    const senhaInput = this.page.locator(
      'input[type="password"]'
    );

    await senhaInput.waitFor({
      state: 'visible',
      timeout: 60000
    });

    await senhaInput.click();

    await senhaInput.fill(senha);

    // screenshot debug
    await this.page.screenshot({
      path: 'screenshots/login-preenchido.png',
      fullPage: true
    });
  }

  async clicarEntrar() {

    const botaoEntrar = this.page.getByRole(
      'button',
      { name: /entrar/i }
    );

    await botaoEntrar.waitFor({
      state: 'visible',
      timeout: 60000
    });

    await botaoEntrar.click();

    await this.page.waitForLoadState('networkidle');
  }
}
