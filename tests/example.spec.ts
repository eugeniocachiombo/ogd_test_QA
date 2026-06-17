import { test, expect } from '@playwright/test';
import env from 'dotenv';

env.config();

test('Teste no OGD', async ({ page }) => {
  console.log(process.env.OGD_USERNAME)
});