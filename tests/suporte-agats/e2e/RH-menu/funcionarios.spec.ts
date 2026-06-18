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

    await test.step('Login e acesso RH > Funcionários', async () => {

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
            .locator('a[href="/employees"]')
            .click();

        await expect(page)
            .toHaveURL(url+'/employees');
    });

});


test('RH > Funcionários ', async ({ page }) => {

   
   await test.step('Validar criação de funcionário pelo botão New', async () => {

        await page
            .getByRole('link', { name: 'New' })
            .click();

        await expect(page)
            .toHaveURL(/employees\/create/);

        await page.goBack();

        await expect(page)
            .toHaveURL(/employees/);

    });



    await test.step('Validar exportação Excel', async () => {

        await page
            .getByRole('button', { name: /Exportar Excel/i })
            .click();


        await page
            .getByRole('button', { name: /Submeter/i })
            .click();

    });



    await test.step('Validar filtro Nacional', async () => {

        const nacional = page.locator('#two');

        await nacional.check();

        await expect(nacional)
            .toBeChecked();

    });



    await test.step('Validar filtro Expatriado', async () => {

        const expatriado = page.locator('#three');

        await expatriado.check();

        await expect(expatriado)
            .toBeChecked();

    });


    await test.step('Validar exportação Excel', async () => {

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


    await test.step('Validar exportação PDF', async () => {

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



    await test.step('Validar botão Print', async () => {

        await page
            .getByRole('button', { name: /Print/i })
            .click();

    });



    await test.step('Validar botão Copy', async () => {

        await page
            .getByRole('button', { name: /Copy/i })
            .click();

    });

    await test.step('Validar impressão do documento do funcionário ', async () => {

        await page.locator('a[href="employee/1/export"]').click();

    });



    await test.step('Pesquisar funcionário existente', async () => {

        const search = page.locator('input[type="search"]');

        await search.fill('a');
    });


});