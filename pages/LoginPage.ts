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

    // espera carregamento da página
    await this.page.waitForLoadState('networkidle');

    console.log(
      'URL APÓS CLIQUE:',
      await this.page.url()
    );

    // screenshot da página login
    await this.page.screenshot({
      path: 'screenshots/pagina-login.png',
      fullPage: true
    });
  }

  async preencherLogin(email: string, senha: string) {

    console.log('AGUARDANDO INPUT EMAIL');

    // pega o primeiro input visível da página
    const emailInput = this.page
      .locator('input')
      .first();

    await emailInput.waitFor({
      state: 'visible',
      timeout: 60000
    });

    console.log('INPUT EMAIL ENCONTRADO');

    await emailInput.click();

    await emailInput.fill(email);

    console.log('PREENCHENDO SENHA');

    const senhaInput = this.page
      .locator('input[type="password"]')
      .first();

    await senhaInput.waitFor({
      state: 'visible',
      timeout: 60000
    });

    await senhaInput.click();

    await senhaInput.fill(senha);

    // screenshot preenchido
    await this.page.screenshot({
      path: 'screenshots/login-preenchido.png',
      fullPage: true
    });
  }

  async clicarEntrar() {

    console.log('CLICANDO EM ENTRAR');

    const botaoEntrar = this.page.getByRole(
      'button',
      { name: /entrar/i }
    );

    await botaoEntrar.waitFor({
      state: 'visible',
      timeout: 60000
    });

    await botaoEntrar.click();

    // espera login finalizar
    await this.page.waitForLoadState('networkidle');

    console.log(
      'URL FINAL:',
      await this.page.url()
    );

    // screenshot final
    await this.page.screenshot({
      path: 'screenshots/login-sucesso.png',
      fullPage: true
    });
  }
}