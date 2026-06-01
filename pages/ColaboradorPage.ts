import { Locator, Page, expect } from '@playwright/test';

import { BasePage } from './BasePage';

import { Colaborador } from '../utils/factories/ColaboradorFactory';

export class ColaboradorPage extends BasePage {

  constructor(page: Page) {

    super(page);
  }

  private campo(
    seletor: string
  ): Locator {

    return this.page.locator(seletor);
  }

  private async preencherSeVisivel(
    locator: Locator,
    texto: string,
    opcoes?: {
      pausaMs?: number;
      digitarDevagar?: boolean;
    }
  ) {

    const visivel =
      await locator.isVisible({ timeout: 3000 })
        .catch(() => false);

    if (!visivel) {
      return;
    }

    await this.preencherCampo(
      locator,
      texto,
      opcoes
    );
  }

  private extrairCompanyId(): string {

    const match = this.page.url().match(
      /companies\/(\d+)/
    );

    if (!match) {

      throw new Error(
        'Não foi possível identificar o ID da empresa na URL do painel.'
      );
    }

    return match[1];
  }

  async garantirAbaColaboradores() {

    await this.page.waitForURL(
      /employees/,
      { timeout: 60000 }
    );

    if (!/\/employees\/?$/.test(this.page.url())) {

      await this.page
        .getByRole('link', { name: /^colaboradores$/i })
        .first()
        .click();

      await this.page.waitForURL(
        /\/employees\/?$/,
        { timeout: 60000 }
      );
    }

    await this.page.waitForTimeout(1000);

    await this.screenshot(
      'aba-colaboradores'
    );
  }

  async abrirFormularioNovoColaborador() {

    await this.garantirAbaColaboradores();

    const companyId =
      this.extrairCompanyId();

    await this.navegar(
      `https://www.apponte.me/painel/companies/${companyId}/employees/create`
    );

    await expect(
      this.campo('input[name="employee-name"]')
    ).toBeVisible({
      timeout: 60000
    });

    await this.page.waitForTimeout(
      this.pausaFormularioMs * 2
    );

    await this.screenshot(
      'formulario-novo-colaborador'
    );
  }

  async preencherColaborador(
    colaborador: Colaborador,
    opcoes: {
      autorizarAppColaborador?: boolean;
    } = {}
  ) {

    const {
      autorizarAppColaborador = true
    } = opcoes;

    await this.page.waitForLoadState(
      'domcontentloaded'
    );

    await this.preencherCampo(
      this.campo('input[name="employee-name"]'),
      colaborador.nome
    );

    await this.preencherSeVisivel(
      this.campo('input[name="employee-rg"]'),
      colaborador.rg
    );

    await this.preencherCampo(
      this.campo('input[name="employee-cpf"]'),
      colaborador.cpf,
      { digitarDevagar: true }
    );

    await this.preencherSeVisivel(
      this.campo('input[name="employee-pis"]'),
      colaborador.pis
    );

    await this.preencherSeVisivel(
      this.campo('input[name="employee-profession"]'),
      colaborador.cargo
    );

    await this.preencherCampo(
      this.campo('input[name="admission_at"]'),
      colaborador.dataAdmissao
    );

    await this.selecionarPrimeiraOpcao(
      this.campo('select[name="employee-department"]'),
      this.pausaFormularioMs + 200
    );

    const turno = this.campo(
      'select[name="employeeShift"]'
    );

    if (
      await turno.isVisible({ timeout: 5000 })
        .catch(() => false)
    ) {

      await this.selecionarPrimeiraOpcao(
        turno,
        this.pausaFormularioMs + 200
      );
    }

    await this.preencherCampo(
      this.campo('input[name="employee-enrollment"]'),
      colaborador.matricula,
      { digitarDevagar: true }
    );

    await this.preencherCampo(
      this.campo('input[name="employee-pin"]'),
      colaborador.pin,
      { digitarDevagar: true }
    );

    await this.preencherSeVisivel(
      this.campo('input[name="employee-phone"]'),
      colaborador.celular,
      { digitarDevagar: true }
    );

    if (autorizarAppColaborador) {

      const checkboxApp = this.campo(
        'input[name="mobile_authorized"]'
      );

      await checkboxApp.scrollIntoViewIfNeeded();

      await checkboxApp.check();

      await this.page.waitForTimeout(
        this.pausaFormularioMs * 2
      );

      await expect(
        this.campo('input[name="employee-email"]')
      ).toBeVisible({
        timeout: 15000
      });

      await this.preencherCampo(
        this.campo('input[name="employee-email"]'),
        colaborador.email
      );

      const camposSenha = this.page.locator(
        'input[type="password"]:visible'
      );

      await expect(camposSenha.first()).toBeVisible({
        timeout: 15000
      });

      await this.preencherCampo(
        camposSenha.first(),
        colaborador.senha
      );

      if (await camposSenha.count() > 1) {

        await this.preencherCampo(
          camposSenha.nth(1),
          colaborador.confirmarSenha
        );
      }

      const comprovanteEmail = this.campo(
        'input[name="is_email_notification_authorized"]'
      );

      if (
        await comprovanteEmail.isVisible({ timeout: 3000 })
          .catch(() => false)
      ) {

        await comprovanteEmail.scrollIntoViewIfNeeded();
        await comprovanteEmail.check();
        await this.page.waitForTimeout(
          this.pausaFormularioMs
        );
      }
    }

    await this.page.waitForTimeout(
      this.pausaFormularioMs
    );

    await this.screenshot(
      'colaborador-preenchido'
    );
  }

