# SauceDemo Test Case Flows

This document tracks the test case flows currently automated and executed in this repository.

## Scope

- App: https://www.saucedemo.com/
- Spec files: `tests/purchase.spec.ts`, `tests/sorting.spec.ts`
- Page objects: `pages/login.ts`, `pages/inventory.ts`, `pages/logout.ts`
- Browser projects: Chromium, Firefox

## TC-001: Standard User Login

- Status: Automated and executed
- Objective: Validate that a valid standard user can log in and reach inventory.
- Preconditions:
  - User is on SauceDemo login page.
  - Credentials are valid: `standard_user` / `secret_sauce`.
- Steps:
  1. Navigate to SauceDemo login page.
  2. Fill username and password.
  3. Click login.
- Expected result:
  - URL becomes `https://www.saucedemo.com/inventory.html`.

## TC-002: Add Two Products To Cart

- Status: Automated and executed
- Objective: Validate that selected products can be added from inventory.
- Preconditions:
  - User is logged in and on inventory page.
- Steps:
  1. Click `Add to cart` for Sauce Labs Backpack.
  2. Verify the backpack button changes to `Remove`.
  3. Click `Add to cart` for Sauce Labs Bike Light.
  4. Verify the bike light button changes to `Remove`.
  5. Click cart icon.
- Expected result:
  - Both items are added and user is navigated to cart page.

## TC-003: Verify Cart Contents

- Status: Automated and executed
- Objective: Validate that the expected items are present in cart.
- Preconditions:
  - Two products were added from inventory.
  - User is on cart page.
- Steps:
  1. Read first cart item name.
  2. Read second cart item name.
  3. Compare with expected names:
     - Sauce Labs Backpack
     - Sauce Labs Bike Light
- Expected result:
  - Cart shows both expected product names.

## TC-004: Complete Checkout

- Status: Automated and executed
- Objective: Validate successful checkout completion for cart items.
- Preconditions:
  - User is on cart page with expected items.
- Steps:
  1. Click `Checkout`.
  2. Fill First Name: `Md.Atiar`.
  3. Fill Last Name: `Rahman`.
  4. Fill Postal Code: `123`.
  5. Click `Continue`.
  6. Click `Finish`.
- Expected result:
  - URL becomes `https://www.saucedemo.com/checkout-complete.html`.

## TC-005: Logout After Purchase

- Status: Automated and executed
- Objective: Validate user can log out after completing purchase flow.
- Preconditions:
  - User has completed checkout.
- Steps:
  1. Open burger menu.
  2. Click logout.
- Expected result:
  - URL becomes `https://www.saucedemo.com/`.

## End-To-End Coverage Summary

- Test name: `User should complete purchase successfully`
- File: `tests/purchase.spec.ts`
- Flow includes: login -> add products -> verify cart -> checkout -> logout.

## TC-006: Name Sort Ascending (A to Z)

- Status: Automated and executed
- Objective: Validate inventory names sort alphabetically ascending.
- Preconditions:
  - User is logged in and on inventory page.
- Steps:
  1. Select sort option `Name (A to Z)`.
  2. Read visible inventory item names.
  3. Compare displayed order against ascending alphabetical order.
- Expected result:
  - Item names are displayed in ascending alphabetical order.

## TC-007: Name Sort Descending (Z to A)

- Status: Automated and executed
- Objective: Validate inventory names sort alphabetically descending.
- Preconditions:
  - User is logged in and on inventory page.
- Steps:
  1. Select sort option `Name (Z to A)`.
  2. Read visible inventory item names.
  3. Compare displayed order against descending alphabetical order.
- Expected result:
  - Item names are displayed in descending alphabetical order.

## TC-008: Price Sort Low to High

- Status: Automated and executed
- Objective: Validate inventory prices sort from lowest to highest.
- Preconditions:
  - User is logged in and on inventory page.
- Steps:
  1. Select sort option `Price (low to high)`.
  2. Read visible inventory item prices.
  3. Compare displayed order against ascending numeric order.
- Expected result:
  - Item prices are displayed in ascending numeric order.

## TC-009: Price Sort High to Low

- Status: Automated and executed
- Objective: Validate inventory prices sort from highest to lowest.
- Preconditions:
  - User is logged in and on inventory page.
- Steps:
  1. Select sort option `Price (high to low)`.
  2. Read visible inventory item prices.
  3. Compare displayed order against descending numeric order.
- Expected result:
  - Item prices are displayed in descending numeric order.

## Sorting Coverage Summary

- Test name: `User should do different types of sorting`
- File: `tests/sorting.spec.ts`
- Flow includes: name A->Z -> name Z->A -> price low->high -> price high->low.
