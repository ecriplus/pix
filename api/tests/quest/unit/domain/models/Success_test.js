import { Success } from '../../../../../src/quest/domain/models/Success.js';
import { KnowledgeElement } from '../../../../../src/shared/domain/models/index.js';
import { expect } from '../../../../test-helper.js';

describe('Quest | Unit | Domain | Models | Success ', function () {
  describe('#getMasteryPercentageForSkills', function () {
    context('when no skill ids provided', function () {
      it('should return 0', function () {
        // given
        const skillIdsEmpty = [];
        const brokenSkillIds = null;
        const success = new Success({
          knowledgeElements: [
            { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillA' },
            { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillB' },
            { status: KnowledgeElement.StatusType.INVALIDATED, skillId: 'skillC' },
          ],
          skills: [
            { id: 'skillA', tubeId: 'tubeA', difficulty: 1 },
            { id: 'skillB', tubeId: 'tubeB', difficulty: 1 },
            { id: 'skillC', tubeId: 'tubeC', difficulty: 1 },
          ],
        });

        // when
        const masteryPercentageEmpty = success.getMasteryPercentageForSkills(skillIdsEmpty);
        const masteryPercentageBroken = success.getMasteryPercentageForSkills(brokenSkillIds);

        // then
        expect(masteryPercentageEmpty).to.equal(0);
        expect(masteryPercentageBroken).to.equal(0);
      });
    });
    context('when skill ids are provided', function () {
      it('should return the expected mastery percentage according to knowledge elements in Success model', function () {
        // given
        const skillIds = ['skillB', 'skillA', 'skillC', 'skillE'];
        const success = new Success({
          knowledgeElements: [
            { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillA' },
            { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillB' },
            { status: KnowledgeElement.StatusType.INVALIDATED, skillId: 'skillC' },
            { status: KnowledgeElement.StatusType.INVALIDATED, skillId: 'skillD' },
          ],
          skills: [
            { id: 'skillA', tubeId: 'tubeA', difficulty: 1 },
            { id: 'skillB', tubeId: 'tubeB', difficulty: 1 },
            { id: 'skillC', tubeId: 'tubeC', difficulty: 1 },
            { id: 'skillD', tubeId: 'tubeD', difficulty: 1 },
          ],
        });

        // when
        const masteryPercentage = success.getMasteryPercentageForSkills(skillIds);

        // then
        const expectedMasteryPercentage = 50;
        expect(masteryPercentage).to.be.equal(expectedMasteryPercentage);
      });
    });
  });
  /*
  describe('#getMasteryPercentageForCappedTubes', function () {
    context('when no cappedTubes provided', function () {
      it('should return 0', function () {
        // given
        const cappedTubesEmpty = [];
        const brokenCappedTubes = null;
        const success = new Success({
          knowledgeElements: [
            { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillA' },
            { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillB' },
            { status: KnowledgeElement.StatusType.INVALIDATED, skillId: 'skillC' },
          ],
          skills: [
            { id: 'skillA', tubeId: 'tubeA', difficulty: 1 },
            { id: 'skillB', tubeId: 'tubeB', difficulty: 1 },
            { id: 'skillC', tubeId: 'tubeC', difficulty: 1 },
          ],
        });

        // when
        const masteryPercentageEmpty = success.getMasteryPercentageForCappedTubes(cappedTubesEmpty);
        const masteryPercentageBroken = success.getMasteryPercentageForCappedTubes(brokenCappedTubes);

        // then
        expect(masteryPercentageEmpty).to.equal(0);
        expect(masteryPercentageBroken).to.equal(0);
      });
    });
    context('when cappedTubes are provided', function () {
      it('should return the expected mastery percentage according to knowledge elements by tube in Success model', function () {
        // given
        const success = new Success({
          // 1/2 sur tubeA cappé 2
          // 2/3 sur tubeB cappé 3
          // au final ça donne 3 / 5 -> 60%
          knowledgeElements: [
            { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skill1tubeA' },
            { status: KnowledgeElement.StatusType.INVALIDATED, skillId: 'skill2tubeA' },
            { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skill3tubeA' }, // ignoré, hors cap
            { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skill4tubeA' }, // ignoré, hors cap
            { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skill1tubeB' },
            { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skill2tubeB' },
            { status: KnowledgeElement.StatusType.INVALIDATED, skillId: 'skill3tubeB' },
            { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillTubeC' }, // ignoré, hors scope
            { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillTubeD' }, // ignoré, hors scope
          ],
          skills: [
            { id: 'skill1tubeA', tubeId: 'tubeA', difficulty: 1 },
            { id: 'skill2tubeA', tubeId: 'tubeA', difficulty: 2 },
            { id: 'skill3tubeA', tubeId: 'tubeA', difficulty: 3 },
            { id: 'skill4tubeA', tubeId: 'tubeA', difficulty: 4 },
            { id: 'skill1tubeB', tubeId: 'tubeB', difficulty: 1 },
            { id: 'skill2tubeB', tubeId: 'tubeB', difficulty: 2 },
            { id: 'skill3tubeB', tubeId: 'tubeB', difficulty: 3 },
            { id: 'skillTubeC', tubeId: 'tubeC', difficulty: 1 },
            { id: 'skillTubeD', tubeId: 'tubeD', difficulty: 1 },
          ],
        });

        // when
        const cappedTubes = [
          { tubeId: 'tubeA', level: 2 },
          { tubeId: 'tubeB', level: 3 },
        ];
        const masteryPercentage = success.getMasteryPercentageForCappedTubes(cappedTubes);

        // then
        const expectedMasteryPercentage = 60;
        expect(masteryPercentage).to.be.equal(expectedMasteryPercentage);
      });
    });
  });
  */
});
