# language: pt

@ausencias
Funcionalidade: Rotinas - Ausências

  @tcid-15
  Cenário: TCID 15 - Registrar ausência período integral com falta justificada e arquivo

    Dado que acesso o Apponte.me

    Quando acesso a tela de login do painel
    E informo credenciais válidas
    E confirmo o login

    Então devo estar autenticado no painel

    Quando acesso a tela de Rotinas Ausência
    E seleciono ausência período integral
    E seleciono falta justificada
    E seleciono a justificativa criada
    E anexo um arquivo
    E seleciono um colaborador para ausência

    Então a ausência deve ser salva com sucesso

    @tcid-16
Cenário: TCID 16 - Registrar ausência período integral com falta justificada, arquivo e observação

  Dado que acesso o Apponte.me

  Quando acesso a tela de login do painel
  E informo credenciais válidas
  E confirmo o login

  Então devo estar autenticado no painel

  Quando acesso a tela de Rotinas Ausência
  E seleciono ausência período integral
  E seleciono falta justificada
  E seleciono a justificativa criada
  E anexo um arquivo
  E preencho a observação da ausência
  E seleciono um colaborador para ausência

  Então a ausência deve ser salva com sucesso

  @tcid-17
Cenário: TCID 17 - Registrar ausência com horário inicial e final

  Dado que acesso o Apponte.me

  Quando acesso a tela de login do painel
  E informo credenciais válidas
  E confirmo o login

  Então devo estar autenticado no painel

  Quando acesso a tela de Rotinas Ausência
  E seleciono ausência por horário
  E preencho o horário inicial da ausência
  E preencho o horário final da ausência
  E seleciono um colaborador para ausência

  Então a ausência deve ser salva com sucesso

  @tcid-18
Cenário: TCID 18 - Registrar ausência com horário inicial e final e falta justificada

  Dado que acesso o Apponte.me

  Quando acesso a tela de login do painel
  E informo credenciais válidas
  E confirmo o login

  Então devo estar autenticado no painel

  Quando acesso a tela de Rotinas Ausência
  E seleciono ausência por horário
  E preencho o horário inicial da ausência
  E preencho o horário final da ausência
  E seleciono falta justificada
  E seleciono a justificativa criada
  E seleciono um colaborador para ausência

  Então a ausência deve ser salva com sucesso

  @tcid-19
Cenário: TCID 19 - Registrar ausência com horário inicial e final, falta justificada e arquivo

  Dado que acesso o Apponte.me

  Quando acesso a tela de login do painel
  E informo credenciais válidas
  E confirmo o login

  Então devo estar autenticado no painel

  Quando acesso a tela de Rotinas Ausência
  E seleciono ausência por horário
  E preencho o horário inicial da ausência
  E preencho o horário final da ausência
  E seleciono falta justificada
  E seleciono a justificativa criada
  E anexo um arquivo
  E seleciono um colaborador para ausência

  Então a ausência deve ser salva com sucesso

  @tcid-20
Cenário: TCID 20 - Registrar ausência com horário inicial e final, falta justificada, arquivo e observação
  Dado que acesso o Apponte.me
  Quando acesso a tela de login do painel
  E informo credenciais válidas
  E confirmo o login
  Então devo estar autenticado no painel

  Quando acesso a tela de Rotinas Ausência
  E seleciono ausência por horário
  E preencho o horário inicial da ausência
  E preencho o horário final da ausência
  E seleciono falta justificada
  E seleciono a justificativa criada
  E anexo um arquivo
  E preencho a observação da ausência
  E seleciono um colaborador para ausência
  Então a ausência deve ser salva com sucesso