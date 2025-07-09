import path from 'node:path';

import { expect, test } from '../../helpers/fixtures.ts';
import { PixOrgaPage } from '../../pages/pix-orga/PixOrgaPage.ts';

test('should display students', async ({ pixOrgaAdminContext }) => {
  const page = await pixOrgaAdminContext.newPage();
  await page.goto(process.env.PIX_ORGA_URL as string);
  await test.step('Import students', async () => {
    const orgaPage = new PixOrgaPage(page);
    await orgaPage.selectOrganization('Orga sup');
    await page.getByRole('link', { name: 'Étudiants' }).click();
    await page.getByRole('link', { name: 'Importer' }).click();
    await page.getByRole('button', { name: 'Importer une nouvelle liste' }).click();
    await page.getByText('Je confirme avoir bien').click();
    await page.getByRole('button', { name: 'Oui, je remplace' }).click();
    await page
      .getByRole('textbox', { name: 'Oui, je remplace' })
      .setInputFiles(path.join(import.meta.dirname, '..', '..', 'fixtures', 'sup-ok.csv'));

    const hasLoader = await page.locator('.app-loader').isVisible();
    if (hasLoader) {
      await page.waitForSelector('.app-loader', { state: 'detached' });
    }

    await page.getByRole('link', { name: 'Étudiants' }).click();
    await orgaPage.waitForUploadSuccess(page);

    await expect(
      page.getByRole('paragraph').filter({ hasText: 'Les participants ont bien été importés' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Étudiants (3)' })).toBeVisible();
    await expect(page.getByRole('table', { name: 'Tableau des étudiants trié' })).toBeVisible();
  });
});
