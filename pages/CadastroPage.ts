import { Page, expect } from '@playwright/test';

import { BasePage } from './BasePage';

import { MailinatorClient } from '../utils/mailinator/MailinatorClient';

export class CadastroPage extends BasePage {

  constructor(page: Page) {

    super(page);
  }

  async acessarPaginaCadastro() {

    await this.page.goto(
      'https://cadastro.apponte.me/'
    );

    await this.page.waitForLoadState(
      'domcontentloaded'
    );

    await this.page.waitForTimeout(5000);

    const botaoCadastrar = this.page.getByRole(
      'button',
      {
        name: /cadastrar/i
      }
    );

    await botaoCadastrar.waitFor({
      state: 'visible',
      timeout: 60000
    });

    console.log(
      'BOTÃO CADASTRAR ENCONTRADO'
    );

    await botaoCadastrar.click();

    await this.page.waitForTimeout(3000);

    await this.screenshot(
      'pagina-cadastro'
    );

    console.log(
      'URL ATUAL:',
      await this.page.url()
    );
  }

  async preencherFormulario(usuario: any) {

    await this.page.waitForTimeout(3000);

    await this.page.locator('input[name="name"]').fill(
      usuario.nome
    );

    await this.page.locator('input[name="email"]').fill(
      usuario.email
    );

    await this.page.locator('input[name="cpfResponsible"]').fill(
      usuario.cpf
    );

    await this.page.locator('input[name="password"]').fill(
      usuario.senha
    );

    await this.page.locator('input[name="passwordConfirmation"]').fill(
      usuario.confirmarSenha
    );

    await this.page.locator('input[name="cellphone"]').fill(
      usuario.celular
    );

    await this.page.locator('input[name="phone"]').fill(
      usuario.telefone
    );

    await this.screenshot(
      'cadastro-preenchido'
    );
  }

  async confirmarCadastro() {

    const botaoProximo = this.page.getByRole(
      'button',
      {
        name: /próximo|proximo/i
      }
    );

    await botaoProximo.waitFor({
      state: 'visible',
      timeout: 60000
    });

    await botaoProximo.click();

    await this.page.waitForTimeout(5000);

    console.log(
      'URL APÓS PRÓXIMO:',
      await this.page.url()
    );

    await this.screenshot(
      'apos-clique-proximo'
    );
  }

  async preencherEndereco(usuario: any) {

    await this.page.waitForTimeout(3000);

    const cepInput = this.page.locator(
      'input[name="zipCode"]'
    );

    await cepInput.waitFor({
      state: 'visible',
      timeout: 30000
    });

    await cepInput.fill(usuario.cep);
    await cepInput.press('Tab');

    const ruaInput = this.page.locator(
      'input[name="street"]'
    );

    await expect(ruaInput).not.toHaveValue('', {
      timeout: 20000
    });

    await this.page.locator('input[name="number"]').fill(
      usuario.numero
    );

    const complementoInput = this.page.locator(
      'input[name="complement"]'
    );

    await complementoInput.clear();
    await complementoInput.fill(
      usuario.complemento
    );

    await this.screenshot(
      'endereco-preenchido'
    );
  }

  async confirmarEndereco() {

    const botaoProximo =
      this.page.getByRole(
        'button',
        {
          name: /próximo|proximo/i
        }
      );
  
    await botaoProximo.click();
  
    await this.page.waitForTimeout(5000);
  
    console.log(
      'URL DOCUMENTOS:',
      await this.page.url()
    );
  
    const inputs =
      this.page.locator('input');
  
    const total =
      await inputs.count();
  
    console.log(
      'TOTAL INPUTS:',
      total
    );
  
    for (let i = 0; i < total; i++) {
  
      console.log(
        `INPUT ${i}:`,
        await inputs.nth(i).evaluate(
          (el: any) => ({
            name: el.name,
            id: el.id,
            placeholder: el.placeholder,
            type: el.type
          })
        )
      );
    }
  
    const labels =
      this.page.locator('label');
  
    const totalLabels =
      await labels.count();
  
    for (let i = 0; i < totalLabels; i++) {
  
      console.log(
        `LABEL ${i}:`,
        await labels.nth(i).textContent()
      );
    }
  
    await this.screenshot(
      'debug-documentos'
    );
  }

