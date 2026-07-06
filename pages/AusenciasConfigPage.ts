import { Page, expect } from '@playwright/test';

import { BasePage } from './BasePage';

import { environment } from '../utils/environment';

import { testData } from '../utils/testData';

export class AusenciasConfigPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  private extrairCompanyId(): string {

    const match = this.page.url().match(
      /companies\/(\d+)/
    );

    if (!match) {
      throw new Error(
        'Não foi possível identificar o ID da empresa.'
      );
    }

    return match[1];
  }

  async acessarTelaAusencias() {

    const companyId =
      this.extrairCompanyId();

    await this.navegar(
      `${environment.baseUrl}/painel/companies/${companyId}/nonattendance`
    );

    await expect(
      this.page.getByRole('heading', { name: /ausências/i })
    ).toBeVisible({
      timeout: 60000
    });

    await this.screenshot(
      'config-ausencias'
    );
  }

  async acessarNovaJustificativa() {

    const companyId =
      this.extrairCompanyId();
  
    await this.navegar(
      `${environment.baseUrl}/painel/companies/${companyId}/nonattendance/create`
    );
  
    await this.page.waitForLoadState(
      'domcontentloaded'
    );
  
    console.log(
      'URL NOVA JUSTIFICATIVA:',
      this.page.url()
    );
  
    await this.screenshot(
      'debug-nova-justificativa'
    );
  }

  async criarJustificativaAutomatica() {

    const nomeJustificativa =
      `Justificativa_${Date.now()}`;

    testData.justificativaAusencia =
      nomeJustificativa;

      const campoNome =
      this.page.locator('input:visible').first();

    await this.preencherCampo(
      campoNome,
      nomeJustificativa
    );

    await this.page
      .getByRole('button', { name: /cadastrar/i })
      .click();

    await this.screenshot(
      'justificativa-cadastrada'
    );
  }

  async validarJustificativaCriada() {

    await expect(
      this.page.getByText(/justificativas criada/i)
    ).toBeVisible({
      timeout: 60000
    });

    await expect(
      this.page
        .getByRole('cell', {
          name: testData.justificativaAusencia
        })
        .first()
    ).toBeVisible({
      timeout: 60000
    });
  }
}