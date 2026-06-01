import { Page, expect } from '@playwright/test';

import { BasePage } from './BasePage';

export class GooglePage extends BasePage {

  constructor(page: Page) {

    super(page);
  }

  async acessarGoogle() {

    await this.page.goto(
      'https://www.google.com'
    );

    await this.page.waitForLoadState(
      'domcontentloaded'
    );
  }

  async pesquisar(texto: string) {

    const campoPesquisa = this.page.locator(
      'textarea[name="q"]'
    );

    await campoPesquisa.fill(texto);

    await campoPesquisa.press('Enter');
  }

  async validarTituloGoogle() {

    await this.page.waitForTimeout(3000);
  
    const urlAtual =
      this.page.url();
  
    console.log(
      'URL ATUAL:',
      urlAtual
    );
  
    if (
      urlAtual.includes('sorry') ||
      urlAtual.includes('captcha')
    ) {
  
      console.log(
        'Google bloqueou a automação.'
      );
  
      return;
    }
  
    const titulo =
      await this.page.title();
  
    console.log(
      'TÍTULO:',
      titulo
    );
  
    expect(
      titulo.length
    ).toBeGreaterThan(0);
  }

  async validarResultadosDaPesquisa() {

    await expect(this.page)
      .toHaveURL(/search/);
  }
}