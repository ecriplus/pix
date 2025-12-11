import { CombinedCourseBlueprint } from '../../../../../src/quest/domain/models/CombinedCourseBlueprint.js';
import * as combinedCourseBluePrintRepository from '../../../../../src/quest/infrastructure/repositories/combined-course-blueprint-repository.js';
import { databaseBuilder, domainBuilder, expect } from '../../../../test-helper.js';

describe('Quest | Integration | Repository | combined-course-blueprint', function () {
  describe('#save', function () {
    it('should save a combined course blueprint', async function () {
      // given
      const values = {
        id: 1,
        name: 'Combined course IA',
        internalName: 'Ia combined course blueprint',
        description: "L'ia c'est magique",
        illustration: 'illustration/ia.svg',
        createdAt: new Date(),
        updatedAt: new Date(),
        content: CombinedCourseBlueprint.buildContentItems([{ moduleId: 'modulix' }]),
      };

      // when
      await combinedCourseBluePrintRepository.save(values);

      // then
      const results = await combinedCourseBluePrintRepository.findAll();
      expect(results).lengthOf(1);
      expect(results[0]).deep.equal(values);
    });

    it('should return created combined course blueprint', async function () {
      // given
      const values = {
        id: 1,
        name: 'Combined course IA',
        internalName: 'Ia combined course blueprint',
        description: "L'ia c'est magique",
        illustration: 'illustration/ia.svg',
        createdAt: new Date(),
        updatedAt: new Date(),
        content: CombinedCourseBlueprint.buildContentItems([{ moduleId: 'modulix' }]),
      };

      // when
      const result = await combinedCourseBluePrintRepository.save(values);

      expect(result).deep.equal(values);
    });
  });

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
