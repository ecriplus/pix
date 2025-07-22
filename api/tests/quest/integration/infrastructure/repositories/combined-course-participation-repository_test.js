import { CombinedCourseParticipationStatuses } from '../../../../../src/prescription/shared/domain/constants.js';
import * as combinedCourseParticipationRepository from '../../../../../src/quest/infrastructure/repositories/combined-course-participation-repository.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, expect, knex } from '../../../../test-helper.js';

describe('Quest | Integration | Infrastructure | repositories | Combined-Course-Participation', function () {
  describe('#save', function () {
    it('should insert combined course participation', async function () {
      //given
      const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner().id;
      const questId = databaseBuilder.factory.buildQuestForCombinedCourse().id;
      await databaseBuilder.commit();

      //when
      await combinedCourseParticipationRepository.save({
        organizationLearnerId,
        questId,
      });

      //then
      const [participation] = await knex('quest_participations').where({
        organizationLearnerId,
        questId,
      });
      expect(participation.id).to.be.finite;
      expect(participation.questId).to.deep.equal(questId);
      expect(participation.organizationLearnerId).to.deep.equal(organizationLearnerId);
      expect(participation.status).to.deep.equal(CombinedCourseParticipationStatuses.STARTED);
    });

    it('should left intact combined course participation for given organization learner and quest ids', async function () {
      // given
      const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner().id;
      const questId = databaseBuilder.factory.buildQuestForCombinedCourse().id;
      databaseBuilder.factory.buildCombinedCourseParticipation({
        organizationLearnerId,
        questId,
        status: CombinedCourseParticipationStatuses.COMPLETED,
      });
      await databaseBuilder.commit();

      // when
      await combinedCourseParticipationRepository.save({ organizationLearnerId, questId });

      // then
      const [participation] = await knex('quest_participations').where({
        organizationLearnerId,
        questId,
      });
      expect(participation.id).to.be.finite;
      expect(participation.questId).to.deep.equal(questId);
      expect(participation.organizationLearnerId).to.deep.equal(organizationLearnerId);
      expect(participation.status).to.deep.equal(CombinedCourseParticipationStatuses.COMPLETED);
    });
  });
  describe('#getByUserId', function () {
    it('should return quest participation for given user and quest', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({ userId }).id;
      const questId = databaseBuilder.factory.buildQuestForCombinedCourse().id;
      databaseBuilder.factory.buildCombinedCourseParticipation({
        organizationLearnerId,
        questId,
        status: CombinedCourseParticipationStatuses.COMPLETED,
      });
      await databaseBuilder.commit();

      // when
      const result = await combinedCourseParticipationRepository.getByUserId({ userId, questId });

      // then
      expect(result.id).to.be.finite;
      expect(result.questId).to.deep.equal(questId);
      expect(result.organizationLearnerId).to.deep.equal(organizationLearnerId);
      expect(result.status).to.deep.equal(CombinedCourseParticipationStatuses.COMPLETED);
    });

    it('should throw NotFound error when quest participation does not exist for given user and quest', async function () {
      // given
      const userId = 1;
      const questId = 2;

      // when
      const error = await catchErr(combinedCourseParticipationRepository.getByUserId)({ userId, questId });

      // then
      expect(error).to.be.instanceof(NotFoundError);
      expect(error.message).to.equal(
        `CombinedCourseParticipation introuvable pour l'utilisateur d'id ${userId} et la quête d'id ${questId}`,
      );
    });
  });
});
