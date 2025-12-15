import { CombinedCourseBlueprint } from '../../../../../src/quest/domain/models/CombinedCourseBlueprint.js';
import * as combinedCourseBluePrintRepository from '../../../../../src/quest/infrastructure/repositories/combined-course-blueprint-repository.js';
import { databaseBuilder, domainBuilder, expect } from '../../../../test-helper.js';

describe('Quest | Integration | Repository | combined-course-blueprint', function () {
  describe('#findAll', function () {
    it('should return all combined course blueprints', async function () {
      const expectedCombinedCourseBlueprint = domainBuilder.buildCombinedCourseBlueprint();
      databaseBuilder.factory.buildCombinedCourseBlueprint(expectedCombinedCourseBlueprint);
      await databaseBuilder.commit();

      const results = await combinedCourseBluePrintRepository.findAll();
      expect(results).lengthOf(1);
      expect(results[0]).to.be.instanceOf(CombinedCourseBlueprint);
      expect(results[0]).to.deep.equal(expectedCombinedCourseBlueprint);
    });
    it('should return an empty array when no results are found', async function () {
      const result = await combinedCourseBluePrintRepository.findAll();
      expect(result).lengthOf(0);
    });
  });
});
