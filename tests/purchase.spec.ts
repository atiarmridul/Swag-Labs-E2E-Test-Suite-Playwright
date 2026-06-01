import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login';
import { LogoutPage } from '../pages/logout';
import { InventoryPage } from '../pages/inventory';

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.gotoLoginPage();
  await login.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

test.describe('SauceDemo Purchase Flow Test', () => {
  test('User should complete purchase successfully', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addToCart(); // Add products to cart and navigate to cart page
    await inventory.verifyProductsInCart(); // Verify correct products are in the cart
    await inventory.checkOut('Md.Atiar', 'Rahman', '123'); // Fill checkout info and complete purchase
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html'); // Verify purchase completion

    const logout = new LogoutPage(page);
    await logout.logoutUser();
    await expect(page).toHaveURL('https://www.saucedemo.com/'); // Verify logout successful
  });
});
