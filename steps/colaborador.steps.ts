import {
  When,
  Then
} from '@cucumber/cucumber';

import { ColaboradorPage } from '../pages/ColaboradorPage';

import {
  Colaborador,
  ColaboradorFactory
} from '../utils/factories/ColaboradorFactory';

import { page } from '../hooks/hooks';

let colaboradorPage: ColaboradorPage;

let colaborador: Colaborador;

When(
  'acesso o formulário de novo colaborador',
  async () => {

    colaboradorPage =
      new ColaboradorPage(page);

    await colaboradorPage
      .abrirFormularioNovoColaborador();
  }
);

When(
  'preencho os dados do novo colaborador',
  async () => {

    colaborador =
      ColaboradorFactory.criarColaborador();

    console.log(
      'COLABORADOR GERADO:',
      colaborador
    );

    await colaboradorPage
      .preencherColaborador(colaborador);
  }
);

When(
  'clico no botão Cadastrar',
  async () => {

    await colaboradorPage
      .salvarColaborador();
  }
);

When(
  'salvo o novo colaborador',
  async () => {

    await colaboradorPage
      .salvarColaborador();
  }
);

Then(
  'o colaborador deve ser cadastrado com sucesso',
  async () => {

    await colaboradorPage
      .validarColaboradorCadastrado(colaborador);
  }
);

Then(
  'o formulário de colaborador deve estar pronto para salvar',
  async () => {

    await colaboradorPage
      .validarFormularioProntoParaSalvar();
  }
);
