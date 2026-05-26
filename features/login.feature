@login
@smoke

Feature: Login Apponte

Scenario: Realizar login com sucesso

Given que acesso o Apponte.me
When clico no botão Painel
And preencho email e senha válidos
And clico no botão Entrar
Then devo visualizar o painel logado
