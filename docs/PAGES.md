# Page Object Model Guide

The suite uses Page Object Model classes to keep selectors and UI actions reusable.

## Current Page Objects

### `pages/login.ts`

Exports `LoginPage`.

Responsibilities:

- Store the Playwright `Page`.
- Locate the username field by `data-test="username"`.
- Locate the password field by `data-test="password"`.
- Locate the login button by accessible role and name.
- Navigate to `https://www.saucedemo.com`.
- Submit credentials.

Public methods:

```typescript
gotoLoginPage(): Promise<void>
login(username: string, password: string): Promise<void>
```

### `pages/inventory.ts`

Exports `InventoryPage`.

Responsibilities:

- Add Sauce Labs Backpack and Sauce Labs Bike Light to the cart.
- Validate inventory sorting behavior by name and price.
- Open the shopping cart.
- Verify selected product names in the cart.
- Fill checkout information.
- Continue and finish checkout.

Public methods:

```typescript
verifyNameAscendingSort(): Promise<void>
verifyNameDescendingSort(): Promise<void>
verifyPriceLowToHighSort(): Promise<void>
verifyPriceHighToLowSort(): Promise<void>
addToCart(): Promise<void>
verifyProductsInCart(): Promise<void>
checkOut(firstName: string, lastName: string, postalCode: string): Promise<void>
```

### `pages/logout.ts`

Exports `LogoutPage`.

Responsibilities:

- Open the burger menu.
- Click the logout link.

Public methods:

```typescript
logoutUser(): Promise<void>
```

## Locator Guidance

Preferred locator order:

1. `page.getByTestId(...)` for stable SauceDemo `data-test` attributes.
2. `page.getByRole(...)` when the accessible name is stable.
3. Short CSS selectors for stable IDs or classes.
4. XPath only as a last resort.

## New Page Object Template

```typescript
import { Locator, Page } from '@playwright/test';

export class ExamplePage {
  readonly page: Page;
  readonly primaryAction: Locator;

  constructor(page: Page) {
    this.page = page;
    this.primaryAction = page.getByTestId('example-action');
  }

  async performPrimaryAction(): Promise<void> {
    await this.primaryAction.click();
  }
}
```
