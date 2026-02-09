import { expect, test } from '../../fixtures/certification/index.ts';
import { PIX_CERTIF_PRO_DATA } from '../../helpers/db-data.ts';
import {
  ChallengePage,
  FinalCheckpointPage,
  IntermediateCheckpointPage,
  LoginPage,
  StartCampaignPage,
} from '../../pages/pix-app/index.ts';
import { PixOrgaPage } from '../../pages/pix-orga/index.ts';
import data from './data.json' with { type: 'json' };

test('make user certifiable and ready for CLEA', async ({ page }) => {
  test.slow();

  await page.goto(process.env.PIX_ORGA_URL as string);
  const pixOrgaPage = new PixOrgaPage(page);
  await pixOrgaPage.login(PIX_CERTIF_PRO_DATA.email, PIX_CERTIF_PRO_DATA.rawPassword);
  let campaignCode: string | null;
  await test.step('creates the CLEA campaign', async () => {
    await page.getByRole('link', { name: 'Campagnes', exact: true }).click();
    await page.getByRole('link', { name: 'Créer une campagne' }).click();
    await pixOrgaPage.createEvaluationCampaign({
      campaignName: 'CLEA campagne',
      targetProfileName: 'Parcours complet CléA numérique',
    });
    campaignCode = await page.locator('dd.campaign-header-title__campaign-code > span').textContent();
  });

  await test.step('user enters campaign and answers correctly all the way to the end', async () => {
    await page.goto(process.env.PIX_APP_URL as string);
    const loginPage = new LoginPage(page);
    await loginPage.signup(
      data.certifiableUser.firstName,
      data.certifiableUser.lastName,
      data.certifiableUser.email,
      data.certifiableUser.rawPassword,
    );
    await page.getByRole('link', { name: "J'ai un code" }).click();
    const startCampaignPage = new StartCampaignPage(page);
    await startCampaignPage.goToFirstChallenge(campaignCode as string);
    while (!page.url().endsWith('/checkpoint?finalCheckpoint=true')) {
      const challengePage = new ChallengePage(page);
      await challengePage.setRightOrWrongAnswer(true);
      await challengePage.validateAnswer();

      if (page.url().includes('/checkpoint') && !page.url().includes('finalCheckpoint=true')) {
        const checkpointPage = new IntermediateCheckpointPage(page);
        await checkpointPage.goNext();
      }
    }
    const finalCheckpointPage = new FinalCheckpointPage(page);
    await finalCheckpointPage.goToResults();
    await expect(page.getByRole('paragraph').filter({ hasText: 'Vos résultats ont été envoyés' })).toBeVisible();
  });
});
