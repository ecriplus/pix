import { expect } from '@playwright/test';

import { useLoggedUser } from '../helpers/auth.js';
import { databaseBuilder } from '../helpers/db.js';
import { test } from '../helpers/fixtures.js';

const loggedUserId = useLoggedUser('pix-orga');

test('Students management for a sco organization', async ({ page }) => {
  await _buildTestData();

  await page.goto('/');

  await page.getByRole('link', { name: 'Étudiants' }).click();
  await expect(page.getByRole('heading', { name: 'Étudiant (1)' })).toBeVisible();
  await expect(page.getByRole('table', { name: 'Tableau des étudiants trié' })).toBeVisible();
});

async function _buildTestData() {
  // SCO organization
  const organization = databaseBuilder.factory.buildOrganization({
    type: 'SUP',
    isManagingStudents: true,
  });

  // Member of the organization
  const member = databaseBuilder.factory.buildUser.withMembership({
    id: loggedUserId,
    organizationId: organization.id,
    role: 'MEMBER',
  });
  const legalDocument = databaseBuilder.factory.buildLegalDocumentVersion({ type: 'TOS', service: 'pix-orga' });
  databaseBuilder.factory.buildLegalDocumentVersionUserAcceptance({
    legalDocumentVersionId: legalDocument.id,
    userId: member.id,
  });

  // Learner linked to user with PIX authentication method
  const learnerPixAuth = databaseBuilder.factory.buildUser.withRawPassword();
  databaseBuilder.factory.buildOrganizationLearner({
    organizationId: organization.id,
    firstName: learnerPixAuth.firstName,
    lastName: learnerPixAuth.lastName,
    userId: learnerPixAuth.id,
  });

  await databaseBuilder.commit();
}
