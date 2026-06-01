import {
  Locator,
  Page,
  expect
} from '@playwright/test';

export class BasePage {

  protected page: Page;

  protected pausaFormularioMs: number;

  constructor(page: Page) {

    this.page = page;

    const pausaEnv =
      Number(process.env.COLABORADOR_PAUSA_MS);

    this.pausaFormularioMs =
      Number.isFinite(pausaEnv) && pausaEnv > 0
        ? pausaEnv
        : 600;
  }

  async navegar(
    url: string
  ) {

    await this.page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 90000
    });
  }

  async clicar(locator: Locator) {

    await locator.waitFor({
      state: 'visible',
      timeout: 60000
    });

    await locator.click();
  }

  async preencher(
    locator: Locator,
    texto: string
  ) {

    await this.preencherCampo(locator, texto);
  }

  async preencherCampo(
    locator: Locator,
    texto: string,
    opcoes: {
      pausaMs?: number;
      digitarDevagar?: boolean;
    } = {}
  ) {

    const {
      pausaMs = this.pausaFormularioMs,
      digitarDevagar = false
    } = opcoes;

    await locator.scrollIntoViewIfNeeded();

    await locator.waitFor({
      state: 'visible',
      timeout: 60000
    });

    await expect(locator).toBeEnabled({
      timeout: 15000
    });

    await locator.click();

    await locator.clear();

    if (digitarDevagar) {

      await locator.pressSequentially(texto, {
        delay: 100
      });
    } else {

      await locator.fill(texto);
    }

    await locator.press('Tab').catch(() => {});

    await this.page.waitForTimeout(pausaMs);
  }

  async selecionarPrimeiraOpcao(
    locator: Locator,
    pausaMs = 600
  ) {

    await locator.scrollIntoViewIfNeeded();

    await locator.waitFor({
      state: 'visible',
      timeout: 60000
    });

    await this.page.waitForTimeout(300);

    await locator.selectOption({
      index: 1
    });

    await this.page.waitForTimeout(pausaMs);
  }

  async validarURL(url: RegExp) {

    await expect(this.page).toHaveURL(url);
  }

  async screenshot(nome: string) {

    await this.page.screenshot({
      path: `reports/screenshots/${nome}.png`,
      fullPage: true
    });
  }
}