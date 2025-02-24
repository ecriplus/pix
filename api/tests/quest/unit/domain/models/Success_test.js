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
        });

        // when
        const masteryPercentage = success.getMasteryPercentageForSkills(skillIds);

        // then
        const expectedMasteryPercentage = 50;
        expect(masteryPercentage).to.be.equal(expectedMasteryPercentage);
      });
    });
  });
});
