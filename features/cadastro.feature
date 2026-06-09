# language: pt

@cadastro
@regression

Funcionalidade: Cadastro de usuário

  Como visitante da plataforma
  Quero realizar um cadastro
  Para acessar o sistema Apponte.me

Contexto: Acessar página de cadastro
  Dado que acesso a página de cadastro

@cadastro-real
Cenario: Realizar cadastro completo com validacao de email

  Quando preencho os dados do novo usuário
  E confirmo o cadastro
  E preencho os dados de endereço
  E confirmo o endereço
  E preencho os documentos da empresa
  E confirmo os documentos
  E preencho os termos
  E confirmo os termos
  Então o usuário deve ser cadastrado com sucesso
  E valido o email enviado

Cenario: Validar fluxo de cadastro sem submeter

  Quando preencho os dados do novo usuário
  E confirmo o cadastro
  E preencho os dados de endereço
  E confirmo o endereço
  E preencho os documentos da empresa
  E confirmo os documentos
  E preencho os termos
  Então o cadastro deve estar pronto para conclusão