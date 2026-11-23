import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the header section with all elements', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();

    const nav = header.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav.getByRole('link', { name: 'Library' })).toHaveAttribute('href', '/library');
    await expect(nav.getByRole('link', { name: 'Why SparkEd' })).toHaveAttribute('href', '#why-sparked');
    await expect(nav.getByRole('link', { name: 'For schools' })).toHaveAttribute('href', '#for-schools');

    const loginLink = header.getByRole('link', { name: 'Log in' });
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute('href', '/auth/login');

    const signupLink = header.getByRole('link', { name: 'Sign up' });
    await expect(signupLink).toBeVisible();
    await expect(signupLink).toHaveAttribute('href', '/auth/signup');
  });

  test('should display the hero section with dynamic content', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'A library for the whole school.' })).toBeVisible();
    await expect(page.getByText('Keep books, videos, and lessons together.')).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Make good resources easier to find.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Keep things organized' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Use different formats' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Learn beyond class' })).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Made for the way schools teach.' })).toBeVisible();
    await expect(page.getByRole('heading', { name: "Learning doesn't end at the classroom door." })).toBeVisible();
  });

  test('should have working navigation and theme toggle', async ({ page }) => {
    // Signed-out visitors are sent to login from the primary CTA.
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL('/auth/login');

    await page.goto('/');
    await page.locator('header a[href="/"]').click();
    await expect(page).toHaveURL('/');

    const themeToggle = page.getByRole('button', { name: 'Toggle theme' });
    await expect(themeToggle).toBeVisible();
    // Retry the click in case it lands before hydration attaches the handler.
    await expect(async () => {
      await themeToggle.click();
      await expect(page.locator('html')).toHaveClass(/dark/, { timeout: 1000 });
    }).toPass();
  });

  test('should display the footer section with all elements', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    const nav = footer.getByRole('navigation', { name: 'Footer navigation' });
    await expect(nav.getByRole('link', { name: 'Library' })).toHaveAttribute('href', '/library');

    const githubLink = nav.getByRole('link', { name: 'GitHub' });
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/sparkeduab/sparked-next');

    const statusLink = nav.getByRole('link', { name: 'System status' });
    await expect(statusLink).toBeVisible();
    await expect(statusLink).toHaveAttribute('href', 'https://sparked.instatus.com/');

    await expect(footer.getByText(/© \d{4} SparkEd\. All rights reserved\./)).toBeVisible();
  });
});
