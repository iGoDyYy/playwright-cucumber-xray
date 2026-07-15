import {
  Given,
  When,
  Then
} from '@cucumber/cucumber';

import { CadastroPage } from '../pages/CadastroPage';

import { UserFactory } from '../utils/factories/UserFactory';

import { page } from '../hooks/hooks';

let cadastroPage: CadastroPage;

let usuario: any;

Given(
  'que acesso a página de cadastro produção',
  async () => {
    cadastroPage = new CadastroPage(page);

    await cadastroPage.acessarPaginaCadastro(
      process.env.CADASTRO_URL || 'https://cadastro.apponte.me/'
    );
  }
);

Given(
  'que acesso a página de cadastro staging',
  async () => {
    cadastroPage = new CadastroPage(page);

    await cadastroPage.acessarPaginaCadastro(
      process.env.CADASTRO_URL_STAGING || 'https://cadastro-staging.apponte.me/'
    );
  }
);

When(
  'preencho os dados do novo usuário',
  async () => {
    usuario = UserFactory.criarUsuario();

    console.log('USUÁRIO GERADO:', usuario);

    await cadastroPage.preencherFormulario(usuario);
  }
);

When('confirmo o cadastro', async () => {
  await cadastroPage.confirmarCadastro();
});

When('preencho os dados de endereço', async () => {
  await cadastroPage.preencherEndereco(usuario);
});

When('confirmo o endereço', async () => {
  await cadastroPage.confirmarEndereco();
});

When('preencho os documentos da empresa', async () => {
  await cadastroPage.preencherDocumentos(usuario);
});

When('confirmo os documentos', async () => {
  await cadastroPage.confirmarDocumentos();
});

When('preencho os termos', async () => {
  await cadastroPage.preencherTermos();
});

When('confirmo os termos', async () => {
  await cadastroPage.confirmarTermos();
});

Then('o cadastro deve estar pronto para conclusão', async () => {
  await cadastroPage.validarCadastroProntoParaConclusao();
});

Then('o usuário deve ser cadastrado com sucesso', async () => {
  await cadastroPage.validarCadastroSucesso();
});

Then('valido o email enviado', async () => {
  await cadastroPage.validarEmailMailinator(usuario.email);
});

Then('valido o email enviado no mailhog', async () => {
  await cadastroPage.validarEmailMailhog(usuario.email);
});