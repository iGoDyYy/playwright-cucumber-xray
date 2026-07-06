import { Page, expect } from '@playwright/test';

import { BasePage } from './BasePage';

import { environment } from '../utils/environment';

import path from 'path';

import { testData } from '../utils/testData';

export class RotinasPage extends BasePage {

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

  async abrirRotinas() {

    const companyId =
      this.extrairCompanyId();

    await this.navegar(
      `${environment.baseUrl}/painel/companies/${companyId}/event/mass-event`
    );

    await this.screenshot(
      'rotinas-aberta'
    );
  }

  async selecionarTipoMarcacao(tipo: string) {

    const botaoMarcacaoManual = this.page
      .getByRole('button', { name: /marcação manual|marcacao manual/i })
      .first();
  
    if (await botaoMarcacaoManual.isVisible({ timeout: 3000 }).catch(() => false)) {
      await this.clicar(botaoMarcacaoManual);
      await this.page.waitForTimeout(1000);
    }
  
    const campoTipo = this.page
      .locator('select')
      .filter({
        hasNotText: /10|25|50|100/
      })
      .last();

      const opcoes = await campoTipo.locator('option').allTextContents();
  
    await campoTipo.selectOption({
      label: tipo
    });
  
    await this.screenshot(
      `tipo-marcacao-${tipo}`
    );
  }

  async preencherHorario() {

    const campoHorario = this.page
      .getByPlaceholder('Horário da marcação');
  
    await this.preencherCampo(
      campoHorario,
      '08:00'
    );
  
    await this.screenshot(
      'horario-preenchido'
    );
  }

  async preencherMotivo() {

    const campoMotivo = this.page
      .getByPlaceholder('Motivo');
  
    await this.preencherCampo(
      campoMotivo,
      'Teste automatizado TCID 21'
    );
  
    await this.screenshot(
      'motivo-preenchido'
    );
  }

  async salvarSemColaborador() {

    const botaoSalvar = this.page
      .getByRole('button', { name: /^salvar$/i })
      .last();
  
    await botaoSalvar.scrollIntoViewIfNeeded();
  
    await expect(botaoSalvar).toBeVisible({
      timeout: 30000
    });
  
    await expect(botaoSalvar).toBeEnabled({
      timeout: 30000
    });
  
    await this.screenshot(
      'antes-de-salvar-marcacao-manual'
    );
  
    const dialogPromise = this.page
      .waitForEvent('dialog', {
        timeout: 10000
      })
      .catch(() => null);
  
    await botaoSalvar.click();
  
    const dialog = await dialogPromise;
  
    await this.page.waitForTimeout(1000);
  
    await this.screenshot(
      'depois-de-salvar-marcacao-manual'
    );
  
    return dialog;
  }

