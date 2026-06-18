import { test, expect } from '@playwright/test';
import env from 'dotenv';
import { auth } from '../../helpers/login.helper';
import { openRH } from '../../helpers/rh.helper';

env.config();

const username = process.env.OGD_USERNAME!;
const password = process.env.OGD_PASSWORD!;
const company = process.env.OGD_COMPANY!;
const url = process.env.OGD_URL!;


test.beforeEach(async ({ page }) => {

    await test.step('Login e acesso RH > Categorias', async () => {

        await page.goto(url);

        await auth(
            page,
            username,
            password,
            company,
            url
        );

        await openRH(page);

        await page
            .locator('a[href="/categorias"]')
            .click();

        await expect(page)
            .toHaveURL(url+'/categorias');
    });

});


test('RH > Categorias', async ({ page }) => {

   
   await test.step('Botão New', async () => {

        await page
            .getByRole('link', { name: 'New' })
            .click();        

        await expect(page)
            .toHaveURL(/categorias\/create/);

        await page.goBack();

        await expect(page)
            .toHaveURL(/categorias/);

    });



    await test.step('Botão exportação Excel', async () => {

        await page
            .getByRole('button', { name: /Excel/i })
            .click();

        const download = page.waitForEvent('download');

        const file = await download;


        expect(
            file.suggestedFilename(),
            'Deve gerar um arquivo PDF'
        )
        .toMatch(/\.xlsx$/); 

    });



    await test.step('Botão exportação PDF', async () => {

        await page
            .getByRole('button', { name: /PDF/i })
            .click();

        const download = page.waitForEvent('download');

        const file = await download;


        expect(
            file.suggestedFilename(),
            'Deve gerar um arquivo PDF'
        )
        .toMatch(/\.pdf$/); 

    });



    await test.step('Botão Print', async () => {

        await page
            .getByRole('button', { name: /Print/i })
            .click(); 

    });



    await test.step('Botão Copy', async () => {

        await page
            .getByRole('button', { name: /Copy/i })
            .click(); 

    });

    await test.step('Botão visualizar categoria', async () => {

        await page.locator('a[href="categorias/15"]').click();
        await page.waitForLoadState('networkidle');

        await page.goBack();

        await expect(page)
            .toHaveURL(/categorias/); 
    });



    await test.step('Pesquisar categoria existente', async () => {

        const search = page.locator('input[type="search"]');

        await search.fill('a');
    });


});