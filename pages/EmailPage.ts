import { Page, expect } from '@playwright/test';

import { BasePage } from './BasePage';

import { environment } from '../utils/environment';

import { MailhogPage } from './MailhogPage';

import { LoginPage } from './LoginPage';

import { DadosFiscaisPage } from './DadosFiscaisPage';

export class EmailPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  async abrirCaixaEmail() {

    if (environment.isStaging) {
      await this.abrirMailhog();
      return;
    }

    await this.abrirMailinator();
  }

  private async abrirMailhog() {

    const mailhogUrl =
      process.env.MAILHOG_URL;

    if (!mailhogUrl) {
      throw new Error(
        'MAILHOG_URL não definida no .env'
      );
    }

    await this.navegar(mailhogUrl);

    await this.screenshot(
      'mailhog-aberto'
    );
  }

  private async abrirMailinator() {

    throw new Error(
      'Mailinator ainda não configurado. Vamos implementar após validar Mailhog.'
    );
  }

  async validarEmailRecebido(email: string) {

    if (environment.isStaging) {
      await this.validarEmailRecebidoMailhog(email);
      return;
    }
  
    await this.validarEmailRecebidoMailinator(email);
  }
  
  private async validarEmailRecebidoMailhog(email: string) {
  
    await this.abrirMailhog();
  
    await this.page.waitForTimeout(3000);
  
    const campoBusca = this.page
      .locator('input')
      .first();
  
    await campoBusca.fill(email);
  
    await this.page.keyboard.press('Enter');
  
    await expect(
      this.page.getByText(email).first()
    ).toBeVisible({
      timeout: 60000
    });
  
    await this.screenshot(
      'email-responsavel-fiscal-recebido-mailhog'
    );
  }
  
  private async validarEmailRecebidoMailinator(email: string) {
  
    const inbox = email
      .split('@')[0];
  
    await this.navegar(
      `https://www.mailinator.com/v4/public/inboxes.jsp?to=${inbox}`
    );
  
    await expect(
      this.page.getByText(/apponte|validar|e-mail/i).first()
    ).toBeVisible({
      timeout: 90000
    });
  
    await this.screenshot(
      'email-responsavel-fiscal-recebido-mailinator'
    );
  }

  async validarEmailDoResponsavelFiscal(email: string) {

    if (environment.isStaging) {
      await this.validarEmailDoResponsavelFiscalMailhog(email);
      return;
    }
  
    throw new Error(
      'Validação via Mailinator ainda será implementada para produção.'
    );
  }
  
  private async validarEmailDoResponsavelFiscalMailhog(email: string) {

    const mailhogPage =
      new MailhogPage(this.page);
  
    const dadosFiscaisPage =
      new DadosFiscaisPage(this.page);
  
    const MAX_TENTATIVAS = 3;
  
    for (
      let tentativa = 1;
      tentativa <= MAX_TENTATIVAS;
      tentativa++
    ) {
  
      console.log(
        `📨 Tentativa ${tentativa} de localizar o e-mail...`
      );
  
      await mailhogPage.acessarMailhog();
  
      try {
  
        await mailhogPage.pesquisarEmail(email);
  
        await mailhogPage.abrirEmailValidacao(email);
  
        await mailhogPage.clicarValidarEmail(email);
  
        await mailhogPage.validarRedirecionamentoFinal();
  
        console.log(
          '✅ E-mail encontrado e validado.'
        );
  
        await this.screenshot(
          'responsavel-fiscal-email-validado-mailhog'
        );
  
        return;
  
      } catch (error) {
  
        console.log(
          `❌ E-mail não encontrado na tentativa ${tentativa}.`
        );
  
        if (tentativa === MAX_TENTATIVAS) {
          throw error;
        }
  
        console.log(
          '🔄 Voltando ao Apponte para reenviar o e-mail...'
        );
  
        await dadosFiscaisPage.reenviarEmailResponsavelFiscal();
      }
    }
  }

  async validarConfirmacaoEmailValidado() {

    await expect(this.page).toHaveURL(
      /email_validated=true/,
      {
        timeout: 60000
      }
    );

    await expect(
      this.page.locator('body')
    ).toContainText(
      /e-mail.*confirmado|email.*confirmado|entrar/i,
      {
        timeout: 60000
      }
    );

    await this.screenshot(
      'confirmacao-email-validado'
    );
  }

  async realizarLoginNovamente() {

    const loginPage = new LoginPage(this.page);

    await loginPage.acessarPainel();

    await loginPage.informarCredenciaisValidas();

    await loginPage.confirmarLogin();

    await loginPage.validarPainelLogado();
  }

}