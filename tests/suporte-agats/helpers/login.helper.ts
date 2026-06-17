import { Page } from '@playwright/test';

export async function auth(page:Page, username:string, password:string, company:string, url:string) {

    await page.fill("#inputUsername", username);
    await page.fill("#inputPassword", password);

    await page.locator("#empresaSelect").click();
    await page.locator(".p-dropdown-item")
        .filter({ hasText: company })
        .click();

    await Promise.all([
        page.waitForURL(url+'/home'),
        page.locator("button[type='submit']").click()
    ]);
}