  async validarMensagemObrigatoria() {

    let mensagemDialog = '';
  
    this.page.once('dialog', async dialog => {
  
      mensagemDialog = dialog.message();
  
      console.log(
        'ALERTA ENCONTRADO:',
        mensagemDialog
      );
  
      await dialog.accept();
    });
  
    await this.page.evaluate(() => {
  
      const botoes = Array.from(
        document.querySelectorAll('button')
      ) as HTMLButtonElement[];
  
      const botaoSalvar = botoes.find(
        botao => botao.innerText.trim().toLowerCase() === 'salvar'
      );
  
      if (!botaoSalvar) {
        throw new Error('Botão Salvar não encontrado.');
      }
  
      botaoSalvar.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        })
      );
    });
  
    await this.page.waitForTimeout(1000);
  
    expect(mensagemDialog).toContain(
      'Selecione pelo menos um colaborador'
    );
  
    await this.screenshot(
      'alert-validado'
    );
  }

  async selecionarPrimeiroColaborador() {

    const primeiroCheckboxColaborador = this.page
      .locator('tbody input[type="checkbox"]')
      .first();
  
    await primeiroCheckboxColaborador.check();
  
    await this.screenshot(
      'colaborador-selecionado'
    );
  }
  
  async salvarMarcacaoManualComSucesso() {
  
    const botaoSalvar = this.page
      .getByRole('button', { name: /^salvar$/i });
  
    await botaoSalvar.click();
  
    await expect(
      this.page.getByRole(
        'button',
        { name: /marcação manual|marcacao manual/i }
      )
    ).toBeVisible({
      timeout: 60000
    });
  
    await this.screenshot(
      'marcacao-manual-salva-sucesso'
    );
  }

  async acessarTelaRotinas() {

    await this.abrirRotinas();
  }
  
  async abrirAusencia() {
  
    const botaoAusencia = this.page
      .getByRole('button', { name: /ausência|ausencia/i })
      .first();
  
    await this.clicar(botaoAusencia);
  
    await this.page.waitForTimeout(1000);
  
    const periodoIntegral = this.page
      .getByText(/período integral|periodo integral/i)
      .first();
  
    await periodoIntegral.click();
  
    await this.screenshot(
      'ausencia-periodo-integral'
    );
  }
  
  async selecionarFaltaJustificada() {
  
    const faltaJustificada = this.page
      .getByText(/falta justificada/i)
      .first();
  
    await faltaJustificada.click();
  
    await this.page.waitForTimeout(1000);
  
    await this.screenshot(
      'ausencia-falta-justificada'
    );
  }
  
  async selecionarJustificativaCriada() {
  
    const campoJustificativa = this.page
      .locator('select')
      .filter({
        hasText: /selecione a justificativa/i
      })
      .first();
  
    await campoJustificativa.selectOption({
      label: testData.justificativaAusencia
    });
  
    await this.screenshot(
      'justificativa-selecionada'
    );
  }
  
  async anexarArquivoAusencia() {
  
    const caminhoArquivo = path.resolve(
      'fixtures',
      'atestado.png'
    );
  
    const inputArquivo = this.page
      .locator('input[type="file"]')
      .first();
  
    await inputArquivo.setInputFiles(
      caminhoArquivo
    );
  
    await this.screenshot(
      'arquivo-anexado-ausencia'
    );
  }
  
  async salvarAusenciaComSucesso() {
  
    const botaoSalvar = this.page
      .getByRole('button', { name: /^salvar$/i })
      .last();
  
    await botaoSalvar.click();
  
    await expect(
      this.page.getByRole(
        'button',
        { name: /marcação manual|marcacao manual/i }
      )
    ).toBeVisible({
      timeout: 60000
    });
  
    await expect(
      this.page.getByRole(
        'button',
        { name: /ausência|ausencia/i }
      )
    ).toBeVisible({
      timeout: 60000
    });
  
    await this.screenshot(
      'ausencia-salva-sucesso'
    );
  }

  async preencherObservacaoAusencia() {

    const campoObs = this.page
      .getByPlaceholder(/obs/i);
  
    await campoObs.fill(
      'Observação criada automaticamente pelo teste'
    );
  
    await this.screenshot(
      'observacao-ausencia'
    );
  }

  async selecionarAusenciaPorHorario() {

    const botaoAusencia = this.page
      .getByRole('button', { name: /ausência|ausencia/i })
      .first();
  
    await this.clicar(
      botaoAusencia
    );
  
    await this.page.waitForTimeout(1000);
  
    await this.screenshot(
      'ausencia-por-horario'
    );
  }
  
  async preencherHorarioInicialAusencia() {

    const campoHorarioInicial = this.page
      .getByPlaceholder('Horário inicial');
  
    await this.preencherCampo(
      campoHorarioInicial,
      '08:00'
    );
  
    await this.screenshot(
      'horario-inicial-ausencia'
    );
  }
  
  async preencherHorarioFinalAusencia() {
  
    const campoHorarioFinal = this.page
      .getByPlaceholder('Horário final');
  
    await this.preencherCampo(
      campoHorarioFinal,
      '12:00'
    );
  
    await this.screenshot(
      'horario-final-ausencia'
    );
  }
} 