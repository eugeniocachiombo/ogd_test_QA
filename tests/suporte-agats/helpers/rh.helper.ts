import { Page } from '@playwright/test';

export async function openRH(page:Page) {
   await page.locator('li.nav-item')
    .filter({ hasText: 'RH' })
    .first()
    .locator('a.nav-link')
    .click();
}
