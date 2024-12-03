import {
  _getCampaignParticipationOverviewsWithoutPagination,
  findOrganizationLearnersWithParticipations,
} from '../../../../../../src/prescription/organization-learner/domain/usecases/find-organization-learners-with-participations.js';
import { DomainTransaction } from '../../../../../../src/shared/domain/DomainTransaction.js';
import { expect, sinon } from '../../../../../test-helper.js';

describe('Unit | UseCase | find-organization-learners-with-participations', function () {
  context('#findOrganizationLearnersWithParticipations', function () {
    it('should not call libOrganizationLearnerRepository if userIds does not have the expected format', async function () {
      // given
      sinon.stub(DomainTransaction, 'execute').callsFake((lambda) => lambda());
      const libOrganizationLearnerRepository = {
        findByUserId: sinon.stub(),
      };

      // when
      await findOrganizationLearnersWithParticipations({
        userIds: [null],
        libOrganizationLearnerRepository,
      });

      // then
      expect(libOrganizationLearnerRepository.findByUserId).to.not.have.been.called;
    });
  });

  context('#_getCampaignParticipationOverviewsWithoutPagination', function () {
    it('should return all campaign participations', async function () {
      // given
      const userId = 1234;
      const campaignParticipationOverviewRepository = {
        findByUserIdWithFilters: sinon.stub(),
      };

      const campaignParticipationOverview1 = {
        id: 1234,
        userId,
      };
      const campaignParticipationOverview2 = {
        id: 1235,
        userId,
      };

      campaignParticipationOverviewRepository.findByUserIdWithFilters
        .withArgs({
          userId,
          page: { number: 1, size: 100 },
        })
        .resolves({
          campaignParticipationOverviews: [campaignParticipationOverview1],
          pagination: { pageSize: 100, pageCount: 2, rowCount: 110, page: 1 },
        });
      campaignParticipationOverviewRepository.findByUserIdWithFilters
        .withArgs({
          userId,
          page: { number: 2, size: 100 },
        })
        .resolves({
          campaignParticipationOverviews: [campaignParticipationOverview2],
          pagination: { pageSize: 100, pageCount: 2, rowCount: 110, page: 2 },
        });

      // when
      const campaignParticipationOverviews = await _getCampaignParticipationOverviewsWithoutPagination({
        userId,
        campaignParticipationOverviewRepository,
      });

      // then
      expect(campaignParticipationOverviews).to.be.deep.have.members([
        campaignParticipationOverview1,
        campaignParticipationOverview2,
      ]);
    });
  });
});
