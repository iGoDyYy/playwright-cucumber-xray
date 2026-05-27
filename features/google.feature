@regression
@google
Feature: Pesquisa Google
  Como usuário da internet
  Quero pesquisar um termo no Google
  Para encontrar resultados relevantes

  @QA-330
  Scenario: Pesquisar Playwright no Google
    Given que acesso o Google
    When pesquiso por "Playwright"
    And devo visualizar o título Google
    Then devo visualizar resultados da pesquisa