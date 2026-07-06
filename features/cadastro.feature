# language: pt

@cadastro
@regression
Funcionalidade: Cadastro de usuário

  Como visitante da plataforma
  Quero realizar um cadastro
  Para acessar o sistema Apponte.me

@cadastro-real
Cenario: Realizar cadastro completo produção com validação de email

  Dado que acesso a página de cadastro produção
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

@cadastro-sem-submit
Cenario: Validar fluxo de cadastro sem submeter

  Dado que acesso a página de cadastro produção
  Quando preencho os dados do novo usuário
  E confirmo o cadastro
  E preencho os dados de endereço
  E confirmo o endereço
  E preencho os documentos da empresa
  E confirmo os documentos
  E preencho os termos
  Então o cadastro deve estar pronto para conclusão

@cadastro-staging
Cenario: Realizar cadastro completo staging com validação email no Mailhog

  Dado que acesso a página de cadastro staging
  Quando preencho os dados do novo usuário
  E confirmo o cadastro
  E preencho os dados de endereço
  E confirmo o endereço
  E preencho os documentos da empresa
  E confirmo os documentos
  E preencho os termos
  E confirmo os termos
  Então o usuário deve ser cadastrado com sucesso
  E valido o email enviado no mailhog