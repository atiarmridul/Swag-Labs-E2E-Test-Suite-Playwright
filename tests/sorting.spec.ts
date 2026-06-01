import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { InventoryPage } from '../pages/inventory';

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.gotoLoginPage();
  await login.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

test.describe('Sorting Function Verification', () => {
  test('User should do different types of sorting', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.verifyNameAscendingSort();
    await inventory.verifyNameDescendingSort();
    await inventory.verifyPriceLowToHighSort();
    await inventory.verifyPriceHighToLowSort();
  });
});
