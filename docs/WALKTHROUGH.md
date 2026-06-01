# SauceDemo Flow Walkthrough

This walkthrough documents the current implementation of the Playwright suite across purchase and sorting coverage.

## Flow Summary

The suite currently includes:

- `tests/purchase.spec.ts` for the primary SauceDemo purchase path.
- `tests/sorting.spec.ts` for inventory sorting behavior.

## Step 1: Login Setup

`test.beforeEach` creates `LoginPage`, opens SauceDemo, logs in, and confirms the inventory page URL.

```typescript
const login = new LoginPage(page);
await login.gotoLoginPage();
await login.login('standard_user', 'secret_sauce');
await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
```

The underlying selectors live in `pages/login.ts`:

- `data-test="username"`
- `data-test="password"`
- role `button` with name `LOGIN`

## Step 2: Add Products

`InventoryPage.addToCart()` selects:

- Sauce Labs Backpack
- Sauce Labs Bike Light

It stores the expected product names, clicks both add-to-cart buttons, and opens the cart.

## Step 3: Verify Cart Contents

`InventoryPage.verifyProductsInCart()` checks that the first two cart product names match the selected products.

```typescript
await expect(this.cartFirstProduct).toHaveText(this.firstItemName);
await expect(this.cartSecondProduct).toHaveText(this.secondItemName);
```

## Step 4: Checkout

`InventoryPage.checkOut(...)` clicks checkout, fills first name, last name, and postal code, continues, and finishes the order.

The spec then verifies:

```typescript
await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
```

## Step 5: Logout

`LogoutPage.logoutUser()` opens the burger menu and clicks the logout link.

The spec verifies the final URL:

```typescript
await expect(page).toHaveURL('https://www.saucedemo.com/');
```

## Step 6: Sorting Verification

`tests/sorting.spec.ts` logs in via `test.beforeEach`, creates `InventoryPage`, and executes:

- `verifyNameAscendingSort()`
- `verifyNameDescendingSort()`
- `verifyPriceLowToHighSort()`
- `verifyPriceHighToLowSort()`

Each method changes the sort dropdown option and validates that the currently displayed inventory values match the expected sorted order.

## Configuration Notes

- `playwright.config.js` enables Chromium and Firefox.
- Tests run headless by default.
- `data-test` is configured as the test id attribute.
- Traces are retained on failure.
- The GitHub Actions workflow installs dependencies, installs Playwright browsers, runs the tests, and uploads the HTML report artifact.

## Recommended Improvements

- Add a visible checkout success message assertion in addition to the URL assertion.
- Add negative login coverage.
- Add cart remove-item coverage.
- Add npm scripts for common Playwright commands.
- Keep explicit async return types in page objects to satisfy lint rules.
