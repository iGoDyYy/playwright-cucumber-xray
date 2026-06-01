# Playwright + Cucumber (BDD) — Apponte.me

## Testes disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run test:colaborador` | Login + cadastra colaborador (clica em **Cadastrar**) |
| `npm run test:colaborador:real` | Igual ao anterior |
| `npm run test:colaborador:preview` | Preenche formulário **sem** clicar em Cadastrar |
| `npm run test:cadastro` | Fluxo de cadastro público **sem** concluir |
| `npm run test:cadastro:real` | Cadastro completo + e-mail (requer `CADASTRO_REAL=true`) |
| `npm run test:smoke` | Cenários com `@smoke` |
| `npm test` | Todos os cenários |

## Configuração (.env)

Copie `.env.example` para `.env` e preencha:

```env
EMAIL_LOGIN=seu@email.com
PASSWORD_LOGIN=sua_senha
COLABORADOR_PAUSA_MS=600
```

- **Colaborador:** não precisa de flag extra — use `npm run test:colaborador`.
- **Cadastro de empresa:** só com permissão → `CADASTRO_REAL=true` e `npm run test:cadastro:real`.

## Estrutura BDD

- `features/*.feature` — cenários em português
- `steps/*.ts` — ligação Gherkin → código
- `pages/*.ts` — automação Playwright
