import { Page, Locator } from '@playwright/test';

export class LogoutPage {
  page: Page;
  menuButton: Locator;
  logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutButton = page.locator('#logout_sidebar_link');
  }

  async logoutUser(): Promise<void> {
    await this.menuButton.click();
    await this.logoutButton.click();
  }
}