  async preencherDocumentos(
    usuario: any
  ) {

    await this.page.waitForURL(
      /#documents/,
      { timeout: 30000 }
    );

    await this.page.locator(
      'input[name="cnpj"]'
    ).fill(usuario.cnpj);

    await this.page.locator(
      'input[name="corporateName"]'
    ).fill(usuario.razaoSocial);

    await this.page.locator(
      'input[name="fantasyName"]'
    ).fill(usuario.nomeFantasia);

    await this.page.locator(
      'input[name="stateRegistration"]'
    ).fill(usuario.inscricaoEstadual);

    await this.page.locator(
      'input[name="municipalRegistration"]'
    ).fill(usuario.inscricaoMunicipal);

    await this.page.locator(
      'select[name="averageContributors"]'
    ).selectOption('1 a 10', {
      force: true
    });

    await this.screenshot(
      'documentos-preenchidos'
    );
  }

  async confirmarDocumentos() {

    const botaoProximo = this.page.getByRole(
      'button',
      {
        name: /próximo|proximo/i
      }
    );

    await botaoProximo.waitFor({
      state: 'visible',
      timeout: 60000
    });

    await botaoProximo.click();

    await this.page.waitForTimeout(5000);

    console.log(
      'URL TERMOS:',
      await this.page.url()
    );

    await this.screenshot(
      'pagina-termos'
    );
  }

  private async aceitarTermo(
    textoLabel: RegExp
  ) {

    await this.page
      .locator('label')
      .filter({ hasText: textoLabel })
      .first()
      .click();

    const botaoOk = this.page
      .locator('button')
      .filter({ hasText: /^ok$/i })
      .last();

    await botaoOk.waitFor({
      state: 'visible',
      timeout: 15000
    });

    await botaoOk.click();

    await expect(
      this.page
        .locator('label')
        .filter({ hasText: textoLabel })
        .first()
    ).not.toContainText(
      /é necessário aceitar/i,
      { timeout: 10000 }
    );
  }

  async preencherTermos() {

    await this.page.waitForURL(
      /#terms/,
      { timeout: 30000 }
    );

    const comoNosConheceu = this.page.locator(
      'input[type="text"]'
    ).last();

    await comoNosConheceu.fill('Google');
    await comoNosConheceu.press('Tab');

    await this.aceitarTermo(
      /termos contratuais/i
    );

    await this.aceitarTermo(
      /acordo de processamento de dados/i
    );

    await this.screenshot(
      'termos-preenchidos'
    );
  }

  async confirmarTermos() {

    const botaoFinalizar = this.page.getByRole(
      'button',
      { name: /concluir/i }
    );

    await expect(botaoFinalizar).toBeEnabled({
      timeout: 15000
    });

    await botaoFinalizar.click();

    await this.aguardarMensagemCadastroEnviado();

    await this.screenshot(
      'cadastro-finalizado'
    );
  }

  private async aguardarMensagemCadastroEnviado() {

    await expect(
      this.page.getByText(
        /verifique|confirmação|confirmacao|e-mail|email|cadastrado|sucesso|obrigado/i
      )
    ).toBeVisible({
      timeout: 60000
    });
  }

  async validarCadastroProntoParaConclusao() {

    await this.page.waitForURL(
      /#terms/,
      { timeout: 30000 }
    );

    await expect(
      this.page.getByRole(
        'button',
        { name: /concluir/i }
      )
    ).toBeVisible();

    await expect(
      this.page
        .locator('label')
        .filter({ hasText: /termos contratuais/i })
        .first()
    ).not.toContainText(
      /é necessário aceitar/i
    );

    await this.screenshot(
      'cadastro-pronto-conclusao'
    );
  }

  async validarCadastroSucesso() {

    await this.aguardarMensagemCadastroEnviado();

    await this.screenshot(
      'cadastro-sucesso'
    );
  }

  async validarEmailMailinator(
    email: string
  ) {

    const inbox =
      MailinatorClient.extrairInbox(email);

    const padraoEmail = process.env.MAILINATOR_EMAIL_PATTERN
      ? new RegExp(
        process.env.MAILINATOR_EMAIL_PATTERN,
        'i'
      )
      : /apponte/i;

    const linkConfirmacao =
      await MailinatorClient.aguardarLinkConfirmacao(
        inbox,
        {
          assuntoOuRemetente: padraoEmail
        }
      );

    await this.page.goto(linkConfirmacao);

    await this.page.waitForLoadState(
      'domcontentloaded'
    );

    const mensagemSucesso = this.page.getByText(
      /confirmad|ativad|sucesso|obrigado|bem-vindo|welcome/i
    );

    const sucessoVisivel =
      await mensagemSucesso
        .isVisible()
        .catch(() => false);

    if (!sucessoVisivel) {

      await expect(this.page)
        .not.toHaveURL(/mailinator\.com/i, {
          timeout: 60000
        });
    }

    await this.screenshot(
      'email-validado'
    );
  }
}