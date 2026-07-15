# language: pt

@staging
@colaborador-staging

Funcionalidade: Cadastro de colaborador no painel staging

  Contexto:
    Dado que acesso o Apponte.me staging
    Quando acesso a tela de login do painel staging
    E informo credenciais válidas do staging
    E confirmo o login do staging
    Então devo estar autenticado no painel staging

  @cadastro-colaborador-staging
  Cenario: Cadastrar colaborador no staging

    Quando acesso o formulário de novo colaborador
    E preencho os dados do novo colaborador
    E clico no botão Cadastrar
    Então o colaborador deve ser cadastrado com sucesso