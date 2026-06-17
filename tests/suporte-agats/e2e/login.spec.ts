import { test, expect } from '@playwright/test';
import env from 'dotenv';
import { auth } from '../helpers/login.helper';

env.config();

test('Suporte Agats: Teste de Login', async ({ page }) => {

    const username = String(process.env.OGD_USERNAME);
    const password = String(process.env.OGD_PASSWORD);
    const company = String(process.env.OGD_COMPANY);

    await page.goto('https://ogd.operatecangola.com/');
    await auth(page, username, password, company);
    await page.pause();
});