import {
    When,
    Then
  } from '@cucumber/cucumber';
  
  import { page } from '../hooks/hooks';
  
  import { AusenciasConfigPage } from '../pages/AusenciasConfigPage';
  
  let ausenciasConfigPage: AusenciasConfigPage;
  
  When(
    'acesso as configurações de ausência',
    async () => {
  
      ausenciasConfigPage =
        new AusenciasConfigPage(page);
  
      await ausenciasConfigPage
        .acessarTelaAusencias();
    }
  );
  
  When(
    'acesso o cadastro de nova justificativa',
    async () => {
  
      await ausenciasConfigPage
        .acessarNovaJustificativa();
    }
  );
  
  When(
    'crio uma justificativa automática',
    async () => {
  
      await ausenciasConfigPage
        .criarJustificativaAutomatica();
    }
  );
  
  Then(
    'a justificativa deve ser criada com sucesso',
    async () => {
  
      await ausenciasConfigPage
        .validarJustificativaCriada();
    }
  );