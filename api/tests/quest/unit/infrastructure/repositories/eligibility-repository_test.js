import sinon from 'sinon';

import { Eligibility } from '../../../../../src/quest/domain/models/Eligibility.js';
import { repositories } from '../../../../../src/quest/infrastructure/repositories/index.js';
import { expect } from '../../../../test-helper.js';

describe('Quest | Unit | Infrastructure | repositories | eligibility', function () {
  describe('#find', function () {
    it('should call organizationLearnersWithParticipations api', async function () {
      // given
      const organizationLearnerId = Symbol('organizationLearnerId');
      const organization = Symbol('organization');
      const targetProfileId = Symbol('targetProfileId');
      const organizationLearnerWithParticipationApiResponseSymbol = [
        {
          organizationLearner: {
            id: organizationLearnerId,
          },
          organization,
          campaignParticipations: [{ targetProfileId }],
        },
      ];
      const userId = 1;
      const organizationLearnerWithParticipationApi = {
        find: sinon.stub(),
      };
      organizationLearnerWithParticipationApi.find
        .withArgs({ userIds: [userId] })
        .resolves(organizationLearnerWithParticipationApiResponseSymbol);

      // when
      const result = await repositories.eligibilityRepository.find({
        userId,
        organizationLearnerWithParticipationApi,
      });

      // then
      expect(result[0]).to.be.an.instanceof(Eligibility);
      expect(result[0].organization).to.equal(organization);
      expect(result[0].organizationLearner.id).to.equal(organizationLearnerId);
      expect(result[0].campaignParticipations[0].targetProfileId).to.equal(targetProfileId);
    });
  });

  describe('#findByUserIdAndOrganizationId', function () {
    it('should call organizationLearnerWithParticipationApi', async function () {
      // given
      const organizationLearnerId = Symbol('organizationLearnerId');
      const organization = { id: 1 };
      const targetProfileId = Symbol('targetProfileId');
      const apiResponseSymbol = {
        organizationLearner: {
          id: organizationLearnerId,
        },
        organization,
        campaignParticipations: [{ targetProfileId }],
      };
      const moduleIds = Symbol('moduleIds');

      const organizationLearnerParticipationRepository = {
        findByOrganizationLearnerIdAndModuleIds: sinon.stub(),
      };
      organizationLearnerParticipationRepository.findByOrganizationLearnerIdAndModuleIds
        .withArgs({
          organizationLearnerId,
          moduleIds,
        })
        .resolves([
          {
            referenceId: 1,
            isTerminated: true,
          },
        ]);

      const organizationLearnerWithParticipationApi = {
        findByOrganizationAndOrganizationLearnerId: sinon.stub(),
      };
      organizationLearnerWithParticipationApi.findByOrganizationAndOrganizationLearnerId
        .withArgs({ organizationLearnerId, organizationId: organization.id })
        .resolves(apiResponseSymbol);

      // when
      const result = await repositories.eligibilityRepository.findByOrganizationAndOrganizationLearnerId({
        organizationLearnerId,
        organizationId: organization.id,
        organizationLearnerWithParticipationApi,
        organizationLearnerParticipationRepository,
        moduleIds,
      });

      // then
      expect(result).to.be.an.instanceof(Eligibility);
      expect(result.organization).to.equal(organization);
      expect(result.organizationLearner.id).to.equal(organizationLearnerId);
      expect(result.campaignParticipations[0].targetProfileId).to.equal(targetProfileId);
      expect(result.passages).to.deep.equal([{ moduleId: 1, isTerminated: true }]);
    });
  });
});
