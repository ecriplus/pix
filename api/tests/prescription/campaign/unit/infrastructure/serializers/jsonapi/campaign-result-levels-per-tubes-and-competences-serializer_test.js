import { expect } from 'chai';

import { CampaignResultLevelsPerTubesAndCompetences } from '../../../../../../../src/prescription/campaign/domain/models/CampaignResultLevelsPerTubesAndCompetences.js';
import * as serializer from '../../../../../../../src/prescription/campaign/infrastructure/serializers/jsonapi/campaign-result-levels-per-tubes-and-competences-serializer.js';
import { KnowledgeElementCollection } from '../../../../../../../src/prescription/shared/domain/models/KnowledgeElementCollection.js';
import { KnowledgeElement } from '../../../../../../../src/shared/domain/models/KnowledgeElement.js';
import { domainBuilder } from '../../../../../../test-helper.js';

describe('Unit | Serializer | JSONAPI | campaign-result-levels-per-tubes-and-competences-serializer', function () {
  describe('#serialize', function () {
    let learningContent, keData;

    beforeEach(function () {
      const framework = domainBuilder.buildFramework({ id: 'frameworkId', name: 'frameworkName' });
      const skill1 = domainBuilder.buildSkill({
        id: 'recSkillWeb1',
        tubeId: 'tube1',
        difficulty: 1,
      });
      const tube1 = domainBuilder.buildTube({
        id: 'tube1',
        competenceId: 'competence1',
        skills: [skill1],
        practicalTitle: 'tube 1',
        practicalDescription: 'tube 1 description',
      });

      const competence1 = domainBuilder.buildCompetence({
        id: 'competence1',
        areaId: 'recArea1',
        tubes: [tube1],
        name: 'compétence 1',
        description: 'description compétence 1',
      });

      const area = domainBuilder.buildArea({ id: 'recArea1', frameworkId: framework.id });
      const thematic1 = domainBuilder.buildThematic({
        id: 'thematic1',
        competenceId: 'competence1',
        tubeIds: ['tube1'],
      });

      competence1.thematics = [thematic1];
      area.competences = [competence1];
      framework.areas = [area];

      learningContent = domainBuilder.buildLearningContent([framework]);

      const user1ke1 = domainBuilder.buildKnowledgeElement({
        status: KnowledgeElement.StatusType.VALIDATED,
        skillId: skill1.id,
        userId: 1,
      });

      const user2ke1 = domainBuilder.buildKnowledgeElement({
        status: KnowledgeElement.StatusType.INVALIDATED,
        skillId: skill1.id,
        userId: 2,
      });

      keData = {
        participationId1: new KnowledgeElementCollection([user1ke1]).latestUniqNonResetKnowledgeElements,
        participationId2: new KnowledgeElementCollection([user2ke1]).latestUniqNonResetKnowledgeElements,
      };
    });

    it('should convert CampaignResultLevelPerTubesAndCompentences acquisitions statistics into JSON API data', function () {
      const campaignId = 1;
      const model = new CampaignResultLevelsPerTubesAndCompetences({
        campaignId: 1,
        learningContent,
        knowledgeElementsByParticipation: keData,
      });
      const json = serializer.serialize(model);

      expect(json).to.deep.equal({
        data: {
          type: 'campaign-result-levels-per-tubes-and-competences',
          id: `${campaignId}`,
          attributes: {
            'max-reachable-level': 1,
            'mean-reached-level': 0.5,
          },
          relationships: {
            'levels-per-competence': {
              data: [
                {
                  id: 'competence1',
                  type: 'levelsPerCompetences',
                },
              ],
            },
            'levels-per-tube': {
              data: [
                {
                  id: 'tube1',
                  type: 'levelsPerTubes',
                },
              ],
            },
          },
        },
        included: [
          {
            attributes: {
              'competence-id': 'competence1',
              'max-level': 1,
              'mean-level': 0.5,
              'practical-description': 'tube 1 description',
              'practical-title': 'tube 1',
            },
            id: 'tube1',
            type: 'levelsPerTubes',
          },
          {
            attributes: {
              description: 'description compétence 1',
              index: '1.1',
              'max-level': 1,
              'mean-level': 0.5,
              name: 'compétence 1',
            },
            id: 'competence1',
            type: 'levelsPerCompetences',
          },
        ],
      });
    });
  });
});
