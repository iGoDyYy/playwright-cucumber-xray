# language: pt
@regression
@google
Funcionalidade: Pesquisa Google
  Como usuário da internet
  Quero pesquisar um termo no Google
  Para encontrar resultados relevantes

  @QA-330
  Cenario: Pesquisar Playwright no Google
    Dado que acesso o Google
    Quando pesquiso por "Playwright"
    E devo visualizar o título Google
    Entao devo visualizar resultados da pesquisa