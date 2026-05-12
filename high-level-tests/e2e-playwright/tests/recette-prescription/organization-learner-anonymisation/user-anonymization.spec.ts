import { expect, test } from '../../../fixtures/index.ts';
import { PIX_ADMIN_SUPPORT_DATA } from '../../../helpers/db-data.ts';
import { LoginPage as AdminLoginPage } from '../../../pages/pix-admin/index.ts';
import { LoginPage as AppLoginPage } from '../../../pages/pix-app/index.ts';
import { HomePage as PixOrgaHomePage, ParticipantsPage } from '../../../pages/pix-orga/index.ts';
// deso c moi, je me suis permise car je sais que tu n'utilises plus superAdminContext de toute façon, lors du merge accepte
// tous tes changements
test(`user is anonymized`, async ({ page: pixAppPage, pixOrgaMemberContext }) => {
  test.slow();

  await test.step('User can access to their account on PixApp', async function () {
    await pixAppPage.goto(process.env.PIX_APP_URL as string);
    const loginPage = new AppLoginPage(pixAppPage);
    await loginPage.login(`jambon.beurre@example.net`, 'Coucoulesdevs44');

    await expect(pixAppPage.getByText('Bonjour Jambon')).toBeVisible();
  });

  const pixAdminPage = pixAppPage;
  await pixAdminPage.goto(process.env.PIX_ADMIN_URL as string);
  const adminLoginPage = new AdminLoginPage(pixAdminPage);
  const adminHomepage = await adminLoginPage.login(PIX_ADMIN_SUPPORT_DATA.email, PIX_ADMIN_SUPPORT_DATA.rawPassword);

  await test.step('Anonymize user', async () => {
    const userListPage = await adminHomepage.goToUsersTab();
    const userDetailsPage = await userListPage.goToUserDetails('Jambon', 'jambon.beurre@example.net');
    await userDetailsPage.anonymize();

    await expect(
      pixAdminPage.getByText(
        `Utilisateur anonymisé par ${PIX_ADMIN_SUPPORT_DATA.firstName} ${PIX_ADMIN_SUPPORT_DATA.lastName}.`,
      ),
    ).toBeVisible();
  });

  // Impacts dans PixAdmin
  await test.step('Admin can still access to campaign participation data', async function () {
    const organizationsListPage = await adminHomepage.goToOrganizationsTab();
    const organizationDetailsPage = await organizationsListPage.goToOrganizationDetails('Orga Pro');
    await organizationDetailsPage.goToCampaign('test playwright');

    await expect(
      pixAdminPage.locator('table tbody tr', { has: pixAdminPage.getByText('Jambon Beurre') }).getByRole('link'),
    ).not.toBeVisible();
  });

  // Impacts dans PixApp
  // TODO: Retirer le skip une fois le ticket correctif implémenté côté Accès
  await test.step.skip('User cannot access their account on PixApp anymore', async function () {
    await pixAppPage.goto(process.env.PIX_APP_URL as string);
    const loginPage = new AppLoginPage(pixAppPage);
    await loginPage.login(`jambon.beurre@example.net`, 'Coucoulesdevs44');
    await expect(
      pixAppPage.getByText("L'adresse e-mail ou l'identifiant et/ou le mot de passe saisis sont incorrects."),
    ).toBeVisible();
  });

  // Impacts dans PixOrga
  await test.step('Organization learner related to user should not be altered', async function () {
    const pixOrgaPage = await pixOrgaMemberContext.newPage();
    await pixOrgaPage.goto(process.env.PIX_ORGA_URL as string);
    const homePage = new PixOrgaHomePage(pixOrgaPage);

    await homePage.goToParticipants();
    await expect(pixOrgaPage.getByText('Jambon')).toBeVisible();

    const participants = new ParticipantsPage(pixOrgaPage);
    await participants.goToParticipant('Jambon');
    await expect(pixOrgaPage.getByText('test playwright')).toBeVisible();
  });
});
