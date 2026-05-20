import { test, expect } from '@playwright/test';

test.describe('PWA smoke', () => {
  test('home loads and language controls exist', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header h1')).toContainText('Mandarin Pathways');
    await expect(page.locator('header .language-btn')).toHaveCount(3);
  });

  test('lesson text asset is reachable', async ({ request }) => {
    const res = await request.get('/text_files/day1_zh.txt');
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body.length).toBeGreaterThan(20);
  });

  test('writing asset is reachable', async ({ request }) => {
    const res = await request.get('/writing_files/character_basic_strokes_en.txt');
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body.length).toBeGreaterThan(20);
  });

  test('day lesson shell renders', async ({ page }) => {
    await page.goto('/day.html?day=1&lang=zh', { waitUntil: 'load' });
    await expect(page.locator('#text-content')).toBeAttached();
    await expect(page.locator('#complete-btn')).toBeVisible();
  });

  test('writing shell renders with URL selection', async ({ page }) => {
    await page.goto('/writing.html?type=character&level=Basic%20Strokes&lang=en', {
      waitUntil: 'load',
    });
    await expect(page.locator('#writing-content')).toBeAttached();
    await expect(page.locator('#complete-btn')).toBeVisible();
  });
});
