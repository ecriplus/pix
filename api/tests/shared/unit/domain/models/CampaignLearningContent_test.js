import { expect } from 'chai';

import { Area } from '../../../../../src/shared/domain/models/Area.js';
import { CampaignLearningContent } from '../../../../../src/shared/domain/models/CampaignLearningContent.js';
import { Skill } from '../../../../../src/shared/domain/models/Skill.js';
import { Tube } from '../../../../../src/shared/domain/models/Tube.js';

describe('Unit | Domain | Models | CampaignLearningContent', function () {
  let skills, areasSorted, tubesSorted, competencesSorted, areas, competences, jaffaArea, wildStrawberryArea;

  beforeEach(function () {
    jaffaArea = new Area({ id: 'jaffaArea', code: '1', name: 'area 1', color: 'jaffa' });
    wildStrawberryArea = new Area({
      id: 'wildStrawberryArea',
      code: '2',
      name: 'area 2',
      color: 'wild-strawberry',
    });
    areas = [wildStrawberryArea, jaffaArea];
    areasSorted = [jaffaArea, wildStrawberryArea];

    skills = [new Skill({ name: '@web3' }), new Skill({ name: '@web2' })];

    tubesSorted = [new Tube({ skills })];

    (competences = [
      { id: 2, name: 'Désobéissance civile', index: '6.9', skillIds: [2, 3, 4], areaId: 'wildStrawberryArea' },
      { id: 1, name: 'Economie symbiotique', index: '5.1', skillIds: [1], areaId: 'jaffaArea' },
      { id: 3, name: 'Démocratie liquide', index: '8.6', skillIds: [5, 6], areaId: 'wildStrawberryArea' },
    ]),
      (competencesSorted = [
        { id: 1, name: 'Economie symbiotique', index: '5.1', skillIds: [1], areaId: 'jaffaArea' },
        { id: 2, name: 'Désobéissance civile', index: '6.9', skillIds: [2, 3, 4], areaId: 'wildStrawberryArea' },
        { id: 3, name: 'Démocratie liquide', index: '8.6', skillIds: [5, 6], areaId: 'wildStrawberryArea' },
      ]);
  });

  describe('building model', function () {
    it('should return competences sorted by index', function () {
      const learningContent = {
        competences,
        areas: [wildStrawberryArea, jaffaArea],
      };
      const campaignLearningContent = new CampaignLearningContent({
        skills,
        tubesSorted,
        competences: learningContent.competences,
        areas: [wildStrawberryArea, jaffaArea],
      });
      expect(campaignLearningContent.competences).to.deep.equal(competencesSorted);
    });

    it('should return areas sorted by code', function () {
      const learningContent = new CampaignLearningContent({
        skills,
        tubesSorted,
        competences: competencesSorted,
        areas,
      });
      const campaignLearningContent = new CampaignLearningContent({
        skills,
        tubesSorted,
        competencesSorted,
        areas: learningContent.areas,
      });
      expect(campaignLearningContent.areas).to.deep.equal(areasSorted);
    });
  });
});
