import {
    When,
    Then
  } from '@cucumber/cucumber';
  
  import { page } from '../hooks/hooks';
  
  import { RotinasPage } from '../pages/RotinasPage';
  
  let rotinasPage: RotinasPage;
  
  When(
    'acesso a tela de Rotinas Ausência',
    async () => {
      rotinasPage = new RotinasPage(page);
  
      await rotinasPage.acessarTelaRotinas();
    }
  );
  
  When(
    'seleciono ausência período integral',
    async () => {
      await rotinasPage.abrirAusencia();
    }
  );
  
  When(
    'seleciono falta justificada',
    async () => {
      await rotinasPage.selecionarFaltaJustificada();
    }
  );
  
  When(
    'seleciono a justificativa criada',
    async () => {
      await rotinasPage.selecionarJustificativaCriada();
    }
  );
  
  When(
    'anexo um arquivo',
    async () => {
      await rotinasPage.anexarArquivoAusencia();
    }
  );
  
  When(
    'seleciono um colaborador para ausência',
    async () => {
      await rotinasPage.selecionarPrimeiroColaborador();
    }
  );
  
  Then(
    'a ausência deve ser salva com sucesso',
    async () => {
      await rotinasPage.salvarAusenciaComSucesso();
    }
  );

  When(
    'preencho a observação da ausência',
    async () => {
      await rotinasPage.preencherObservacaoAusencia();
    }
  );

  When(
    'seleciono ausência por horário',
    async () => {
      await rotinasPage.selecionarAusenciaPorHorario();
    }
  );
  
  When(
    'preencho o horário inicial da ausência',
    async () => {
      await rotinasPage.preencherHorarioInicialAusencia();
    }
  );
  
  When(
    'preencho o horário final da ausência',
    async () => {
      await rotinasPage.preencherHorarioFinalAusencia();
    }
  );