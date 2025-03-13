import sinon from 'sinon';

import { Success } from '../../../../../src/quest/domain/models/Success.js';
import * as successRepository from '../../../../../src/quest/infrastructure/repositories/success-repository.js';
import { expect, preventStubsToBeCalledUnexpectedly } from '../../../../test-helper.js';

describe('Quest | Unit | Infrastructure | repositories | success', function () {
  describe('#find', function () {
    let knowledgeElementsApi_findFilteredMostRecentByUserStub;
    let skillsApi_findByIdsStub;
    let campaignsApi_findCampaignSkillIdsForCampaignParticipationsStub;

    beforeEach(function () {
      knowledgeElementsApi_findFilteredMostRecentByUserStub = sinon.stub().named('findFilteredMostRecentByUser');
      skillsApi_findByIdsStub = sinon.stub().named('findByIds');
      campaignsApi_findCampaignSkillIdsForCampaignParticipationsStub = sinon
        .stub()
        .named('findCampaignSkillIdsForCampaignParticipations');
      preventStubsToBeCalledUnexpectedly([
        knowledgeElementsApi_findFilteredMostRecentByUserStub,
        skillsApi_findByIdsStub,
        campaignsApi_findCampaignSkillIdsForCampaignParticipationsStub,
      ]);
    });

    it('should return a Success model according to data fetched from diverse APIs', async function () {
      // given
      const userId = Symbol('userId');
      const knowledgeElements = [{ skillId: 'A' }, { skillId: 'B' }];
      const campaignParticipationIds = Symbol('campaignParticipationIds');
      const campaignSkillIds = Symbol('campaignSkillIds');
      const skills = [
        { id: 'A', tubeId: 'AA' },
        { id: 'B', tubeId: 'BB' },
      ];
      const knowledgeElementsApi = {
        findFilteredMostRecentByUser: knowledgeElementsApi_findFilteredMostRecentByUserStub,
      };
      const skillsApi = {
        findByIds: skillsApi_findByIdsStub,
      };
      const campaignsApi = {
        findCampaignSkillIdsForCampaignParticipations: campaignsApi_findCampaignSkillIdsForCampaignParticipationsStub,
      };
      knowledgeElementsApi_findFilteredMostRecentByUserStub.withArgs({ userId }).resolves(knowledgeElements);
      campaignsApi.findCampaignSkillIdsForCampaignParticipations
        .withArgs(campaignParticipationIds)
        .resolves(campaignSkillIds);
      skillsApi_findByIdsStub.withArgs({ ids: campaignSkillIds }).resolves(skills);

      // when
      const result = await successRepository.find({
        userId,
        campaignParticipationIds,
        knowledgeElementsApi,
        campaignsApi,
        skillsApi,
      });

      // then
      expect(result).to.be.an.instanceof(Success);
      expect(result.knowledgeElements).to.deepEqualArray(knowledgeElements);
      expect(result.skillsForKnowledgeElements).to.equal(skills);
    });
  });
});
