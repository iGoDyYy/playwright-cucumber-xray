# Contributing Guide

Obrigado por contribuir com o framework de automação do **Apponte.me**.

Este documento descreve os padrões utilizados no projeto e como novas automações devem ser desenvolvidas.

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

Cada pasta possui uma responsabilidade específica.

| Pasta    | Responsabilidade                    |
| -------- | ----------------------------------- |
| features | Cenários escritos em Gherkin        |
| pages    | Implementação do Page Object Model  |
| steps    | Implementação dos Steps do Cucumber |
| hooks    | Before / After                      |
| utils    | Helpers, factories e utilidades     |
| fixtures | Massa de dados                      |
| reports  | Relatórios, screenshots e vídeos    |
| scripts  | Scripts de integração com Xray      |

---

# Fluxo para criar uma nova automação

Sempre siga esta ordem:

## 1. Criar a Feature

Criar um arquivo em:

```
features/
```

Exemplo:

```
features/meu-modulo.feature
```

---

## 2. Criar os Steps

Criar um arquivo em:

```
steps/
```

Exemplo:

```
steps/meuModulo.steps.ts
```

Os Steps devem conter apenas a ligação entre o Gherkin e os métodos das Pages.

Evite colocar lógica de negócio dentro dos Steps.

---

## 3. Criar a Page

Toda nova tela deve possuir sua própria Page.

Exemplo:

```
pages/MeuModuloPage.ts
```

Toda interação com a interface deve ser implementada na Page.

---

## 4. Reutilizar código

Antes de criar um método novo:

* procure se já existe uma implementação semelhante;
* reutilize métodos sempre que possível;
* evite duplicação.

---

# Padrões utilizados

## Page Object Model

Toda interação com elementos da interface deve ficar nas Pages.

Exemplo:

```ts
await loginPage.confirmarLogin();
```

Nunca:

```ts
await page.getByRole(...).click();
```

diretamente dentro dos Steps.

---

## Screenshots

Sempre que uma ação importante for executada:

* cadastro
* exclusão
* edição
* confirmação

salve uma screenshot utilizando:

```ts
await this.screenshot("nome-da-screenshot");
```

---

## Esperas

Sempre prefira:

```ts
await expect(locator).toBeVisible();
```

ao invés de:

```ts
waitForTimeout()
```

O uso de `waitForTimeout()` deve ocorrer apenas quando realmente necessário (ex.: tempo mínimo exigido pela aplicação).

---

# Massa de dados

Sempre utilizar Factories.

Exemplo:

```
utils/factories/
```

Evite criar dados fixos.

---

# TestData

Utilize `utils/testData.ts` apenas para compartilhar informações entre cenários e páginas durante uma mesma execução.

Não utilize para armazenar dados permanentes.

---

# Mailhog

Os testes do módulo Responsável Fiscal utilizam o Mailhog para validar e-mails.

Fluxo:

1. Enviar e-mail
2. Procurar no Mailhog
3. Caso não encontre:

   * aguardar 2 minutos;
   * voltar ao Apponte;
   * reenviar o e-mail;
   * procurar novamente.

Esse processo é automático.

---

# Xray

Sempre que um novo módulo for criado:

* criar o CSV;
* importar os testes;
* criar o pacote manual;
* criar o script de publicação.

Todos os scripts ficam em:

```
scripts/xray/
```

---

# Antes de abrir um Pull Request

Execute:

```bash
git status
```

Depois:

```bash
npx tsc --noEmit
```

Depois:

```bash
npx cucumber-js --tags "@nome-do-modulo"
```

Caso todos os testes passem:

```bash
git add .
```

```bash
git commit -m "feat: descrição"
```

```bash
git push
```

---

# Convenção de commits

Novas funcionalidades

```
feat:
```

Correções

```
fix:
```

Refatoração

```
refactor:
```

Documentação

```
docs:
```

Testes

```
test:
```

Build

```
build:
```

---

# Boas práticas

✔ Utilizar Page Objects.

✔ Utilizar Factories.

✔ Evitar código duplicado.

✔ Escrever métodos reutilizáveis.

✔ Escrever nomes descritivos.

✔ Executar os testes antes do commit.

✔ Atualizar o README quando necessário.

✔ Atualizar este documento caso um novo padrão seja adotado.

---

# Dúvidas

Em caso de dúvidas sobre a estrutura do framework, consulte o **README.md** ou entre em contato com o responsável pelo projeto.
