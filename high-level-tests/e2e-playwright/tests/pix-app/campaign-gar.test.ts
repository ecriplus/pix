import { getGarTokenForNewUser } from '../../helpers/auth.js';
import { expect, test } from '../../helpers/fixtures.js';
import { PixOrgaPage } from '../../pages/pix-orga/index.js';

test('creates an account from GAR', async ({ page, pixOrgaMemberContext }) => {
  let campaignCode: string | null;

  await test.step('create a campaign', async () => {
    const pixOrgaPage = await pixOrgaMemberContext.newPage();
    await pixOrgaPage.goto(process.env.PIX_ORGA_URL as string);
    await test.step('creates the campaign', async () => {
      await pixOrgaPage.getByRole('link', { name: 'Créer une campagne' }).click();
      const createCampaignPage = new PixOrgaPage(pixOrgaPage);
      await createCampaignPage.createEvaluationCampaign({
        campaignName: 'Test GAR account creation',
        targetProfileName: 'PC pour Playwright',
      });
      campaignCode = await pixOrgaPage.locator('dd.campaign-header-title__campaign-code > span').textContent();
    });
  });

  await test.step('Log with GAR as new user using the campaign code', async function () {
    const garUserToken = getGarTokenForNewUser('marie', 'toupie');
    await page.goto(process.env.PIX_APP_URL + `/campagnes/?externalUser=${garUserToken}`);
    await expect(page.getByRole('heading', { name: 'Saisissez votre code' })).toBeVisible();

    await page.getByLabel('Saisir votre code pour').fill(campaignCode as string);
    await page.getByRole('button', { name: 'Accéder au parcours' }).click();
    await expect(page.getByRole('heading', { name: 'Commencez votre parcours Pix' })).toBeVisible();
  });
});
