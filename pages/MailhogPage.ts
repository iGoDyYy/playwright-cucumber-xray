import { Page, expect } from '@playwright/test';

export class MailhogPage {

  constructor(private page: Page) {}

  async acessarMailhog() {

    const url =
      process.env.MAILHOG_URL || 'https://mailhog.apponte.me/';
  
    await this.page.goto(url);
  
    await this.page.waitForLoadState('domcontentloaded');
  
    console.log(
      'MAILHOG URL ATUAL:',
      await this.page.url()
    );
  
    await this.page.screenshot({
      path: 'reports/screenshots/mailhog-home.png',
      fullPage: true
    });
  }

  async pesquisarEmail(email: string) {

    const campoBusca = this.page.locator('input').first();

    console.log(
      'TOTAL INPUTS:',
      await this.page.locator('input').count()
    );
  
    await campoBusca.waitFor({
      state: 'visible',
      timeout: 60000
    });
  
    for (let tentativa = 1; tentativa <= 12; tentativa++) {
  
      await campoBusca.clear();
  
      await campoBusca.fill(email);
  
      await campoBusca.press('Enter');
  
      await this.page.waitForTimeout(5000);
  
      const emailEncontrado = await this.page
        .locator(':visible')
        .filter({
          hasText: new RegExp(email, 'i')
        })
        .filter({
          hasText: /verificar e-mail/i
        })
        .first()
        .isVisible()
        .catch(() => false);
  
      if (emailEncontrado) {
        await this.page.screenshot({
          path: 'reports/screenshots/mailhog-email-encontrado.png',
          fullPage: true
        });
  
        return;
      }
  
      console.log(
        `E-mail ainda não encontrado no Mailhog. Tentativa ${tentativa}/12: ${email}`
      );
  
      await this.page.reload({
        waitUntil: 'domcontentloaded'
      });
  
      await this.page.waitForTimeout(3000);
    }
  
    await this.page.screenshot({
      path: 'reports/screenshots/mailhog-email-nao-encontrado.png',
      fullPage: true
    });
  
    throw new Error(
      `E-mail de validação não encontrado no Mailhog: ${email}`
    );
  }

  async abrirEmailValidacao(email: string) {

    await this.page.waitForTimeout(3000);
  
    const emailCard = this.page
      .locator('a[href^="/view/"]')
      .filter({
        hasText: new RegExp(email, 'i')
      })
      .first();
  
    await emailCard.waitFor({
      state: 'visible',
      timeout: 60000
    });
  
    const href = await emailCard.getAttribute('href');
  
    if (!href) {
      throw new Error(
        `E-mail encontrado, mas não foi possível obter o link da mensagem: ${email}`
      );
    }
  
    await this.page.goto(
      `${process.env.MAILHOG_URL}${href}`
    );
  
    await this.page.waitForLoadState(
      'domcontentloaded'
    );
  
    await this.page.waitForTimeout(3000);
  
    console.log(
      'URL APÓS ABRIR E-MAIL:',
      await this.page.url()
    );
  
    await this.page.screenshot({
      path: 'reports/screenshots/mailhog-apos-abrir-email.png',
      fullPage: true
    });
  }

  async clicarValidarEmail(email: string) {

    await this.page.waitForTimeout(2000);
  
    const bodyText =
      await this.page.locator('body').innerText();
  
    const bodyHtml =
      await this.page.locator('body').innerHTML();
  
    const conteudo =
      `${bodyText}\n${bodyHtml}`;
  
      const match = conteudo.match(
        /https?:\/\/(?:staging\.)?apponte\.me\/(?:painel\/)?verify\/(?:payment_group|user)\/[^\s"'<>]+/i
      );
  
    if (!match) {
      await this.page.screenshot({
        path: 'reports/screenshots/mailpit-sem-url-validacao.png',
        fullPage: true
      });
  
      throw new Error(
        'Não foi possível localizar a URL de validação no conteúdo do e-mail.'
      );
    }
  
    const urlValidacao = match[0]
      .replace(/&amp;/g, '&');
  
    console.log(
      'URL DE VALIDAÇÃO ENCONTRADA:',
      urlValidacao
    );
  
    await this.page.goto(urlValidacao);
  
    await this.page.waitForLoadState(
      'domcontentloaded'
    );
  
    await this.page.waitForTimeout(3000);
  
    console.log(
      'URL APÓS VALIDAR E-MAIL:',
      await this.page.url()
    );
  }

  async validarRedirecionamentoFinal() {

    const urlAtual = await this.page.url();
  
    if (/Token%20Inv|Token Inv/i.test(urlAtual)) {
      throw new Error(
        'BUG STAGING: o link de validação do e-mail foi clicado corretamente, ' +
        'mas o sistema retornou "Token Inválido ou expirado". URL: ' + urlAtual
      );
    }
  
    await expect(this.page).toHaveURL(
      /email_validated=true|staging\.apponte\.me/i,
      {
        timeout: 60000
      }
    );
  
    await this.page.screenshot({
      path: 'reports/screenshots/email-validado-redirecionamento-final.png',
      fullPage: true
    });
  }

  async realizarLoginComUsuarioValidado(
    email: string,
    senha: string
  ) {

    const campos = this.page.locator('input');

    await expect(
      campos.nth(0)
    ).toBeVisible({
      timeout: 60000
    });

    await campos.nth(0).fill(email);

    await campos.nth(1).fill(senha);

    const modalConfirmado = this.page
  .locator('#confirmedEmail')
  .filter({
    hasText: /seu e-mail foi confirmado/i
  });

const modalVisivel = await modalConfirmado
  .isVisible()
  .catch(() => false);

if (modalVisivel) {
  await this.page
    .getByRole('button', {
      name: /^ok$/i
    })
    .click();

  await this.page.waitForTimeout(1000);
}

    await this.page.getByRole('button', {
      name: /entrar/i
    }).click();

    await expect(this.page).not.toHaveURL(
      /login/i,
      {
        timeout: 60000
      }
    );

    await this.page.screenshot({
      path: 'reports/screenshots/login-staging-apos-email-validado.png',
      fullPage: true
    });
  }
}
