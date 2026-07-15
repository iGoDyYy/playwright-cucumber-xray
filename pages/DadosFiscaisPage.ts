import { Page, expect } from '@playwright/test';

import { BasePage } from './BasePage';

import { environment } from '../utils/environment';

import { emailFactory } from '../utils/emailFactory';

import { testData } from '../utils/testData';

import { UserFactory } from '../utils/factories/UserFactory';

export class DadosFiscaisPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  private extrairCompanyId(): string {

    const match = this.page.url().match(
      /(?:companies|holding)\/(\d+)/
    );

    if (!match) {
      throw new Error(
        `Não foi possível identificar o ID da empresa. URL atual: ${this.page.url()}`
      );
    }

    return match[1];
  }
  async acessarCadastroPelaMensagemColaboradores() {

    const companyId =
      this.extrairCompanyId();

    await this.navegar(
      `${environment.baseUrl}/painel/companies/${companyId}/employees`
    );

    await expect(
      this.page.getByText(/sem responsável fiscal/i)
    ).toBeVisible({
      timeout: 60000
    });

    await this.page
      .getByText(/clique aqui para cadastrar/i)
      .click();

    await expect(
      this.page.getByRole('heading', {
        name: /responsável fiscal/i
      })
    ).toBeVisible({
      timeout: 60000
    });

    await this.screenshot(
      'cadastro-responsavel-fiscal-pela-mensagem'
    );
  }

  async preencherResponsavelFiscal() {

    const usuario =
      UserFactory.criarUsuario();

    const nome =
      usuario.nome;

    const email =
      emailFactory.gerarEmailResponsavelFiscal();

    const cnpj =
      usuario.cnpj;

    testData.responsavelFiscalNome =
      nome;

    testData.responsavelFiscalEmail =
      email;

    testData.responsavelFiscalCnpj =
      cnpj;

    const inputs =
      this.page.locator('input:visible');

    await this.preencherCampo(inputs.nth(0), nome);
    await this.preencherCampo(inputs.nth(1), email);
    await this.preencherCampo(inputs.nth(2), cnpj);
    await this.preencherCampo(inputs.nth(3), 'Rua Teste Automatizado');
    await this.preencherCampo(inputs.nth(4), 'Centro');
    await this.preencherCampo(inputs.nth(5), '123');
    await this.preencherCampo(inputs.nth(6), '01310100');
    await this.preencherCampo(inputs.nth(7), 'Complemento Teste');

    const selects =
      this.page.locator('select:visible');

    await selects.nth(1).selectOption({
      index: 1
    });

    await this.page.waitForTimeout(1500);

    await selects.nth(2).selectOption({
      index: 1
    });

    await this.preencherCampo(
      inputs.nth(8),
      '11999999999'
    );

    await this.screenshot(
      'responsavel-fiscal-preenchido'
    );
  }

  async salvarResponsavelFiscal() {

    const botaoCadastrar = this.page
      .getByRole('button', { name: /^cadastrar$/i });
  
    await botaoCadastrar.scrollIntoViewIfNeeded();
  
    await expect(botaoCadastrar).toBeVisible({
      timeout: 30000
    });
  
    await expect(botaoCadastrar).toBeEnabled({
      timeout: 30000
    });
  
    await this.screenshot(
      'responsavel-fiscal-antes-de-salvar'
    );
  
    await botaoCadastrar.click();
  
    await this.page.waitForTimeout(5000);
  
    await this.screenshot(
      'responsavel-fiscal-apos-salvar'
    );
  
    const companyId =
      this.extrairCompanyId();

      testData.companyId = companyId;
  
    await this.navegar(
      `${environment.baseUrl}/painel/holding/${companyId}/payment-group`
    );
  
    const selectResponsavel = this.page
      .locator('select[name="payment-group-id"], select:visible')
      .first();
  
    await expect(selectResponsavel).toBeVisible({
      timeout: 60000
    });
  
    await this.page.waitForTimeout(2000);
  
    const options = await selectResponsavel
      .locator('option')
      .all();
  
    for (const option of options) {
      const texto = await option.innerText();
      const value = await option.getAttribute('value');
  
      if (
        value &&
        testData.responsavelFiscalNome &&
        texto.toLowerCase().includes(
          testData.responsavelFiscalNome.toLowerCase()
        )
      ) {
        testData.responsavelFiscalId = value;
        break;
      }
    }
  
    if (!testData.responsavelFiscalId) {
      throw new Error(
        `Responsável fiscal criado, mas não foi encontrado no select pelo nome: ${testData.responsavelFiscalNome}`
      );
    }
  
    console.log(
      'ID RESPONSÁVEL FISCAL:',
      testData.responsavelFiscalId
    );
  }

  async acessarValidacaoEmailPelaMensagemColaboradores() {

    const companyId =
      this.extrairCompanyId();
  
    await this.navegar(
      `${environment.baseUrl}/painel/companies/${companyId}/employees`
    );
  
    await this.page.waitForTimeout(3000);
  
    const linkValidarEmail = this.page
      .getByText(/valide o e-?mail de faturamento/i)
      .first();
  
    const existeLink = await linkValidarEmail
      .isVisible()
      .catch(() => false);
  
    if (existeLink) {
      await linkValidarEmail.click();
    } else {
      if (!testData.responsavelFiscalId) {
        throw new Error(
          'Mensagem de validação não encontrada e ID do responsável fiscal não foi salvo.'
        );
      }
  
      await this.navegar(
        `${environment.baseUrl}/painel/holding/${companyId}/payment-group/${testData.responsavelFiscalId}`
      );
    }
  
    await expect(
      this.page.getByRole('button', {
        name: /validar e-mail|validar email/i
      })
    ).toBeVisible({
      timeout: 60000
    });
  
    await this.screenshot(
      'validacao-email-pela-mensagem-colaboradores'
    );
  }

  async acessarValidacaoEmailPeloMenuDadosFiscais() {

    const companyId =
      this.extrairCompanyId();

      if (testData.responsavelFiscalId) {
        await this.navegar(
          `${environment.baseUrl}/painel/holding/${companyId}/payment-group/${testData.responsavelFiscalId}`
        );
      
        await expect(
          this.page.getByRole('button', {
            name: /^validar e-mail$/i
          })
        ).toBeVisible({
          timeout: 60000
        });
      
        await this.screenshot(
          'validacao-email-pelo-menu-dados-fiscais'
        );
      
        return;
      }

    await this.navegar(
      `${environment.baseUrl}/painel/holding/${companyId}/payment-group`
    );

    await expect(
      this.page.getByRole('heading', {
        name: /dados fiscais/i
      })
    ).toBeVisible({
      timeout: 60000
    });

    if (testData.responsavelFiscalId) {
        await this.navegar(
          `${environment.baseUrl}/painel/holding/${companyId}/payment-group/${testData.responsavelFiscalId}`
        );
      
        await expect(
          this.page.getByRole('button', {
            name: /^validar e-mail$/i
          })
        ).toBeVisible({
          timeout: 60000
        });
      
        await this.screenshot(
          'validacao-email-pelo-menu-dados-fiscais'
        );
      
        return;
      }

    const selectResponsavel = this.page
      .locator('select:visible')
      .first();

      const options = await selectResponsavel
      .locator('option')
      .all();
    
    for (const option of options) {
      const texto = await option.innerText();
    
      if (
        testData.responsavelFiscalEmail &&
        texto.toLowerCase().includes(
          testData.responsavelFiscalEmail.toLowerCase()
        )
      ) {
        const value = await option.getAttribute('value');
    
        if (value) {
          testData.responsavelFiscalId = value;
          break;
        }
      }
    }
    
    if (testData.responsavelFiscalId) {
      await this.navegar(
        `${environment.baseUrl}/painel/holding/${companyId}/payment-group/${testData.responsavelFiscalId}`
      );
    
      await expect(
        this.page.getByRole('button', {
          name: /^validar e-mail$/i
        })
      ).toBeVisible({
        timeout: 60000
      });
    
      await this.screenshot(
        'validacao-email-pelo-menu-dados-fiscais'
      );
    
      return;
    }
    
    await selectResponsavel.selectOption({
      index: 1
    });

    await this.page.waitForTimeout(1500);

    const valorResponsavel =
      await selectResponsavel.inputValue();

    if (!valorResponsavel) {
      throw new Error(
        'Não foi possível obter o ID do responsável fiscal selecionado.'
      );
    }

    await this.navegar(
      `${environment.baseUrl}/painel/holding/${companyId}/payment-group/${valorResponsavel}`
    );

    await expect(
      this.page.getByRole('heading', {
        name: /responsável fiscal/i
      })
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      this.page.getByRole('button', {
        name: /^validar e-mail$/i
      })
    ).toBeVisible({
      timeout: 60000
    });

    await this.screenshot(
      'validacao-email-pelo-menu-dados-fiscais'
    );

    console.log('⏳ Aguardando 2 minutos antes de solicitar o envio do e-mail...');
await this.page.waitForTimeout(120000);

  }

  async clicarValidarEmail() {

    const botaoValidarEmail = this.page.getByRole(
      'button',
      {
        name: /^validar e-mail$/i
      }
    );
  
    await expect(botaoValidarEmail).toBeVisible({
      timeout: 60000
    });
  
    await expect(botaoValidarEmail).toBeEnabled({
      timeout: 60000
    });
  
    await botaoValidarEmail.click();
  }

  async validarPopupEmailEnviado() {

  await this.page.waitForTimeout(2000);

  await expect(
    this.page
      .locator(':visible')
      .filter({
        hasText: /e-mail enviado com sucesso|email enviado com sucesso/i
      })
      .first()
  ).toBeVisible({
    timeout: 60000
  });

  await this.screenshot(
    'popup-email-enviado-sucesso'
  );
}

  async validarConteudoPopupEmail() {

    await this.page.waitForTimeout(2000);
  
    const popupVisivel = this.page
      .locator(':visible')
      .filter({
        hasText: /e-mail enviado com sucesso|email enviado com sucesso/i
      })
      .first();
  
    await expect(popupVisivel).toBeVisible({
      timeout: 60000
    });
  
    await expect(
      this.page.locator(':visible')
        .filter({
          hasText: /um e-mail de validação foi enviado para o endereço informado/i
        })
        .first()
    ).toBeVisible({
      timeout: 60000
    });
  
    await expect(
      this.page.locator(':visible')
        .filter({
          hasText: /clique no botão/i
        })
        .first()
    ).toBeVisible({
      timeout: 60000
    });
  
    await expect(
      this.page.locator(':visible')
        .filter({
          hasText: /validar e-mail/i
        })
        .first()
    ).toBeVisible({
      timeout: 60000
    });
  
    await expect(
      this.page.locator(':visible')
        .filter({
          hasText: /concluir a validação do responsável fiscal/i
        })
        .first()
    ).toBeVisible({
      timeout: 60000
    });
  
    await this.screenshot(
      'conteudo-popup-email'
    );
  }

  async garantirAcessoCadastroOuValidacaoResponsavelFiscal() {

    const companyId =
      this.extrairCompanyId();
  
    await this.navegar(
      `${environment.baseUrl}/painel/companies/${companyId}/employees`
    );
  
    await this.page.waitForTimeout(
      2000
    );
  
    const linkValidarEmail = this.page
      .getByText(/valide o email de faturamento/i)
      .first();
  
    const existeResponsavelPendente =
      await linkValidarEmail
        .isVisible()
        .catch(() => false);
  
    if (existeResponsavelPendente) {
  
      await linkValidarEmail.click();
  
      await expect(
        this.page.getByRole('button', {
          name: /^validar e-mail$/i
        })
      ).toBeVisible({
        timeout: 60000
      });
  
      await this.screenshot(
        'responsavel-fiscal-ja-existente'
      );
  
      return 'existente';
    }
  
    const linkCadastrar = this.page
      .getByText(/clique aqui para cadastrar/i)
      .first();
  
    const semResponsavelFiscal =
      await linkCadastrar
        .isVisible()
        .catch(() => false);
  
    if (semResponsavelFiscal) {
  
      await linkCadastrar.click();
  
      await expect(
        this.page.getByRole('heading', {
          name: /responsável fiscal/i
        })
      ).toBeVisible({
        timeout: 60000
      });
  
      await this.screenshot(
        'responsavel-fiscal-cadastro-necessario'
      );
  
      return 'novo';
    }
  
    throw new Error(
      'Não foi possível identificar se existe responsável fiscal ou se é necessário cadastrar.'
    );
  }

  async acessarCriacaoResponsavelFiscalPeloMenu() {

    await this.page.getByText(/empresas/i).first().click();
    await this.page.waitForTimeout(1000);
  
    await this.page.getByText(/gerenciar empresas/i).first().click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000);
  
    await this.page.getByText(/dados fiscais/i).first().click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000);
  
    const linkCreate = this.page
      .locator('a[href*="payment-group/create"]')
      .first();
  
    const href = await linkCreate.getAttribute('href');
  
    if (!href) {
      throw new Error(
        'Não foi possível encontrar o link de criação de Dados Fiscais.'
      );
    }
  
    await this.navegar(
      `${environment.baseUrl}${href}`
    );
  
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(3000);
  
    console.log(
      'URL APÓS ABRIR CRIAÇÃO DE DADOS FISCAIS:',
      await this.page.url()
    );
  
    await expect(
      this.page.locator('input:visible').first()
    ).toBeVisible({
      timeout: 60000
    });
  
    await this.screenshot(
      'criacao-responsavel-fiscal-pelo-menu'
    );
  }

  async validarResponsavelFiscalValidado() {

    const companyId =
      this.extrairCompanyId();
  
    await this.navegar(
      `${environment.baseUrl}/painel/holding/${companyId}/payment-group/${testData.responsavelFiscalId}`
    );
  
    await expect(
      this.page.getByRole('button', {
        name: /^validar e-mail$/i
      })
    ).not.toBeVisible({
      timeout: 60000
    });
  
    await this.screenshot(
      'responsavel-fiscal-validado'
    );
  }

  async validarAusenciaMensagemResponsavelFiscal() {

    const companyId =
      this.extrairCompanyId();
  
    await this.navegar(
      `${environment.baseUrl}/painel/companies/${companyId}/employees`
    );
  
    await expect(
      this.page.getByText(
        /verifique o e-mail do responsável fiscal/i
      )
    ).not.toBeVisible();
  
    await this.screenshot(
      'responsavel-fiscal-sem-aviso'
    );
  }

  async reenviarEmailResponsavelFiscal() {

    console.log('⏳ Aguardando 2 minutos...');
    await this.page.waitForTimeout(120000);
  
    console.log('🔄 Voltando para o responsável fiscal...');
    await this.acessarResponsavelFiscalCriado();
  
    const botaoValidar = this.page.getByRole('button', {
      name: /^validar e-mail$/i
    });
  
    await botaoValidar.click();
  
    await this.validarPopupEmailEnviado();
  
    console.log('✅ Novo e-mail solicitado.');
  }

  async abrirResponsavelFiscalPeloId() {

    const companyId = testData.companyId;
    const responsavelFiscalId = testData.responsavelFiscalId;
  
    const url =
      `${process.env.BASE_URL}/painel/holding/${companyId}/payment-group/${responsavelFiscalId}`;
  
    console.log('🔄 Abrindo responsável fiscal:', url);
  
    await this.page.goto(url);
  
    await this.page.waitForLoadState('networkidle');
  }

  async acessarResponsavelFiscalCriado() {

    if (!testData.companyId) {
      throw new Error('CompanyId não encontrado.');
    }
  
    if (!testData.responsavelFiscalId) {
      throw new Error('Responsável Fiscal Id não encontrado.');
    }
  
    const url =
      `${environment.baseUrl}/painel/holding/${testData.companyId}/payment-group/${testData.responsavelFiscalId}`;
  
    console.log('Voltando para:', url);
  
    await this.navegar(url);
  
    await this.page.waitForLoadState('domcontentloaded');
  
    await expect(
      this.page.getByRole('button', {
        name: /^validar e-mail$/i
      })
    ).toBeVisible({
      timeout: 60000
    });
  
    await this.page.waitForTimeout(3000);
  }

}