# language: pt

Funcionalidade: Responsável Fiscal - Validação de e-mail

    @setup-responsavel-fiscal
    Cenário: Criar responsável fiscal pela mensagem de colaboradores
    Dado que acesso o Apponte.me
    Quando acesso a tela de login do painel
    E informo credenciais válidas
    E confirmo o login
    Então devo estar autenticado no painel

    Quando acesso o cadastro de responsável fiscal pela mensagem de colaboradores
    E preencho os dados do responsável fiscal
    E salvo o responsável fiscal

    @responsavel-fiscal
    @responsavel-fiscal-01
Cenário: TCID 1 - Validar responsável fiscal pela aba de colaboradores
  Dado que acesso o Apponte.me
  Quando acesso a tela de login do painel
  E informo credenciais válidas
  E confirmo o login
  Então devo estar autenticado no painel

Quando crio um novo responsável fiscal para validação
Então devo acessar a validação de e-mail do responsável fiscal pela mensagem de colaboradores

    @responsavel-fiscal
    @responsavel-fiscal-02
Cenário: TCID 2 - Validar responsável fiscal pela aba de dados fiscais
    Dado que acesso o Apponte.me
    Quando acesso a tela de login do painel
    E informo credenciais válidas
    E confirmo o login
    Então devo estar autenticado no painel

Quando crio um novo responsável fiscal para validação
Então devo acessar a validação de e-mail do responsável fiscal pelo menu de dados fiscais

    @responsavel-fiscal
    @responsavel-fiscal-03
Cenário: TCID 3 - Exibição do pop-up após clicar em Validar e-mail
  Dado que acesso o Apponte.me
  Quando acesso a tela de login do painel
  E informo credenciais válidas
  E confirmo o login
  Então devo estar autenticado no painel

Quando crio um novo responsável fiscal para validação
Então devo acessar a validação de e-mail do responsável fiscal pelo menu de dados fiscais
  Quando clico em Validar e-mail
  Então devo visualizar o pop-up de e-mail enviado com sucesso

  @responsavel-fiscal
  @responsavel-fiscal-04
Cenario: TCID 4 - Conteúdo do pop-up exibido

  Dado que acesso o Apponte.me
  Quando acesso a tela de login do painel
  E informo credenciais válidas
  E confirmo o login
 Então devo estar autenticado no painel

Quando crio um novo responsável fiscal para validação
Então devo acessar a validação de e-mail do responsável fiscal pelo menu de dados fiscais
  Quando clico em Validar e-mail
  Então devo visualizar o conteúdo correto do pop-up

  @responsavel-fiscal
  @responsavel-fiscal-05
Cenário: TCID 5 - Receber o e-mail de validação no endereço informado
  Dado que acesso o Apponte.me
  Quando acesso a tela de login do painel
  E informo credenciais válidas
  E confirmo o login
  Então devo estar autenticado no painel

Quando crio um novo responsável fiscal para validação
Então devo acessar a validação de e-mail do responsável fiscal pelo menu de dados fiscais
  Quando clico em Validar e-mail
  Então devo visualizar o pop-up de e-mail enviado com sucesso
  E devo localizar o e-mail de validação do responsável fiscal

    @responsavel-fiscal-setup-inteligente
  Cenário: Garantir acesso ao responsável fiscal para validação
    Dado que acesso o Apponte.me
    Quando acesso a tela de login do painel
    E informo credenciais válidas
    E confirmo o login
    Então devo estar autenticado no painel

    Quando garanto acesso ao responsável fiscal para validação

    @responsavel-fiscal
    @responsavel-fiscal-06
Cenário: TCID 6 - Validar e-mail clicando no botão dentro da mensagem recebida
  Dado que acesso o Apponte.me
  Quando acesso a tela de login do painel
  E informo credenciais válidas
  E confirmo o login
 Então devo estar autenticado no painel

Quando crio um novo responsável fiscal para validação
Então devo acessar a validação de e-mail do responsável fiscal pelo menu de dados fiscais
  Quando clico em Validar e-mail
  Então devo visualizar o pop-up de e-mail enviado com sucesso
  E devo validar o e-mail do responsável fiscal

  @responsavel-fiscal
  @responsavel-fiscal-07
Cenário: TCID 7 - Exibir mensagem de confirmação após validação
  Dado que acesso o Apponte.me
  Quando acesso a tela de login do painel
  E informo credenciais válidas
  E confirmo o login
  Então devo estar autenticado no painel

  Quando crio um novo responsável fiscal para validação
  Então devo acessar a validação de e-mail do responsável fiscal pelo menu de dados fiscais
  Quando clico em Validar e-mail
  Então devo visualizar o pop-up de e-mail enviado com sucesso
  E devo validar o e-mail do responsável fiscal
  Então devo visualizar a confirmação de e-mail validado

  @responsavel-fiscal
  @responsavel-fiscal-08
Cenário: TCID 8 - Confirmar que responsável fiscal aparece como validado após a confirmação
  Dado que acesso o Apponte.me
  Quando acesso a tela de login do painel
  E informo credenciais válidas
  E confirmo o login
  Então devo estar autenticado no painel

  Quando crio um novo responsável fiscal para validação
  Então devo acessar a validação de e-mail do responsável fiscal pelo menu de dados fiscais
  Quando clico em Validar e-mail
  Então devo visualizar o pop-up de e-mail enviado com sucesso
  E devo validar o e-mail do responsável fiscal

  Quando realizo login novamente no painel
  Então o responsável fiscal deve estar marcado como validado

  @responsavel-fiscal
  @responsavel-fiscal-09
Cenário: TCID 9 - Garantir que mensagens de aviso não sejam mais exibidas após validação

Dado que acesso o Apponte.me
Quando acesso a tela de login do painel
E informo credenciais válidas
E confirmo o login
Então devo estar autenticado no painel

Quando crio um novo responsável fiscal para validação
Então devo acessar a validação de e-mail do responsável fiscal pelo menu de dados fiscais
Quando clico em Validar e-mail
Então devo visualizar o pop-up de e-mail enviado com sucesso
E devo validar o e-mail do responsável fiscal

Quando realizo login novamente no painel
Então a mensagem de validação do responsável fiscal não deve mais ser exibida