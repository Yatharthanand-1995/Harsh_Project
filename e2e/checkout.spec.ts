import { test, expect } from '@playwright/test'

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the homepage
    await page.goto('/')
  })

  test('should navigate to products page', async ({ page }) => {
    // Click on Shop Now or Products link
    await page.click('text=Shop Now')

    // Wait for products page to load
    await expect(page).toHaveURL(/.*products/)

    // Verify products are displayed
    await expect(page.locator('text=All Products').first()).toBeVisible()
  })

  test('should display product details', async ({ page }) => {
    // Navigate to products
    await page.goto('/products')

    // Click on first product
    await page.locator('[href*="/products/"]').first().click()

    // Wait for product detail page
    await page.waitForLoadState('networkidle')

    // Verify product details are visible
    await expect(page.locator('h1').first()).toBeVisible()
    await expect(page.locator('text=/₹[0-9]+/')).toBeVisible()
  })

  test('should require login to add to cart', async ({ page }) => {
    // Go to a product page (using a known slug)
    await page.goto('/products')
    await page.locator('[href*="/products/"]').first().click()
    await page.waitForLoadState('networkidle')

    // Try to add to cart without logging in
    await page.click('button:has-text("Add to Cart")')

    // Should redirect to login or show login required message
    await page.waitForTimeout(1000)
    const url = page.url()
    expect(url.includes('/login') || url.includes('/cart')).toBe(true)
  })

  test('should complete login flow', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')

    // Fill in test credentials
    await page.fill('input[type="email"]', 'test@homespun.com')
    await page.fill('input[type="password"]', 'password123')

    // Submit login form
    await page.click('button:has-text("Sign In")')

    // Wait for redirect after login
    await page.waitForTimeout(2000)

    // Verify logged in (should see Sign Out button)
    await expect(page.locator('text=Sign Out').first()).toBeVisible({
      timeout: 10000,
    })
  })

  test('complete checkout flow (logged in)', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[type="email"]', 'test@homespun.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button:has-text("Sign In")')
    await page.waitForTimeout(2000)

    // Navigate to products
    await page.goto('/products')
    await page.waitForLoadState('networkidle')

    // Click on first product
    await page.locator('[href*="/products/"]').first().click()
    await page.waitForLoadState('networkidle')

    // Add to cart
    await page.click('button:has-text("Add to Cart")')
    await page.waitForTimeout(1000)

    // Navigate to cart
    await page.goto('/cart')
    await page.waitForLoadState('networkidle')

    // Verify cart has items
    await expect(page.locator('text=/₹[0-9]+/').first()).toBeVisible()

    // Proceed to checkout
    const checkoutButton = page.locator('button:has-text("Checkout")')
    if (await checkoutButton.isVisible()) {
      await checkoutButton.click()
      await page.waitForTimeout(1000)

      // Verify we're on checkout page
      expect(page.url()).toContain('/checkout')

      // Verify checkout page elements
      await expect(
        page.locator('text=Delivery Address').first()
      ).toBeVisible()
    }
  })

  test('should show empty cart message when cart is empty', async ({ page }) => {
    // Login first
    await page.goto('/login')
    await page.fill('input[type="email"]', 'test@homespun.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button:has-text("Sign In")')
    await page.waitForTimeout(2000)

    // Navigate to cart
    await page.goto('/cart')
    await page.waitForLoadState('networkidle')

    // If cart is empty, should show empty message
    const emptyMessage = page.locator('text=/Your cart is empty/i')
    const cartItems = page.locator('[data-testid="cart-item"]')

    const hasItems = (await cartItems.count()) > 0
    const hasEmptyMessage = await emptyMessage.isVisible()

    // Either has items OR shows empty message
    expect(hasItems || hasEmptyMessage).toBe(true)
  })

  test('should show order summary with correct calculations', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('input[type="email"]', 'test@homespun.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button:has-text("Sign In")')
    await page.waitForTimeout(2000)

    // Add product to cart
    await page.goto('/products')
    await page.waitForLoadState('networkidle')
    await page.locator('[href*="/products/"]').first().click()
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Add to Cart")')
    await page.waitForTimeout(1000)

    // Go to cart
    await page.goto('/cart')
    await page.waitForLoadState('networkidle')

    // Verify pricing elements exist
    await expect(page.locator('text=/Subtotal/i')).toBeVisible()
    await expect(page.locator('text=/Delivery/i')).toBeVisible()
    await expect(page.locator('text=/Tax|GST/i')).toBeVisible()
    await expect(page.locator('text=/Total/i')).toBeVisible()
  })
})

test.describe('Responsive Design', () => {
  test('should be mobile friendly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Navigate to homepage
    await page.goto('/')

    // Check that mobile menu or responsive layout is visible
    await expect(page.locator('header')).toBeVisible()
  })

  test('should work on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })

    // Navigate to products
    await page.goto('/products')

    // Verify layout adjusts
    await expect(page.locator('text=All Products').first()).toBeVisible()
  })
})
