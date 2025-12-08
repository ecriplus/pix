import { CampaignParticipationStatuses } from '../../../../../src/prescription/shared/domain/constants.js';
import { CombinedCourse } from '../../../../../src/quest/domain/models/CombinedCourse.js';
import {
  CRITERION_COMPARISONS,
  Quest,
  REQUIREMENT_COMPARISONS,
  REQUIREMENT_TYPES,
} from '../../../../../src/quest/domain/models/Quest.js';
import * as combinedCourseRepository from '../../../../../src/quest/infrastructure/repositories/combined-course-repository.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, expect, knex } from '../../../../test-helper.js';

describe('Quest | Integration | Repository | combined-course', function () {
  describe('#getByCode', function () {
    it('should return a quest if code exists', async function () {
      // given
      const code = 'SOMETHING';
      const { id: organizationId } = databaseBuilder.factory.buildOrganization();
      const combinedCourse = databaseBuilder.factory.buildCombinedCourse({ code, organizationId });
      await databaseBuilder.commit();

      // when
      const combinedCourseResult = await combinedCourseRepository.getByCode({ code });

      // then
      expect(combinedCourseResult).to.be.an.instanceof(CombinedCourse);
      expect(combinedCourseResult).to.deep.equal(new CombinedCourse(combinedCourse));
    });

    it('should throw NotFoundError if quest does not exist', async function () {
      // given
      const code = 'NOTHINGTT';

      // when
      const error = await catchErr(combinedCourseRepository.getByCode)({ code });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
      expect(error.message).to.equal(`Le parcours combiné portant le code ${code} n'existe pas`);
    });
  });

  describe('#getById', function () {
    it('should return a quest if quest id exists', async function () {
      // given
      const { id: organizationId } = databaseBuilder.factory.buildOrganization();
      const combinedCourse = databaseBuilder.factory.buildCombinedCourse({ code: 'COMBINIX1', organizationId });
      await databaseBuilder.commit();

      // when
      const combinedCourseResult = await combinedCourseRepository.getById({ id: combinedCourse.id });

      // then
      expect(combinedCourseResult).to.be.an.instanceof(CombinedCourse);
      expect(combinedCourseResult).to.deep.equal(new CombinedCourse(combinedCourse));
    });

    it('should throw NotFoundError if quest does not exist', async function () {
      // given
      const id = 1;

      // when
      const error = await catchErr(combinedCourseRepository.getById)({ id });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
      expect(error.message).to.equal(`Le parcours combiné pour l'id ${id} n'existe pas`);
    });
  });

  describe('#findByOrganizationId', function () {
    it('should return all combined courses for a given organization ordered by creation date descending with pagination metadata', async function () {
      // given
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const combinedCourse1 = databaseBuilder.factory.buildCombinedCourse({
        code: 'COURSE1',
        name: 'Parcours 1',
        organizationId,
        createdAt: new Date('2024-01-01'),
      });
      const combinedCourse2 = databaseBuilder.factory.buildCombinedCourse({
        code: 'COURSE2',
        name: 'Parcours 2',
        organizationId,
        createdAt: new Date('2025-01-01'),
      });
      await databaseBuilder.commit();

      // when
      const result = await combinedCourseRepository.findByOrganizationId({ organizationId, page: 1, size: 10 });

      // then
      expect(result.combinedCourses).to.have.lengthOf(2);
      expect(result.combinedCourses[0]).to.be.an.instanceof(CombinedCourse);
      expect(result.combinedCourses[1]).to.be.an.instanceof(CombinedCourse);
      expect(result.combinedCourses[0]).to.deep.equal(new CombinedCourse(combinedCourse2));
      expect(result.combinedCourses[1]).to.deep.equal(new CombinedCourse(combinedCourse1));
      expect(result.meta).to.deep.include({
        page: 1,
        pageSize: 10,
        rowCount: 2,
        pageCount: 1,
      });
    });

    it('should return an empty array when organization has no combined courses', async function () {
      // given
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      await databaseBuilder.commit();

      // when
      const result = await combinedCourseRepository.findByOrganizationId({ organizationId, page: 1, size: 10 });

      // then
      expect(result.combinedCourses).to.deep.equal([]);
      expect(result.meta).to.deep.include({
        page: 1,
        pageSize: 10,
        rowCount: 0,
        pageCount: 0,
      });
    });

    it('should not return combined courses from other organizations', async function () {
      // given
      const organization1Id = databaseBuilder.factory.buildOrganization().id;
      const organization2Id = databaseBuilder.factory.buildOrganization().id;
      databaseBuilder.factory.buildCombinedCourse({
        code: 'COURSE1',
        name: 'Parcours 1',
        organizationId: organization1Id,
      });
      databaseBuilder.factory.buildCombinedCourse({
        code: 'COURSE2',
        name: 'Parcours 2',
        organizationId: organization2Id,
      });
      await databaseBuilder.commit();

      // when
      const result = await combinedCourseRepository.findByOrganizationId({
        organizationId: organization1Id,
        page: 1,
        size: 10,
      });

      // then
      expect(result.combinedCourses).to.have.lengthOf(1);
      expect(result.combinedCourses[0].organizationId).to.equal(organization1Id);
    });
  });

  describe('#getByCampaignId', function () {
    let organizationId, combinedCourse, campaignId;

    beforeEach(async function () {
      // given
      organizationId = databaseBuilder.factory.buildOrganization().id;
      campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
      const code = 'ABCDE1234';
      const name = 'Mon parcours Combiné';
      const description = 'Le but de ma quête';
      const illustration = 'images/illustration.svg';
      combinedCourse = databaseBuilder.factory.buildCombinedCourse({
        code,
        name,
        organizationId,
        description,
        illustration,
        combinedCourseContents: [{ campaignId }],
      });
      await databaseBuilder.commit();
    });

    it('should return a combinedCourse that include a given campaignId', async function () {
      // when
      const combinedCourseResult = await combinedCourseRepository.findByCampaignId({ campaignId });

      // then
      expect(combinedCourseResult).lengthOf(1);
      expect(combinedCourseResult[0]).instanceof(CombinedCourse);
      expect(combinedCourseResult[0]).deep.equal(new CombinedCourse(combinedCourse));
    });

    it('should return empty array if no combined course match campaignId', async function () {
      // given
      const campaignIdNotInQuest = databaseBuilder.factory.buildCampaign({ organizationId }).id;
      await databaseBuilder.commit();

      // when
      const combinedCourseResult = await combinedCourseRepository.findByCampaignId({
        campaignId: campaignIdNotInQuest,
      });

      // then
      expect(combinedCourseResult).deep.equal([]);
    });
  });

  describe('#saveInBatch', function () {
    it('should save given combined course on quests', async function () {
      // given
      const firstOrganizationId = databaseBuilder.factory.buildOrganization().id;
      const secondOrganizationId = databaseBuilder.factory.buildOrganization().id;
      const successRequirements = [
        {
          requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
          comparison: REQUIREMENT_COMPARISONS.ALL,
          data: {
            campaignId: {
              data: 1,
              comparison: CRITERION_COMPARISONS.EQUAL,
            },
            status: {
              data: CampaignParticipationStatuses.SHARED,
              comparison: CRITERION_COMPARISONS.EQUAL,
            },
          },
        },
      ];
      await databaseBuilder.commit();

      const quest = new Quest({
        successRequirements,
        eligibilityRequirements: [],
      });
      const firstCombinedCourse = new CombinedCourse(
        {
          name: 'firstCombinedCourse',
          code: 'firstCode',
          organizationId: firstOrganizationId,
          illustration: 'mon_illu.svg',
          description: 'ma description',
        },
        quest,
      );
      const secondCombinedCourse = new CombinedCourse(
        {
          name: 'secondCombinedCourse',
          code: 'secondCode',
          organizationId: secondOrganizationId,
        },
        quest,
      );

      // when
      await combinedCourseRepository.saveInBatch({ combinedCourses: [firstCombinedCourse, secondCombinedCourse] });

      // then
      const firstSavedQuest = await knex('quests').where('organizationId', firstOrganizationId).first();
      const secondSavedQuest = await knex('quests').where('organizationId', secondOrganizationId).first();

      expect(firstSavedQuest.name).to.equal('firstCombinedCourse');
      expect(firstSavedQuest.successRequirements).to.deep.equal(successRequirements);
      expect(firstSavedQuest.code).equal('firstCode');
      expect(firstSavedQuest.description).equal('ma description');
      expect(firstSavedQuest.illustration).equal('mon_illu.svg');

      expect(secondSavedQuest.name).to.equal('secondCombinedCourse');
      expect(secondSavedQuest.successRequirements).to.deep.equal(successRequirements);
      expect(secondSavedQuest.code).equal('secondCode');
      expect(secondSavedQuest.description).null;
      expect(secondSavedQuest.illustration).null;
    });

    it('should save given combined course on combined_courses', async function () {
      // given
      const firstOrganizationId = databaseBuilder.factory.buildOrganization().id;
      const secondOrganizationId = databaseBuilder.factory.buildOrganization().id;
      const successRequirements = [
        {
          requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
          comparison: REQUIREMENT_COMPARISONS.ALL,
          data: {
            campaignId: {
              data: 1,
              comparison: CRITERION_COMPARISONS.EQUAL,
            },
            status: {
              data: CampaignParticipationStatuses.SHARED,
              comparison: CRITERION_COMPARISONS.EQUAL,
            },
          },
        },
      ];
      await databaseBuilder.commit();

      const quest = new Quest({
        successRequirements,
        eligibilityRequirements: [],
      });
      const firstCombinedCourse = new CombinedCourse(
        {
          name: 'firstCombinedCourse',
          code: 'firstCode',
          organizationId: firstOrganizationId,
          illustration: 'mon_illu.svg',
          description: 'ma description',
        },
        quest,
      );
      const secondCombinedCourse = new CombinedCourse(
        {
          name: 'secondCombinedCourse',
          code: 'secondCode',
          organizationId: secondOrganizationId,
        },
        quest,
      );

      // when
      await combinedCourseRepository.saveInBatch({ combinedCourses: [firstCombinedCourse, secondCombinedCourse] });

      // then
      const firstSavedQuest = await knex('quests').where('organizationId', firstOrganizationId).first();
      const secondSavedQuest = await knex('quests').where('organizationId', secondOrganizationId).first();

      const firstSavedCombinedCourse = await knex('combined_courses').where('questId', firstSavedQuest.id).first();
      const secondSavedCombinedCourse = await knex('combined_courses').where('questId', secondSavedQuest.id).first();

      expect(firstSavedCombinedCourse.name).to.equal('firstCombinedCourse');
      expect(firstSavedCombinedCourse.description).equal('ma description');
      expect(firstSavedCombinedCourse.illustration).equal('mon_illu.svg');
      expect(firstSavedCombinedCourse.code).equal('firstCode');

      expect(secondSavedCombinedCourse.name).to.equal('secondCombinedCourse');
      expect(secondSavedCombinedCourse.description).null;
      expect(secondSavedCombinedCourse.illustration).null;
      expect(secondSavedCombinedCourse.code).equal('secondCode');
    });
  });

  describe('#findByModuleIdAndOrganizationIds', function () {
    it('should return combined course for a given module id and organization ids', async function () {
      //given
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const organizationId2 = databaseBuilder.factory.buildOrganization().id;
      const moduleId = 'module-abc';

      const combinedCourseWithModule = databaseBuilder.factory.buildCombinedCourse({
        code: 'QWERTY123',
        name: 'name1',
        organizationId,
        combinedCourseContents: [{ moduleId }],
      });

      const otherCombinedCourseWithModule = databaseBuilder.factory.buildCombinedCourse({
        code: 'AZERTY123',
        name: 'name2',
        organizationId,
        combinedCourseContents: [{ moduleId }],
      });

      databaseBuilder.factory.buildCombinedCourse({
        code: 'AZERTY456',
        name: 'name3',
        organizationId: organizationId2,
        combinedCourseContents: [{ moduleId }],
      });

      databaseBuilder.factory.buildCombinedCourse({
        code: 'QWERTY456',
        name: 'name3',
        organizationId: organizationId,
        combinedCourseContents: [{ moduleId: 'module-cde' }],
      });

      await databaseBuilder.commit();

      //when
      const result = await combinedCourseRepository.findByModuleIdAndOrganizationIds({
        moduleId,
        organizationIds: [organizationId],
      });

      //then
      expect(result).lengthOf(2);
      expect(result[0]).instanceOf(CombinedCourse);
      expect(result[1]).instanceOf(CombinedCourse);
      expect(result).deep.members([
        {
          id: combinedCourseWithModule.id,
          code: combinedCourseWithModule.code,
          organizationId: combinedCourseWithModule.organizationId,
          name: combinedCourseWithModule.name,
          description: combinedCourseWithModule.description,
          illustration: combinedCourseWithModule.illustration,
          participations: [],
          questId: combinedCourseWithModule.questId,
        },
        {
          id: otherCombinedCourseWithModule.id,
          code: otherCombinedCourseWithModule.code,
          organizationId: otherCombinedCourseWithModule.organizationId,
          name: otherCombinedCourseWithModule.name,
          description: otherCombinedCourseWithModule.description,
          illustration: otherCombinedCourseWithModule.illustration,
          participations: [],
          questId: otherCombinedCourseWithModule.questId,
        },
      ]);
    });

    it('should return combined course for a same moduleId and multiple organizationIds', async function () {
      //given
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const organizationId2 = databaseBuilder.factory.buildOrganization().id;
      const moduleId = 'module-abc';

      const combinedCourseWithModule = databaseBuilder.factory.buildCombinedCourse({
        code: 'QWERTY123',
        name: 'name1',
        organizationId,
        combinedCourseContents: [{ moduleId }],
      });

      const combinedCourseWithModuleAndOtherOrga = databaseBuilder.factory.buildCombinedCourse({
        code: 'AZERTY123',
        name: 'name2',
        organizationId: organizationId2,
        combinedCourseContents: [{ moduleId }],
      });

      databaseBuilder.factory.buildCombinedCourse({
        code: 'AZERTY456',
        name: 'name3',
        organizationId,
        combinedCourseContents: [{ moduleId: 'module-cde' }],
      });

      await databaseBuilder.commit();

      //when
      const result = await combinedCourseRepository.findByModuleIdAndOrganizationIds({
        moduleId,
        organizationIds: [organizationId, organizationId2],
      });

      //then
      expect(result).lengthOf(2);
      expect(result[0]).instanceOf(CombinedCourse);
      expect(result[1]).instanceOf(CombinedCourse);
      expect(result).deep.members([
        {
          id: combinedCourseWithModule.id,
          code: combinedCourseWithModule.code,
          organizationId: combinedCourseWithModule.organizationId,
          name: combinedCourseWithModule.name,
          description: combinedCourseWithModule.description,
          illustration: combinedCourseWithModule.illustration,
          participations: [],
          questId: combinedCourseWithModule.questId,
        },
        {
          id: combinedCourseWithModuleAndOtherOrga.id,
          code: combinedCourseWithModuleAndOtherOrga.code,
          organizationId: combinedCourseWithModuleAndOtherOrga.organizationId,
          name: combinedCourseWithModuleAndOtherOrga.name,
          description: combinedCourseWithModuleAndOtherOrga.description,
          illustration: combinedCourseWithModuleAndOtherOrga.illustration,
          participations: [],
          questId: combinedCourseWithModuleAndOtherOrga.questId,
        },
      ]);
    });

    it('should return an empty array when the tuple organizationId and moduleId is not found in combined_courses', async function () {
      //given
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const moduleId = 'module-abc';

      await databaseBuilder.commit();

      //when
      const result = await combinedCourseRepository.findByModuleIdAndOrganizationIds({
        moduleId,
        organizationIds: [organizationId],
      });

      //then
      expect(result).lengthOf(0);
    });
  });
});
