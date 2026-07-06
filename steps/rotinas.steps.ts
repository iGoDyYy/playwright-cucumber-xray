import {
    Given,
    When,
    Then
  } from '@cucumber/cucumber';
  
  import { page } from '../hooks/hooks';
  
  import { RotinasPage } from '../pages/RotinasPage';
  
  let rotinasPage: RotinasPage;
  
  Given(
    'acesso a tela de Rotinas',
    async () => {
  
      rotinasPage =
        new RotinasPage(page);
  
      await rotinasPage.abrirRotinas();
    }
  );
  
  When(
    'seleciono o tipo de marcação manual {string}',
    async (tipo: string) => {
  
      await rotinasPage
        .selecionarTipoMarcacao(tipo);
    }
  );
  
  When(
    'preencho o horário da marcação manual',
    async () => {
  
      await rotinasPage
        .preencherHorario();
    }
  );
  
  When(
    'preencho o motivo da marcação manual',
    async () => {
  
      await rotinasPage
        .preencherMotivo();
    }
  );
  
  Then(
    'o sistema deve exibir a validação de colaborador obrigatório',
    async () => {
  
      await rotinasPage
        .validarMensagemObrigatoria();
    }
  );

  When(
    'seleciono um colaborador na tabela de Rotinas',
    async () => {
  
      await rotinasPage
        .selecionarPrimeiroColaborador();
    }
  );
  
  Then(
    'a marcação manual deve ser salva com sucesso',
    async () => {
  
      await rotinasPage
        .salvarMarcacaoManualComSucesso();
    }
  );