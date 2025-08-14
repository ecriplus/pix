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

  describe('#saveInBatch', function () {
    it('should save given combined course', async function () {
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
      const firstSavedCombinedCourse = await knex('quests').where('organizationId', firstOrganizationId).first();
      const secondSavedCombinedCourse = await knex('quests').where('organizationId', secondOrganizationId).first();

      expect(firstSavedCombinedCourse.name).to.equal('firstCombinedCourse');
      expect(firstSavedCombinedCourse.successRequirements).to.deep.equal(successRequirements);

      expect(secondSavedCombinedCourse.name).to.equal('secondCombinedCourse');
      expect(secondSavedCombinedCourse.successRequirements).to.deep.equal(successRequirements);
    });
  });
});
