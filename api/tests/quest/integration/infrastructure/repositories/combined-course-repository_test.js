import { CombinedCourse } from '../../../../../src/quest/domain/models/CombinedCourse.js';
import { Quest } from '../../../../../src/quest/domain/models/Quest.js';
import * as combinedCourseRepository from '../../../../../src/quest/infrastructure/repositories/combined-course-repository.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, expect, knex } from '../../../../test-helper.js';

describe('Quest | Integration | Repository | combined-course', function () {
  describe('#getByCode', function () {
    it('should return a quest if code exists', async function () {
      // given
      const code = 'SOMETHING';
      const { id: organizationId } = databaseBuilder.factory.buildOrganization();
      const quest = databaseBuilder.factory.buildQuest({ code, organizationId });
      await databaseBuilder.commit();

      // when
      const combinedCourseResult = await combinedCourseRepository.getByCode({ code });

      // then
      expect(combinedCourseResult).to.be.an.instanceof(CombinedCourse);
      expect(combinedCourseResult).to.deep.equal(new CombinedCourse(quest));
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
      const id = 1;
      const { id: organizationId } = databaseBuilder.factory.buildOrganization();
      const quest = databaseBuilder.factory.buildQuestForCombinedCourse({ id: 1, code: 'COMBINIX1', organizationId });
      await databaseBuilder.commit();

      // when
      const combinedCourseResult = await combinedCourseRepository.getById({ id });

      // then
      expect(combinedCourseResult).to.be.an.instanceof(CombinedCourse);
      expect(combinedCourseResult).to.deep.equal(new CombinedCourse(quest));
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
    it('should return all combined courses for a given organization', async function () {
      // given
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      const quest1 = databaseBuilder.factory.buildQuestForCombinedCourse({
        code: 'COURSE1',
        name: 'Parcours 1',
        organizationId,
      });
      const quest2 = databaseBuilder.factory.buildQuestForCombinedCourse({
        code: 'COURSE2',
        name: 'Parcours 2',
        organizationId,
      });
      await databaseBuilder.commit();

      // when
      const combinedCourses = await combinedCourseRepository.findByOrganizationId({ organizationId });

      // then
      expect(combinedCourses).to.have.lengthOf(2);
      expect(combinedCourses[0]).to.be.an.instanceof(CombinedCourse);
      expect(combinedCourses[1]).to.be.an.instanceof(CombinedCourse);
      expect(combinedCourses[0]).to.deep.equal(new CombinedCourse(quest1));
      expect(combinedCourses[1]).to.deep.equal(new CombinedCourse(quest2));
    });

    it('should return an empty array when organization has no combined courses', async function () {
      // given
      const organizationId = databaseBuilder.factory.buildOrganization().id;
      await databaseBuilder.commit();

      // when
      const combinedCourses = await combinedCourseRepository.findByOrganizationId({ organizationId });

      // then
      expect(combinedCourses).to.deep.equal([]);
    });

    it('should not return combined courses from other organizations', async function () {
      // given
      const organization1Id = databaseBuilder.factory.buildOrganization().id;
      const organization2Id = databaseBuilder.factory.buildOrganization().id;
      databaseBuilder.factory.buildQuestForCombinedCourse({
        code: 'COURSE1',
        name: 'Parcours 1',
        organizationId: organization1Id,
      });
      databaseBuilder.factory.buildQuestForCombinedCourse({
        code: 'COURSE2',
        name: 'Parcours 2',
        organizationId: organization2Id,
      });
      await databaseBuilder.commit();

      // when
      const combinedCourses = await combinedCourseRepository.findByOrganizationId({
        organizationId: organization1Id,
      });

      // then
      expect(combinedCourses).to.have.lengthOf(1);
      expect(combinedCourses[0].organizationId).to.equal(organization1Id);
    });
  });

  describe('#getByCampaignId', function () {
    let organizationId, quest, campaignId;

    beforeEach(async function () {
      // given
      organizationId = databaseBuilder.factory.buildOrganization().id;
      campaignId = databaseBuilder.factory.buildCampaign({ organizationId }).id;
      const code = 'ABCDE1234';
      const name = 'Mon parcours Combiné';
      const description = 'Le but de ma quête';
      const illustration = 'images/illustration.svg';
      quest = databaseBuilder.factory.buildQuestForCombinedCourse({
        code,
        name,
        organizationId,
        description,
        illustration,
        successRequirements: [
          {
            requirement_type: 'campaignParticipations',
            comparison: 'all',
            data: {
              campaignId: {
                data: campaignId,
                comparison: 'equal',
              },
              status: {
                data: 'SHARED',
                comparison: 'equal',
              },
            },
          },
        ],
      });
      await databaseBuilder.commit();
    });

    it('should return a combinedCourse that include a given campaignId', async function () {
      // when
      const combinedCourseResult = await combinedCourseRepository.findByCampaignId({ campaignId });

      // then
      expect(combinedCourseResult).lengthOf(1);
      expect(combinedCourseResult[0]).instanceof(CombinedCourse);
      expect(combinedCourseResult[0]).deep.equal(new CombinedCourse(quest));
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
          requirement_type: 'campaignParticipations',
          comparison: 'all',
          data: {
            targetProfileId: {
              data: 1,
              comparison: 'equal',
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
          requirement_type: 'campaignParticipations',
          comparison: 'all',
          data: {
            targetProfileId: {
              data: 1,
              comparison: 'equal',
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
});
