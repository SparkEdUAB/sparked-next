import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the header section with all elements', async ({ page }) => {
    const loginButton = page.getByText('Log in');
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();
  });

  test('should display the hero section with dynamic content', async ({ page }) => {
    await expect(page.getByText('Your digital library')).toBeVisible();
    await expect(page.getByText('Easily manage your school educational materials')).toBeVisible();

    await expect(page.getByText('Digital Content Hub')).toBeVisible();
    await expect(page.getByText('Collaborative Learning')).toBeVisible();
    await expect(page.getByText('Course Management')).toBeVisible();
    await expect(page.getByText('24/7 Access')).toBeVisible();
  });

  test('should have working navigation and theme toggle', async ({ page }) => {
    const libraryLink = page.getByText('Get Started');
    await libraryLink.click();
    await expect(libraryLink).toBeEnabled();

    const logoLink = page.locator('a[href="/"]');
    await logoLink.click();
    await expect(page).toHaveURL('/');

    const themeToggle = page.locator('.theme-toggle');
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('should display the footer section with all elements', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    await expect(page.getByText('Follow us')).toBeVisible();
    await expect(page.getByText('Legal')).toBeVisible();

    const githubLink = page.getByText('Github');
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/sparkeduab/sparked-next');

    const privacyLink = page.getByText('Privacy Policy');
    await expect(privacyLink).toBeVisible();

    // Check copyright text
    await expect(page.getByText(/© 2025.*SparkEd™.*All Rights Reserved/)).toBeVisible();
  });
});
