# language: pt
@login
@smoke

Funcionalidade: Autenticação no Apponte.me
  Como usuário cadastrado
  Quero acessar o painel com minhas credenciais
  Para utilizar a área logada do sistema

  Contexto:
    Dado que acesso o Apponte.me

  Cenario: Realizar login com sucesso
    Quando acesso a tela de login do painel
    E informo credenciais válidas
    E confirmo o login
    Entao devo estar autenticado no painel
