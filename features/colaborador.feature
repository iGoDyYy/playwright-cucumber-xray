# language: pt

@colaborador
@regression

Funcionalidade: Cadastro de colaborador no painel

  Como administrador do painel
  Quero cadastrar colaboradores
  Para gerenciar a equipe no Apponte.me

  Contexto:
    Dado que acesso o Apponte.me
    Quando acesso a tela de login do painel
    E informo credenciais válidas
    E confirmo o login
    Entao devo estar autenticado no painel

  @colaborador-cadastro
  Cenario: Cadastrar novo colaborador com dados dinâmicos

    Quando acesso o formulário de novo colaborador
    E preencho os dados do novo colaborador
    E clico no botão Cadastrar
    Entao o colaborador deve ser cadastrado com sucesso

  @colaborador-preview
  Cenario: Validar preenchimento de colaborador sem salvar

    Quando acesso o formulário de novo colaborador
    E preencho os dados do novo colaborador
    Entao o formulário de colaborador deve estar pronto para salvar
