# language: pt

@ausencias
@tcid-14

Funcionalidade: Configuração de Ausências

  Cenário: TCID 14 - Criar justificativa de ausência

    Dado que acesso o Apponte.me

    Quando acesso a tela de login do painel
    E informo credenciais válidas
    E confirmo o login

    Então devo estar autenticado no painel

    Quando acesso as configurações de ausência
    E acesso o cadastro de nova justificativa
    E crio uma justificativa automática

    Então a justificativa deve ser criada com sucesso