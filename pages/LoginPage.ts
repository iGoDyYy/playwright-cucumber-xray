import { Page } from '@playwright/test';

export class LoginPage {

  private page: Page;

  constructor(page: Page) {

    this.page = page;
  }

  async clicarPainel() {

    await this.page.waitForLoadState('domcontentloaded');

    const linkPainel = this.page.locator(
      'a[href="https://apponte.me/painel"]'
    ).first();

    await linkPainel.waitFor({
      state: 'visible',
      timeout: 60000
    });

    console.log('URL ANTES DO CLIQUE:', await this.page.url());

    // captura nova aba
    const [novaPagina] = await Promise.all([

      this.page.context().waitForEvent('page'),

      linkPainel.click()
    ]);

    await novaPagina.waitForLoadState('networkidle');

    this.page = novaPagina;

    console.log('URL DEPOIS DO CLIQUE:', await this.page.url());

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