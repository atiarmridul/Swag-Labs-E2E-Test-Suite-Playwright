# Test Guide

This document describes the current Playwright test suite and how to extend it.

## Current Specs

`tests/purchase.spec.ts` contains the complete happy-path purchase flow.

`tests/sorting.spec.ts` validates inventory sorting behavior for:

- Name ascending (`az`)
- Name descending (`za`)
- Price low to high (`lohi`)
- Price high to low (`hilo`)

Setup:

- Creates `LoginPage`.
- Navigates to SauceDemo.
- Logs in as `standard_user` with `secret_sauce`.
- Asserts the URL is `https://www.saucedemo.com/inventory.html`.

Test flow:

1. Creates `InventoryPage`.
2. Adds two products to the cart.
3. Verifies both products are listed in the cart.
4. Completes checkout with first name, last name, and postal code.
5. Asserts checkout completion URL.
6. Creates `LogoutPage`.
7. Logs out.
8. Asserts the login page URL.

## Commands

```bash
# One-time browser install on a new machine
npx playwright install

# Run all configured projects
npx playwright test

# Run a single browser project
npx playwright test --project=chromium
npx playwright test --project=firefox

# Run a specific spec file
npx playwright test tests/purchase.spec.ts
npx playwright test tests/sorting.spec.ts

# Run with Playwright Inspector
npx playwright test --debug

# Run in headed mode
npx playwright test --headed

# Open HTML report
npx playwright show-report
```

## Browser Projects

Configured in `playwright.config.js`:

- `chromium`
- `firefox`

Execution currently produces 4 test runs total (2 spec files x 2 browser projects).

Commented examples exist for WebKit, mobile Chrome, mobile Safari, Edge, and branded Chrome.

## Writing New Tests

- Add new page object methods before adding repeated UI actions to specs.
- Keep spec steps at user-intent level.
- Use `test.beforeEach` for shared login setup only when every test in the file needs an authenticated session.
- Add direct assertions for the behavior under test.
- Prefer Playwright auto-waiting and locator assertions over fixed sleeps.

## Reports And Traces

- HTML report output goes to `playwright-report/`.
- Test artifacts go to `test-results/`.
- Traces are retained on failure by current config.
