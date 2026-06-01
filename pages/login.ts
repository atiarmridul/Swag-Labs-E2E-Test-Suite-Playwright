import { Page, Locator } from '@playwright/test';

export class LoginPage {
  page: Page;
  passwordField: Locator;
  usernameField: Locator;
  loginButton: Locator;
  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.getByTestId('username');
    this.passwordField = page.getByTestId('password');
    this.loginButton = page.getByRole('button', { name: 'LOGIN' });
  }

  async gotoLoginPage(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }
}
