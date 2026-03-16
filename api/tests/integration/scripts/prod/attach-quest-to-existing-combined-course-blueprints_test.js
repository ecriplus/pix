import { AttachQuestToExistingCombinedCourseBlueprintsScript } from '../../../../scripts/prod/attach-quest-to-existing-combined-course-blueprints.js';
import * as combinedCourseBlueprintRepository from '../../../../src/quest/infrastructure/repositories/combined-course-blueprint-repository.js';
import { databaseBuilder, expect, sinon } from '../../../test-helper.js';

describe('Script | Prod | Attach quest to existing combined course blueprints', function () {
  let script;
  describe('Options', function () {
    it('has the correct options', function () {
      // when
      script = new AttachQuestToExistingCombinedCourseBlueprintsScript();
      const { description } = script.metaInfo;
      expect(description).to.equal(
        'This script will create a quest for the existing combined course blueprints without quest',
      );
    });
  });
  describe('#handle', function () {
    const logger = { info: sinon.spy(), error: sinon.spy() };

    describe('#dryRun false', function () {
      it('should create quest for combined course blueprint without quest id', async function () {
        const { id: questId1 } = await databaseBuilder.factory.buildQuestForCombinedCourse({ rewardType: null });
        const { id: questId2 } = await databaseBuilder.factory.buildQuestForCombinedCourse({ rewardType: null });

        await databaseBuilder.factory.buildCombinedCourseBlueprint({ questId: null });
        await databaseBuilder.factory.buildCombinedCourseBlueprint({ questId: null });
        await databaseBuilder.factory.buildCombinedCourseBlueprint({ questId: questId1 });
        await databaseBuilder.factory.buildCombinedCourseBlueprint({ questId: questId2 });

        await databaseBuilder.commit();

        //when
        await script.handle({ options: { dryRun: false }, logger });

        //then
        const results = await combinedCourseBlueprintRepository.findAll();
        expect(results.every((result) => result.quest)).to.be.true;
      });
    });
    describe('#dryRun true', function () {
      it('should not create any quest', async function () {
        const { id: questId1 } = await databaseBuilder.factory.buildQuestForCombinedCourse({ rewardType: null });
        const { id: questId2 } = await databaseBuilder.factory.buildQuestForCombinedCourse({ rewardType: null });

        await databaseBuilder.factory.buildCombinedCourseBlueprint({ questId: null });
        await databaseBuilder.factory.buildCombinedCourseBlueprint({ questId: null });
        await databaseBuilder.factory.buildCombinedCourseBlueprint({ questId: questId1 });
        await databaseBuilder.factory.buildCombinedCourseBlueprint({ questId: questId2 });

        await databaseBuilder.commit();

        //when
        await script.handle({ options: { dryRun: true }, logger });

        //then
        const results = await combinedCourseBlueprintRepository.findAll();
        expect(results.filter((result) => result.quest).length).to.equal(2);
        expect(results.filter((result) => !result.quest).length).to.equal(2);
      });
    });
  });
});
