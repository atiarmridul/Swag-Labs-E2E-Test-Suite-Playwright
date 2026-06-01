import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;

  // Inventory locators
  readonly firstAddToCartBtn: Locator;
  readonly secondAddToCartBtn: Locator;
  readonly firstRemoveFromCartBtn: Locator;
  readonly secondRemoveFromCartBtn: Locator;
  readonly cartIcon: Locator;

  // Cart locators
  readonly cartFirstProduct: Locator;
  readonly cartSecondProduct: Locator;
  readonly checkoutBtn: Locator;
  readonly sortDropdown: Locator;
  readonly productNames: Locator;
  readonly productPrice: Locator;

  // Checkout locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueBtn: Locator;
  readonly finishBtn: Locator;

  // Product names
  firstItemName!: string;
  secondItemName!: string;

  constructor(page: Page) {
    // Initialize page reference and locators used across inventory, cart, and checkout flows.
    this.page = page;

    // Inventory page
    this.firstAddToCartBtn = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    this.secondAddToCartBtn = page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');
    this.firstRemoveFromCartBtn = page.locator('[data-test="remove-sauce-labs-backpack"]');
    this.secondRemoveFromCartBtn = page.locator('[data-test="remove-sauce-labs-bike-light"]');
    this.cartIcon = page.locator('.shopping_cart_link');

    // Cart page
    this.cartFirstProduct = page.locator('.inventory_item_name').nth(0);
    this.cartSecondProduct = page.locator('.inventory_item_name').nth(1);
    this.checkoutBtn = page.locator('[data-test="checkout"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.productNames = page.locator('.inventory_item_name');
    this.productPrice = page.locator('.inventory_item_price');

    // Checkout page
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueBtn = page.locator('[data-test="continue"]');
    this.finishBtn = page.locator('[data-test="finish"]');
  }

  async verifyNameAscendingSort(): Promise<void> {
    // Select name ascending (A to Z) and assert visible product names are sorted ascending.
    await this.sortDropdown.selectOption('az');
    const actualNames = await this.productNames.allTextContents();
    const expectedNames = [...actualNames].sort();
    expect(actualNames).toEqual(expectedNames);
  }
  async verifyNameDescendingSort(): Promise<void> {
    // Select name descending (Z to A) and assert visible product names are sorted descending.
    await this.sortDropdown.selectOption('za');
    const actualNames = await this.productNames.allTextContents();
    const expectedNames = [...actualNames].sort().reverse();
    expect(actualNames).toEqual(expectedNames);
  }
  async verifyPriceLowToHighSort(): Promise<void> {
    // Select price low-to-high and assert visible product prices are sorted ascending.
    await this.sortDropdown.selectOption('lohi');
    const actualPrices = (await this.productPrice.allTextContents()).map((price) =>
      Number(price.replace('$', '')),
    );
    const expectedPrices = [...actualPrices].sort((a, b) => a - b);
    expect(actualPrices).toEqual(expectedPrices);
  }
  async verifyPriceHighToLowSort(): Promise<void> {
    // Select price high-to-low and assert visible product prices are sorted descending.
    await this.sortDropdown.selectOption('hilo');
    const actualPrices = (await this.productPrice.allTextContents()).map((price) =>
      Number(price.replace('$', '')),
    );
    const expectedPrices = [...actualPrices].sort((a, b) => b - a);
    expect(actualPrices).toEqual(expectedPrices);
  }

  async addToCart(): Promise<void> {
    // Add two target products, verify state changes to "Remove", then open the cart.
    this.firstItemName = 'Sauce Labs Backpack';
    this.secondItemName = 'Sauce Labs Bike Light';

    await this.firstAddToCartBtn.click();
    await expect(this.firstRemoveFromCartBtn).toHaveText('Remove');
    await this.secondAddToCartBtn.click();
    await expect(this.secondRemoveFromCartBtn).toHaveText('Remove');

    await this.cartIcon.click();
  }

  async verifyProductsInCart(): Promise<void> {
    // Confirm cart item names match the products selected in addToCart().
    await expect(this.cartFirstProduct).toHaveText(this.firstItemName);
    await expect(this.cartSecondProduct).toHaveText(this.secondItemName);
  }

  async checkOut(firstName: string, lastName: string, postalCode: string): Promise<void> {
    // Complete checkout details and finish the order.
    await this.checkoutBtn.click();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueBtn.click();
    await this.finishBtn.click();
  }
}
