@login
@smoke

Feature: Autenticação no Apponte.me
  Como usuário cadastrado
  Quero acessar o painel com minhas credenciais
  Para utilizar a área logada do sistema

  Background:
    Given que acesso o Apponte.me

  Scenario: Realizar login com sucesso
    When acesso a tela de login do painel
    And informo credenciais válidas
    And confirmo o login
    Then devo estar autenticado no painel
