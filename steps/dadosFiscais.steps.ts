import {
    When,
    Then
  } from '@cucumber/cucumber';
  
  import { page } from '../hooks/hooks';
  
  import { DadosFiscaisPage } from '../pages/DadosFiscaisPage';
  
  
  let dadosFiscaisPage: DadosFiscaisPage;
  
  When(
    'acesso o cadastro de responsável fiscal pela mensagem de colaboradores',
    async () => {
      dadosFiscaisPage = new DadosFiscaisPage(page);
  
      await dadosFiscaisPage
        .acessarCadastroPelaMensagemColaboradores();
    }
  );
  
  When(
    'preencho os dados do responsável fiscal',
    async () => {
      await dadosFiscaisPage
        .preencherResponsavelFiscal();
    }
  );
  
  When(
    'salvo o responsável fiscal',
    async () => {
      await dadosFiscaisPage
        .salvarResponsavelFiscal();
    }
  );

  Then(
    'devo acessar a validação de e-mail do responsável fiscal pela mensagem de colaboradores',
    async () => {
      dadosFiscaisPage = new DadosFiscaisPage(page);
  
      await dadosFiscaisPage
        .acessarValidacaoEmailPelaMensagemColaboradores();
    }
  );

  Then(
    'devo acessar a validação de e-mail do responsável fiscal pelo menu de dados fiscais',
    async () => {
      dadosFiscaisPage = new DadosFiscaisPage(page);
  
      await dadosFiscaisPage
        .acessarValidacaoEmailPeloMenuDadosFiscais();
    }
  );

  When(
    'clico em Validar e-mail',
    async () => {
      if (!dadosFiscaisPage) {
        dadosFiscaisPage = new DadosFiscaisPage(page);
      }
  
      await dadosFiscaisPage.clicarValidarEmail();
    }
  );
  
  Then(
    'devo visualizar o pop-up de e-mail enviado com sucesso',
    async () => {
      await dadosFiscaisPage.validarPopupEmailEnviado();
    }
  );

  Then(
    'devo visualizar a mensagem de sucesso do envio do e-mail',
    async () => {
      await dadosFiscaisPage
        .validarPopupEmailEnviado();
    }
  );

  Then(
    'devo visualizar o conteúdo correto do pop-up',
    async () => {
  
      await dadosFiscaisPage
        .validarConteudoPopupEmail();
    }
  );

  When(
    'garanto acesso ao responsável fiscal para validação',
    async () => {
      dadosFiscaisPage = new DadosFiscaisPage(page);
  
      await dadosFiscaisPage
        .garantirAcessoCadastroOuValidacaoResponsavelFiscal();
    }
  );

  When(
    'crio um novo responsável fiscal para validação',
    async () => {
      dadosFiscaisPage = new DadosFiscaisPage(page);
  
      await dadosFiscaisPage
        .acessarCriacaoResponsavelFiscalPeloMenu();
  
      await dadosFiscaisPage
        .preencherResponsavelFiscal();
  
      await dadosFiscaisPage
        .salvarResponsavelFiscal();
    }
  );

  Then(
    'o responsável fiscal deve estar marcado como validado',
    async () => {
      dadosFiscaisPage = new DadosFiscaisPage(page);
  
      await dadosFiscaisPage
        .validarResponsavelFiscalValidado();
    }
  );

  Then(
    'a mensagem de validação do responsável fiscal não deve mais ser exibida',
    async () => {
  
      dadosFiscaisPage = new DadosFiscaisPage(page);
  
      await dadosFiscaisPage
        .validarAusenciaMensagemResponsavelFiscal();
    }
  );