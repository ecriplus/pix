import sinon from 'sinon';

import { Eligibility } from '../../../../../src/quest/domain/models/Eligibility.js';
import { repositories } from '../../../../../src/quest/infrastructure/repositories/index.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
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
      const userId = 1;
      const organizationLearnerWithParticipationApi = {
        getByUserIdAndOrganizationId: sinon.stub(),
      };
      organizationLearnerWithParticipationApi.getByUserIdAndOrganizationId
        .withArgs({ userId, organizationId: organization.id })
        .resolves(apiResponseSymbol);
      const moduleApiResponse = [{ id: 1, status: 'COMPLETED' }];
      const modulesApi = {
        getUserModuleStatuses: sinon.stub(),
      };

      modulesApi.getUserModuleStatuses.withArgs({ userId, moduleIds: [] }).resolves(moduleApiResponse);

      // when
      const result = await repositories.eligibilityRepository.findByUserIdAndOrganizationId({
        userId,
        organizationId: organization.id,
        organizationLearnerWithParticipationApi,
        modulesApi,
      });

      // then
      expect(result).to.be.an.instanceof(Eligibility);
      expect(result.organization).to.equal(organization);
      expect(result.organizationLearner.id).to.equal(organizationLearnerId);
      expect(result.campaignParticipations[0].targetProfileId).to.equal(targetProfileId);
      expect(result.passages).to.deep.equal([{ moduleId: 1, isTerminated: true }]);
    });
    it('should ignore not found error', async function () {
      // given
      const organizationId = 1;
      const userId = 2;
      const organizationLearnerWithParticipationApi = {
        getByUserIdAndOrganizationId: sinon.stub(),
      };
      organizationLearnerWithParticipationApi.getByUserIdAndOrganizationId
        .withArgs({ userId, organizationId })
        .rejects(new NotFoundError());

      const modulesApi = { getUserModuleStatuses: sinon.stub() };
      modulesApi.getUserModuleStatuses.withArgs({ userId, moduleIds: [] }).resolves([{ id: 1, status: 'COMPLETED' }]);

      // when
      const result = await repositories.eligibilityRepository.findByUserIdAndOrganizationId({
        userId,
        organizationId,
        organizationLearnerWithParticipationApi,
        modulesApi,
      });
      expect(result).to.be.an.instanceof(Eligibility);
    });
  });
});
