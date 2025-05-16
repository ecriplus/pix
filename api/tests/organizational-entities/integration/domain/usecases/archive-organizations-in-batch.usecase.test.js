import { ArchiveOrganizationsInBatchError } from '../../../../../src/organizational-entities/domain/errors.js';
import { usecases } from '../../../../../src/organizational-entities/domain/usecases/index.js';
import { OrganizationInvitation } from '../../../../../src/team/domain/models/OrganizationInvitation.js';
import { catchErr, databaseBuilder, expect, knex, sinon } from '../../../../test-helper.js';

describe('Integration | Organizational Entities | Domain | UseCase | archive-organizations-in-batch', function () {
  let now, clock;

  beforeEach(function () {
    now = new Date('2025-01-01');
    clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
  });

  afterEach(function () {
    clock.restore();
  });

  context('success', function () {
    it('archives the organizations properly', async function () {
      // given
      const organization1 = databaseBuilder.factory.buildOrganization();
      databaseBuilder.factory.buildOrganizationInvitation({
        organizationId: organization1.id,
        status: OrganizationInvitation.StatusType.PENDING,
      });
      databaseBuilder.factory.buildCampaign({
        organizationId: organization1.id,
        archivedAt: null,
      });
      databaseBuilder.factory.buildMembership({
        organizationId: organization1.id,
        disabledAt: null,
      });

      const organization2 = databaseBuilder.factory.buildOrganization();
      databaseBuilder.factory.buildOrganizationInvitation({
        organizationId: organization2.id,
        status: OrganizationInvitation.StatusType.PENDING,
      });
      databaseBuilder.factory.buildCampaign({
        organizationId: organization2.id,
        archivedAt: null,
      });
      databaseBuilder.factory.buildMembership({
        organizationId: organization2.id,
        disabledAt: null,
      });

      const user = databaseBuilder.factory.buildUser();

      const organizationIds = [organization1.id, organization2.id];

      await databaseBuilder.commit();

      // when
      await usecases.archiveOrganizationsInBatch({
        organizationIds,
        userId: user.id,
      });

      // then
      await _assertOrganizationIsArchived({ archivedOrganizationId: organization1.id, user, archivedAt: now });
      await _assertPendingInvitationsAreCanceled({
        archivedOrganizationId: organization1.id,
        updatedAt: now,
      });
      await _assertCampaignAreArchived({ organizationId: organization1.id, archivedAt: now });
      await _assertMembershipAreDisabled({ organizationId: organization1.id, disabledAt: now });

      await _assertOrganizationIsArchived({ archivedOrganizationId: organization2.id, user, archivedAt: now });
      await _assertPendingInvitationsAreCanceled({
        archivedOrganizationId: organization2.id,
        updatedAt: now,
      });
      await _assertCampaignAreArchived({ organizationId: organization2.id, archivedAt: now });
      await _assertMembershipAreDisabled({ organizationId: organization2.id, disabledAt: now });
    });
  });

  context('failure', function () {
    it('processes until it throws an error if one of the organizations cannot be archived', async function () {
      // given
      const nonExistingOrganizationId = 1234;
      const organization1 = databaseBuilder.factory.buildOrganization();
      databaseBuilder.factory.buildOrganizationInvitation({
        organizationId: organization1.id,
        status: OrganizationInvitation.StatusType.PENDING,
      });
      databaseBuilder.factory.buildCampaign({
        organizationId: organization1.id,
        archivedAt: null,
      });
      databaseBuilder.factory.buildMembership({
        organizationId: organization1.id,
        disabledAt: null,
      });

      const user = databaseBuilder.factory.buildUser();
      await databaseBuilder.commit();

      const organizationIds = [organization1.id, nonExistingOrganizationId];

      // when
      const error = await catchErr(usecases.archiveOrganizationsInBatch)({
        organizationIds,
        userId: user.id,
      });

      // then
      expect(error).to.deepEqualInstance(
        new ArchiveOrganizationsInBatchError({
          meta: {
            currentLine: 2,
            totalLines: 2,
          },
        }),
      );
      await _assertOrganizationIsArchived({ archivedOrganizationId: organization1.id, user, archivedAt: now });
      await _assertPendingInvitationsAreCanceled({
        archivedOrganizationId: organization1.id,
        updatedAt: now,
      });
      await _assertCampaignAreArchived({ organizationId: organization1.id, archivedAt: now });
      await _assertMembershipAreDisabled({ organizationId: organization1.id, disabledAt: now });
    });
  });
});

async function _assertMembershipAreDisabled({ organizationId, disabledAt }) {
  const archivedMembership1 = await knex('memberships').where({ organizationId }).first();

  expect(archivedMembership1.disabledAt).to.deep.equal(disabledAt);
}

async function _assertCampaignAreArchived({ organizationId, archivedAt }) {
  const archivedCampaign1 = await knex('campaigns').where({ organizationId }).first();
  expect(archivedCampaign1.archivedAt).to.deep.equal(archivedAt);
}

async function _assertPendingInvitationsAreCanceled({ archivedOrganizationId, updatedAt }) {
  const archivedPendingOrganizationInvitation = await knex('organization-invitations')
    .where({ organizationId: archivedOrganizationId })
    .first();

  expect(archivedPendingOrganizationInvitation.status).to.deep.equal(OrganizationInvitation.StatusType.CANCELLED);
  expect(archivedPendingOrganizationInvitation.updatedAt).to.deep.equal(updatedAt);
}

async function _assertOrganizationIsArchived({ archivedOrganizationId, user, archivedAt }) {
  const archivedOrganization = await knex('organizations').where({ id: archivedOrganizationId }).first();

  expect(archivedOrganization.archivedBy).to.deep.equal(user.id);
  expect(archivedOrganization.archivedAt).to.deep.equal(archivedAt);
}
