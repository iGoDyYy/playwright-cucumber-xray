# Playwright + Cucumber (BDD) — Apponte.me

Framework de automação de testes desenvolvido utilizando **Playwright**, **Cucumber (BDD)** e **TypeScript** para validar os fluxos do Apponte.me.

Além da automação E2E, o projeto possui integração com **Xray/Jira**, permitindo importação de testes manuais, criação automática de Test Plan, Test Set, Test Execution e publicação dos resultados de execução.

---

# Tecnologias utilizadas

- Playwright
- Cucumber (BDD)
- TypeScript
- Node.js
- Xray
- Jira
- Mailhog
- Dotenv

---

# Estrutura do projeto

```
features/
pages/
steps/
hooks/
utils/
fixtures/
reports/
scripts/
```

### Organização

- `features/` → Cenários escritos em Gherkin
- `pages/` → Page Objects
- `steps/` → Implementação dos Steps
- `hooks/` → Before / After
- `utils/` → Utilitários e factories
- `fixtures/` → Massa de dados
- `reports/` → Relatórios, screenshots e vídeos
- `scripts/` → Scripts de integração com Xray

---

# Configuração do ambiente

Copie o arquivo `.env.example` para `.env`.

Exemplo:

```env
LOGIN_EMAIL=
LOGIN_PASSWORD=

PANEL_EMAIL_STAGING=
PANEL_PASSWORD_STAGING=

MAILHOG_URL=

XRAY_CLIENT_ID=
XRAY_CLIENT_SECRET=

JIRA_EMAIL=
JIRA_API_TOKEN=
```

---

# Instalação

Instale todas as dependências:

```bash
npm install
```

---

# Execução dos testes

## Executar todos os testes

```bash
npm test
```

---

## Executar testes por Feature

### Cadastro

```bash
npm run test:cadastro
```

Cadastro completo

```bash
npm run test:cadastro:real
```

Preview

```bash
npm run test:cadastro:preview
```

---

### Colaborador

```bash
npm run test:colaborador
```

Cadastro real

```bash
npm run test:colaborador:real
```

Preview

```bash
npm run test:colaborador:preview
```

---

### Smoke

```bash
npm run test:smoke
```

---

# Execução por Tags

Responsável Fiscal

```bash
npx cucumber-js --tags "@responsavel-fiscal"
```

---

Rotinas

```bash
npx cucumber-js --tags "@rotinas"
```

---

Marcação Manual

```bash
npx cucumber-js --tags "@marcacao-manual"
```

---

Ausências

```bash
npx cucumber-js --tags "@ausencias"
```

---

Executar um TC específico

Exemplo:

```bash
npx cucumber-js --tags "@tcid-7"
```

---

# Verificação do projeto

Validar erros de TypeScript

```bash
npx tsc --noEmit
```

---

# Relatórios

Gerar relatório Cucumber

```bash
npm test
```

ou

```bash
npx cucumber-js --format json:reports/cucumber-report.json
```

---

# Integração com Xray

O framework possui integração automática com o Xray.

Fluxo executado automaticamente:

- Executa os testes
- Gera o relatório do Cucumber
- Publica o relatório no Xray
- Atualiza o Test Execution
- Relaciona os testes ao Test Plan e Test Set

---

## Executar testes e publicar automaticamente

```bash
npm run xray:responsavel-fiscal
```

---

## Publicar somente um relatório existente

```bash
npx ts-node scripts/xray/publishCucumberReportToXray.ts
```

---

# Testes manuais

## Importar CSV

```bash
npx ts-node scripts/xray/importCsvViaUI.ts
```

---

## Criar pacote de Responsável Fiscal

```bash
npx ts-node scripts/xray/createManualResponsavelFiscalPackageFromImportedTests.ts
```

---

## Criar pacote de Ausências

```bash
npx ts-node scripts/xray/createManualAusenciasPackageFromImportedTests.ts
```

---

## Gerar CSV de Rotinas

```bash
npx ts-node scripts/xray/generateManualRotinasCsv.ts
```

---

# Mailhog

Os testes do módulo **Responsável Fiscal** utilizam o **Mailhog** para validar automaticamente os e-mails enviados pelo sistema.

Caso o e-mail não seja localizado:

1. Aguarda 2 minutos
2. Retorna ao Apponte
3. Reenvia o e-mail de validação
4. Pesquisa novamente no Mailhog
5. Repete o processo até atingir o limite configurado

Esse comportamento evita falhas ocasionadas por atraso na entrega dos e-mails no ambiente de Staging.

---

# Fluxo recomendado de desenvolvimento

Verificar alterações

```bash
git status
```

Validar TypeScript

```bash
npx tsc --noEmit
```

Executar os testes

```bash
npx cucumber-js --tags "@responsavel-fiscal"
```

Adicionar arquivos

```bash
git add .
```

Criar commit

```bash
git commit -m "feat: descrição da funcionalidade"
```

Enviar alterações

```bash
git push origin feature/xray-automation
```

Publicar resultados no Xray

```bash
npm run xray:responsavel-fiscal
```

---

# Convenções

## Pages

Cada tela da aplicação deve possuir sua própria Page.

Exemplo:

```
pages/LoginPage.ts
pages/HomePage.ts
pages/DadosFiscaisPage.ts
```

---

## Steps

Cada Feature deve possuir seus respectivos Steps.

Exemplo:

```
steps/login.steps.ts
steps/email.steps.ts
steps/dadosFiscais.steps.ts
```

---

## Features

Todas as Features devem ser escritas utilizando Gherkin.

Exemplo:

```gherkin
Funcionalidade: Responsável Fiscal

Cenário: Validar e-mail do responsável fiscal
```

---

# Boas práticas

- Utilizar Page Objects para centralizar ações da interface.
- Evitar duplicação de código.
- Reutilizar Steps sempre que possível.
- Criar massa de dados dinâmica utilizando Factories.
- Utilizar Tags para organizar execuções.
- Publicar os resultados sempre através da integração com o Xray.

---

# Autor

Projeto desenvolvido para automação de testes do **Apponte.me**, utilizando Playwright + Cucumber + TypeScript com integração completa ao Xray/Jira.