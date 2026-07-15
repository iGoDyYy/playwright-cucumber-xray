# language: pt

@rotinas
Funcionalidade: Rotinas - Marcação Manual

  @tcid-21
  Cenário: TCID 21 - Validar obrigatoriedade de colaborador
    Dado que acesso o Apponte.me
    Quando acesso a tela de login do painel
    E informo credenciais válidas
    E confirmo o login
    Então devo estar autenticado no painel

    Dado acesso a tela de Rotinas
    Quando seleciono o tipo de marcação manual "Entrada"
    E preencho o horário da marcação manual
    E preencho o motivo da marcação manual
    Então o sistema deve exibir a validação de colaborador obrigatório

  @tcid-22
  Cenário: TCID 22 - Fechar mensagem de obrigatoriedade de colaborador
    Dado que acesso o Apponte.me
    Quando acesso a tela de login do painel
    E informo credenciais válidas
    E confirmo o login
    Então devo estar autenticado no painel

    Dado acesso a tela de Rotinas
    Quando seleciono o tipo de marcação manual "Entrada"
    E preencho o horário da marcação manual
    E preencho o motivo da marcação manual
    Então o sistema deve exibir a validação de colaborador obrigatório

  @tcid-23
  Cenário: TCID 23 - Registrar marcação manual Entrada após validar colaborador obrigatório
    Dado que acesso o Apponte.me
    Quando acesso a tela de login do painel
    E informo credenciais válidas
    E confirmo o login
    Então devo estar autenticado no painel

    Dado acesso a tela de Rotinas
    Quando seleciono o tipo de marcação manual "Entrada"
    E preencho o horário da marcação manual
    E preencho o motivo da marcação manual
    Então o sistema deve exibir a validação de colaborador obrigatório

    Quando seleciono um colaborador na tabela de Rotinas
    Então a marcação manual deve ser salva com sucesso

      @tcid-24
  Cenário: TCID 24 - Validar obrigatoriedade de colaborador em Saída para o almoço
    Dado que acesso o Apponte.me
    Quando acesso a tela de login do painel
    E informo credenciais válidas
    E confirmo o login
    Então devo estar autenticado no painel

    Dado acesso a tela de Rotinas
    Quando seleciono o tipo de marcação manual "Saida para almoço"
    E preencho o horário da marcação manual
    E preencho o motivo da marcação manual
    Então o sistema deve exibir a validação de colaborador obrigatório

      @tcid-25
  Cenário: TCID 25 - Fechar mensagem de obrigatoriedade em Saida para almoço
    Dado que acesso o Apponte.me
    Quando acesso a tela de login do painel
    E informo credenciais válidas
    E confirmo o login
    Então devo estar autenticado no painel

    Dado acesso a tela de Rotinas
    Quando seleciono o tipo de marcação manual "Saida para almoço"
    E preencho o horário da marcação manual
    E preencho o motivo da marcação manual
    Então o sistema deve exibir a validação de colaborador obrigatório

      @tcid-26
  Cenário: TCID 26 - Registrar marcação manual Saida para almoço após validar colaborador obrigatório
    Dado que acesso o Apponte.me
    Quando acesso a tela de login do painel
    E informo credenciais válidas
    E confirmo o login
    Então devo estar autenticado no painel

    Dado acesso a tela de Rotinas
    Quando seleciono o tipo de marcação manual "Saida para almoço"
    E preencho o horário da marcação manual
    E preencho o motivo da marcação manual

    Então o sistema deve exibir a validação de colaborador obrigatório

    Quando seleciono um colaborador na tabela de Rotinas

    Então a marcação manual deve ser salva com sucesso

      @tcid-27
  Cenário: TCID 27 - Validar obrigatoriedade de colaborador em Retorno do almoço
    Dado que acesso o Apponte.me
    Quando acesso a tela de login do painel
    E informo credenciais válidas
    E confirmo o login
    Então devo estar autenticado no painel

    Dado acesso a tela de Rotinas
    Quando seleciono o tipo de marcação manual "Retorno do almoço"
    E preencho o horário da marcação manual
    E preencho o motivo da marcação manual
    Então o sistema deve exibir a validação de colaborador obrigatório

  @tcid-28
  Cenário: TCID 28 - Fechar mensagem de obrigatoriedade em Retorno do almoço
    Dado que acesso o Apponte.me
    Quando acesso a tela de login do painel
    E informo credenciais válidas
    E confirmo o login
    Então devo estar autenticado no painel

    Dado acesso a tela de Rotinas
    Quando seleciono o tipo de marcação manual "Retorno do almoço"
    E preencho o horário da marcação manual
    E preencho o motivo da marcação manual
    Então o sistema deve exibir a validação de colaborador obrigatório

  @tcid-29
  Cenário: TCID 29 - Registrar marcação manual Retorno do almoço após validar colaborador obrigatório
    Dado que acesso o Apponte.me
    Quando acesso a tela de login do painel
    E informo credenciais válidas
    E confirmo o login
    Então devo estar autenticado no painel

    Dado acesso a tela de Rotinas
    Quando seleciono o tipo de marcação manual "Retorno do almoço"
    E preencho o horário da marcação manual
    E preencho o motivo da marcação manual
    Então o sistema deve exibir a validação de colaborador obrigatório

    Quando seleciono um colaborador na tabela de Rotinas
    Então a marcação manual deve ser salva com sucesso

      @tcid-30
  Cenário: TCID 30 - Validar obrigatoriedade de colaborador em Saída
    Dado que acesso o Apponte.me
    Quando acesso a tela de login do painel
    E informo credenciais válidas
    E confirmo o login
    Então devo estar autenticado no painel

    Dado acesso a tela de Rotinas
    Quando seleciono o tipo de marcação manual "Saída"
    E preencho o horário da marcação manual
    E preencho o motivo da marcação manual

    Então o sistema deve exibir a validação de colaborador obrigatório