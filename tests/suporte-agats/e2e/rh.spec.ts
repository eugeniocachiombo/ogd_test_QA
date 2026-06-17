import { test, expect } from '@playwright/test';
import env from 'dotenv';
import { auth } from '../helpers/login.helper';
import { openRH } from '../helpers/rh.helper';

env.config();

const username = String(process.env.OGD_USERNAME);
const password = String(process.env.OGD_PASSWORD);
const company = String(process.env.OGD_COMPANY);
const url = String(process.env.OGD_URL);

test('Suporte Agats: Abrir Menu RH ', async ({ page }) => {

    await page.goto(url);
    await auth(page, username, password, company, url);    

    await openRH(page);
    await page.pause();
});
