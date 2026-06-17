import { test, expect } from '@playwright/test';
import env from 'dotenv';
import { auth } from '../helpers/login.helper';

env.config();

test('Suporte Agats: Teste de Login', async ({ page }) => {

    const username = String(process.env.OGD_USERNAME);
    const password = String(process.env.OGD_PASSWORD);
    const company = String(process.env.OGD_COMPANY);
    const url = String(process.env.OGD_URL);

    await page.goto(url);
    await auth(page, username, password, company, url);    
    await page.pause();
});