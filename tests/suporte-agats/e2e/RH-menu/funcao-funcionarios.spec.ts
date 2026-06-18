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

    await test.step('Login e acesso RH > Função de Funcionários', async () => {

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
            .locator('a[href="/funcao-employees"]')
            .click();

        await expect(page)
            .toHaveURL(url+'/funcao-employees');
    });

});

test('RH > Funções de Funcionários', async ({ page }) => {

  await test.step('Validar carregamento da página', async () => {
    await expect(
      page.getByText('Gestão de Funcionários por Departamento')
    ).toBeVisible();

    await expect(
      page.locator('.card').first()
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: /Novo Departamento/i })
    ).toBeVisible();

    await expect(
      page.locator('input[placeholder="Filtrar departamentos..."]')
    ).toBeVisible();
  });

  await test.step('Pesquisar departamento', async () => {
    const searchDepartment = page.locator(
      'input[placeholder="Filtrar departamentos..."]'
    );
    await searchDepartment.fill('Financeira');
    await expect(searchDepartment).toHaveValue('Financeira');

    await searchDepartment.clear();
    await expect(searchDepartment).toHaveValue('');
  });

  await test.step('Botão Novo Departamento abre modal', async () => {
    await page.getByRole('button', { name: /Novo Departamento/i }).click();

    const modal = page.locator('#modalDepto');
    await expect(modal).toBeVisible();

    await expect(
      modal.locator('.modal-title')
    ).toContainText('Novo Departamento');

    await expect(
      modal.locator('input[placeholder="Ex: Recursos Humanos"]')
    ).toBeVisible();

    await modal.locator('button.close').click();
    await expect(modal).toBeHidden();
  });

  await test.step('Adicionar funcionário ao departamento abre modal', async () => {
    await page
      .getByRole('button', { name: /Adicionar/i })
      .first()
      .click();

    const modal = page.locator('#modalFuncionario');
    await expect(modal).toBeVisible();

    await expect(
      modal.locator('.modal-title')
    ).toContainText('Adicionar Funcionário');

    const selectColaboradores = modal.locator('select[multiple]');
    await expect(selectColaboradores).toBeVisible();
    const optionCount = await selectColaboradores.locator('option').count();
    expect(optionCount).toBeGreaterThan(0);

    await expect(
      modal.locator('.p-dropdown')
    ).toBeVisible();

    await expect(
      modal.locator('#checkPrincipal')
    ).toBeVisible();

    await modal.locator('button.close').click();
    await expect(modal).toBeHidden();
  });

  await test.step('Abrir menu de ações do departamento', async () => {
    await page
      .locator('.card-header .fa-ellipsis-v')
      .first()
      .click();

    await expect(page.getByText('Editar Departamento').first()).toBeVisible();
    await expect(page.getByText('Eliminar Departamento').first()).toBeVisible();

    await page.keyboard.press('Escape');
  });

  await test.step('Pesquisar funcionário no departamento', async () => {
    const searchEmployee = page
      .locator('input[placeholder="Pesquisar funcionário..."]')
      .first();

    await searchEmployee.fill('Alberto');
    await expect(searchEmployee).toHaveValue('Alberto');

    await searchEmployee.clear();
    await expect(searchEmployee).toHaveValue('');
  });

  await test.step('Validar departamento com funcionários atribuídos', async () => {
    const direccaoGeral = page.locator('.card').filter({
      hasText: 'Direcção Geral'
    }).first();

    await expect(direccaoGeral).toBeVisible();
    await expect(
      direccaoGeral.locator('small.text-muted').first()
    ).toContainText('1 funcionário(s)');

    await expect(
      direccaoGeral.locator('.employee-item')
    ).toBeVisible();

    await expect(
      direccaoGeral.locator('small.text-muted').last()
    ).toContainText('CEO');

    await expect(
      direccaoGeral.locator('.badge-warning')
    ).toContainText('Principal');
  });

  await test.step('Abrir menu de acções de funcionário', async () => {
    const direccaoGeral = page.locator('.card').filter({
      hasText: 'Direcção Geral'
    }).first();

    await direccaoGeral
      .locator('.employee-item .fa-ellipsis-v')
      .first()
      .click();

    await expect(page.getByText('Editar Função').first()).toBeVisible();
    await expect(page.getByText('Tornar Principal').first()).toBeVisible();
    await expect(page.getByText('Remover do Depto').first()).toBeVisible();

    await page.keyboard.press('Escape');
  });

});