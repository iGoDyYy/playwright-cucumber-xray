import { Page } from '@playwright/test';

export class HomePage {

  constructor(private page: Page) {}

  async acessarSite() {

    await this.page.goto('https://apponte.me');
  }

  logoApponte() {

    return this.page.getByRole('img');
  }
}