import _ from 'lodash';

import { CampaignAnalysis } from '../../../../../../src/prescription/campaign/domain/read-models/CampaignAnalysis.js';
import * as campaignAnalysisRepository from '../../../../../../src/prescription/campaign-participation/infrastructure/repositories/campaign-analysis-repository.js';
import { CampaignParticipationStatuses } from '../../../../../../src/prescription/shared/domain/constants.js';
import { databaseBuilder, domainBuilder, expect } from '../../../../../test-helper.js';

const { SHARED } = CampaignParticipationStatuses;

function _createUserWithSharedCampaignParticipation(userName, campaignId, sharedAt, isImproved) {
  const userId = databaseBuilder.factory.buildUser({ firstName: userName }).id;
  const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
    campaignId,
    userId,
    status: SHARED,
    sharedAt,
    isImproved,
  });

  return { userId, campaignParticipation };
}

describe('Integration | Repository | Campaign analysis repository', function () {
  describe('#getCampaignParticipationAnalysis', function () {
    context('in a rich context close to reality', function () {
      let learningContent, campaignLearningContent;
      let campaignId;
      let userId;
      let campaignParticipation;

      beforeEach(async function () {
        campaignId = databaseBuilder.factory.buildCampaign().id;
        const sharedAt = new Date('2020-04-01');
        const userWithCampaignParticipation = _createUserWithSharedCampaignParticipation(
          'Fred',
          campaignId,
          sharedAt,
          false,
        );
        userId = userWithCampaignParticipation.userId;
        const beforeCampaignParticipationShareDate = new Date('2019-01-01');

        const keData = [
          { userId, skillId: 'recUrl1', status: 'validated', createdAt: beforeCampaignParticipationShareDate },
          { userId, skillId: 'recUrl2', status: 'invalidated', createdAt: beforeCampaignParticipationShareDate },
          { userId, skillId: 'recFile2', status: 'validated', createdAt: beforeCampaignParticipationShareDate },
          { userId, skillId: 'recFile3', status: 'validated', createdAt: beforeCampaignParticipationShareDate },
          {
            userId,
            skillId: 'someUntargetedSkill',
            status: 'validated',
            createdAt: beforeCampaignParticipationShareDate,
          },
        ];
        databaseBuilder.factory.buildKnowledgeElementSnapshot({
          userId,
          snapshot: JSON.stringify(keData),
          campaignParticipationId: userWithCampaignParticipation.campaignParticipation.id,
        });
        campaignParticipation = { userId, sharedAt, id: userWithCampaignParticipation.campaignParticipation.id };

        const url1 = domainBuilder.buildSkill({ id: 'recUrl1', tubeId: 'recTubeUrl', name: '@url1', difficulty: 1 });
        const url2 = domainBuilder.buildSkill({ id: 'recUrl2', tubeId: 'recTubeUrl', name: '@url2', difficulty: 2 });
        const tubeUrl = domainBuilder.buildTube({
          id: 'recTubeUrl',
          competenceId: 'recCompetence',
          skills: [url1, url2],
        });

        const file2 = domainBuilder.buildSkill({
          id: 'recFile2',
          tubeId: 'recTubeFile',
          name: '@file2',
          difficulty: 2,
        });
        const file3 = domainBuilder.buildSkill({
          id: 'recFile3',
          tubeId: 'recTubeFile',
          name: '@file3',
          difficulty: 3,
        });
        const tubeFile = domainBuilder.buildTube({
          id: 'recTubeFile',
          competenceId: 'recCompetence',
          skills: [file2, file3],
        });
        const competence = domainBuilder.buildCompetence({
          id: 'recCompetence',
          tubes: [tubeUrl, tubeFile],
          name: 'The C',
          index: '2.3',
          areaId: 'recArea',
        });
        const area = domainBuilder.buildArea({ id: 'recArea', color: 'jaffa', competences: [competence] });
        const framework = domainBuilder.buildFramework({ areas: [area] });
        learningContent = domainBuilder.buildLearningContent([framework]);
        campaignLearningContent = domainBuilder.buildCampaignLearningContent(learningContent);

        return databaseBuilder.commit();
      });

      it('should resolves an analysis with expected tube recommendations initialized correctly', async function () {
        // when
        const tutorials = [];
        const actualAnalysis = await campaignAnalysisRepository.getCampaignParticipationAnalysis(
          campaignId,
          campaignParticipation,
          campaignLearningContent,
          tutorials,
        );

        // then
        const pickedAttributes = [
          'campaignId',
          'tube',
          'id',
          'competenceId',
          'competenceName',
          'tubePracticalTitle',
          'areaColor',
          'maxSkillLevel',
        ];
        expect(actualAnalysis).to.be.an.instanceof(CampaignAnalysis);
        expect(actualAnalysis.id).to.equal(campaignId);

        const tubeARecommendation = actualAnalysis.campaignTubeRecommendations[0];
        expect(_.pick(tubeARecommendation, pickedAttributes)).to.deep.equal({
          campaignId,
          tube: campaignLearningContent.tubes[0],
          competenceId: campaignLearningContent.competences[0].id,
          id: `${campaignId}_${campaignLearningContent.tubes[0].id}`,
          competenceName: campaignLearningContent.competences[0].name,
          tubePracticalTitle: campaignLearningContent.tubes[0].practicalTitle,
          areaColor: campaignLearningContent.areas[0].color,
          maxSkillLevel: campaignLearningContent.maxSkillDifficulty,
        });

        const tubeBRecommendation = actualAnalysis.campaignTubeRecommendations[1];
        expect(_.pick(tubeBRecommendation, pickedAttributes)).to.deep.equal({
          campaignId,
          tube: campaignLearningContent.tubes[1],
          competenceId: campaignLearningContent.competences[0].id,
          id: `${campaignId}_${campaignLearningContent.tubes[1].id}`,
          competenceName: campaignLearningContent.competences[0].name,
          tubePracticalTitle: campaignLearningContent.tubes[1].practicalTitle,
          areaColor: campaignLearningContent.areas[0].color,
          maxSkillLevel: campaignLearningContent.maxSkillDifficulty,
        });
      });

      context('participation details', function () {
        it('should resolves an analysis based on participant score ignoring untargeted or non validated knowledge elements', async function () {
          // when
          const tutorials = [];
          const actualAnalysis = await campaignAnalysisRepository.getCampaignParticipationAnalysis(
            campaignId,
            campaignParticipation,
            campaignLearningContent,
            tutorials,
          );

          // then
          // changement de maxSkillDifficulty 2 => 3
          const tubeUrlRecommendation = actualAnalysis.campaignTubeRecommendations[0];
          // (30 / 2) * 2 = 30
          // (30 / 3) * 2 = 20 (-10)
          expect(tubeUrlRecommendation.averageScore).to.equal(55); // 65 - 10 => 55
          const tubeFileRecommendation = actualAnalysis.campaignTubeRecommendations[1];
          // (30 / 2) * 3 = 45
          // (30 / 3) * 3 = 30 (-15)
          expect(tubeFileRecommendation.averageScore).to.equal(100); // 115 - 15 => 100
        });
      });
    });
  });
});
