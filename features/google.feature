@regression
@google
Feature: Pesquisa Google

  @QA-330
  Scenario: Pesquisar Playwright no Google
    Given que acesso o Google
    When pesquiso por "Playwright"
    Then devo visualizar resultados da pesquisa