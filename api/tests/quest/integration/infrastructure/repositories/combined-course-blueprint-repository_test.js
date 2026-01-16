import { CombinedCourseBlueprint } from '../../../../../src/quest/domain/models/CombinedCourseBlueprint.js';
import * as combinedCourseBluePrintRepository from '../../../../../src/quest/infrastructure/repositories/combined-course-blueprint-repository.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, domainBuilder, expect } from '../../../../test-helper.js';

describe('Quest | Integration | Repository | combined-course-blueprint', function () {
  describe('#save', function () {
    it('should create a combined course blueprint', async function () {
      // given
      const combinedCourseBlueprint = {
        name: 'Combined course IA',
        internalName: 'Ia combined course blueprint',
        description: "L'ia c'est magique",
        illustration: 'illustration/ia.svg',
        content: CombinedCourseBlueprint.buildContentItems([{ moduleShortId: 'modulix' }]),
        organizationIds: [],
      };

      // when
      const savedCombinedCourseBlueprint = await combinedCourseBluePrintRepository.save({ combinedCourseBlueprint });

      // then
      const results = await combinedCourseBluePrintRepository.findAll();
      expect(results).lengthOf(1);
      expect(results[0]).deep.equal(savedCombinedCourseBlueprint);

      expect(savedCombinedCourseBlueprint).deep.contain(combinedCourseBlueprint);
    });

    it('should delete combined course blueprint share for a given organizationId', async function () {
      // given
      const combinedCourseBlueprintShare = databaseBuilder.factory.buildCombinedCourseBlueprintShare();
      const combinedCourseBlueprintShare2 = databaseBuilder.factory.buildCombinedCourseBlueprintShare({
        combinedCourseBlueprintId: combinedCourseBlueprintShare.combinedCourseBlueprintId,
      });

      await databaseBuilder.commit();

      const combinedCourseBlueprint = await combinedCourseBluePrintRepository.findById({
        id: combinedCourseBlueprintShare.combinedCourseBlueprintId,
      });

      combinedCourseBlueprint.detachOrganization({ organizationId: combinedCourseBlueprintShare.organizationId });

      // when
      const result = await combinedCourseBluePrintRepository.save({ combinedCourseBlueprint });

      expect(result.organizationIds).deep.equal([combinedCourseBlueprintShare2.organizationId]);
    });

    it('should add combined course blueprint share for a given organizationId', async function () {
      // given
      const organization1 = databaseBuilder.factory.buildOrganization();
      const organization2 = databaseBuilder.factory.buildOrganization();

      const combinedCourseBlueprintShare = databaseBuilder.factory.buildCombinedCourseBlueprintShare({
        organizationId: organization1.id,
      });

      await databaseBuilder.commit();

      const combinedCourseBlueprint = await combinedCourseBluePrintRepository.findById({
        id: combinedCourseBlueprintShare.combinedCourseBlueprintId,
      });

      combinedCourseBlueprint.attachOrganizations({ organizationIds: [organization1.id, organization2.id] });

      // when
      const result = await combinedCourseBluePrintRepository.save({ combinedCourseBlueprint });

      expect(result.organizationIds).deep.equal([organization1.id, organization2.id]);
      expect(result.duplicatedOrganizationIds).deep.equal([organization1.id]);
      expect(result.attachedOrganizationIds).deep.equal([organization2.id]);
    });

    it('should throw a NotFound error when combined course blueprint does not exist', async function () {
      // given
      const combinedCourseBlueprintShare = databaseBuilder.factory.buildCombinedCourseBlueprintShare();
      databaseBuilder.factory.buildCombinedCourseBlueprintShare({
        combinedCourseBlueprintId: combinedCourseBlueprintShare.combinedCourseBlueprintId,
      });

      await databaseBuilder.commit();

      const combinedCourseBlueprint = await combinedCourseBluePrintRepository.findById({
        id: combinedCourseBlueprintShare.combinedCourseBlueprintId,
      });

      combinedCourseBlueprint.detachOrganization({ organizationId: combinedCourseBlueprintShare.organizationId });

      // when
      const nonExistingCombinedCourseBlueprint = { ...combinedCourseBlueprint, id: 404 };
      const error = await catchErr(combinedCourseBluePrintRepository.save)({
        combinedCourseBlueprint: nonExistingCombinedCourseBlueprint,
      });

      // then
      expect(error).instanceOf(NotFoundError);
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
  describe('#findById', function () {
    it('should return combined course blueprint by its id with shared organization ids', async function () {
      const combinedCourseBlueprint = databaseBuilder.factory.buildCombinedCourseBlueprint();
      const combinedCourseBlueprintShare = databaseBuilder.factory.buildCombinedCourseBlueprintShare({
        combinedCourseBlueprintId: combinedCourseBlueprint.id,
      });
      await databaseBuilder.commit();

      const expectedCombinedCourseBlueprint = domainBuilder.buildCombinedCourseBlueprint({
        ...combinedCourseBlueprint,
        content: [],
        organizationIds: [combinedCourseBlueprintShare.organizationId],
      });

      const result = await combinedCourseBluePrintRepository.findById({ id: expectedCombinedCourseBlueprint.id });
      expect(result.organizationIds).to.deep.equal([combinedCourseBlueprintShare.organizationId]);
      expect(result).to.be.instanceOf(CombinedCourseBlueprint);
      expect(result).to.deep.equal(expectedCombinedCourseBlueprint);
    });

    it('should return combined course blueprint by its id when it is not shared', async function () {
      const combinedCourseBlueprint = databaseBuilder.factory.buildCombinedCourseBlueprint();
      await databaseBuilder.commit();

      const expectedCombinedCourseBlueprint = domainBuilder.buildCombinedCourseBlueprint({
        ...combinedCourseBlueprint,
        content: [],
      });

      const result = await combinedCourseBluePrintRepository.findById({ id: expectedCombinedCourseBlueprint.id });
      expect(result.organizationIds).to.deep.equal([]);
      expect(result).to.be.instanceOf(CombinedCourseBlueprint);
      expect(result).to.deep.equal(expectedCombinedCourseBlueprint);
    });

    it('should return null when no results are found', async function () {
      const result = await combinedCourseBluePrintRepository.findById({ id: 123 });
      expect(result).null;
    });
  });
});