  private botaoCadastrarFinal() {

    return this.page
      .getByRole('button', { name: /cadastrar/i })
      .last();
  }

  async salvarColaborador() {

    await expect(
      this.campo('input[name="employee-name"]')
    ).toHaveValue(/.+/, {
      timeout: 15000
    });

    const botaoCadastrar =
      this.botaoCadastrarFinal();

    await botaoCadastrar.scrollIntoViewIfNeeded();

    await expect(botaoCadastrar).toBeVisible({
      timeout: 30000
    });

    await expect(botaoCadastrar).toBeEnabled({
      timeout: 30000
    });

    await this.page.waitForTimeout(
      this.pausaFormularioMs
    );

    await botaoCadastrar.click();

    await this.page.waitForURL(
      /\/employees(?!\/create)/,
      { timeout: 90000 }
    ).catch(async () => {

      await expect(
        this.page.getByText(
          /cadastrado|salvo|sucesso|criado com sucesso/i
        )
      ).toBeVisible({
        timeout: 30000
      });
    });

    await this.page.waitForLoadState(
      'domcontentloaded'
    );

    await this.screenshot(
      'colaborador-salvo'
    );
  }

  async validarColaboradorCadastrado(
    colaborador: Colaborador
  ) {

    if (this.page.url().includes('/employees/create')) {

      const errosValidacao = this.page.locator(
        '.alert-danger, .text-danger, .invalid-feedback'
      ).filter({ hasText: /.+/ });

      const textoErros =
        (await errosValidacao.allTextContents())
          .map((t) => t.trim())
          .filter(Boolean)
          .join(' | ');

      throw new Error(
        textoErros
          ? `Cadastro não concluído: ${textoErros}`
          : 'Cadastro não concluído. Verifique CPF, matrícula ou e-mail duplicados.'
      );
    }

    await expect(this.page).toHaveURL(
      /\/employees\/\d+/,
      { timeout: 60000 }
    );

    await expect(
      this.page.getByText(colaborador.nome).first()
    ).toBeVisible({
      timeout: 60000
    });

    await this.screenshot(
      'colaborador-cadastrado-sucesso'
    );
  }

  async validarFormularioProntoParaSalvar() {

    await expect(
      this.campo('input[name="employee-name"]')
    ).toHaveValue(/.+/);

    await expect(
      this.botaoCadastrarFinal()
    ).toBeVisible();

    await this.screenshot(
      'colaborador-pronto-salvar'
    );
  }
}
