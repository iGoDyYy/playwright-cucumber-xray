import {
  Locator,
  Page,
  expect
} from '@playwright/test';

export class BasePage {

  protected page: Page;

  constructor(page: Page) {

    this.page = page;
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

    await locator.waitFor({
      state: 'visible',
      timeout: 60000
    });

    await locator.click();

    await locator.fill(texto);
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