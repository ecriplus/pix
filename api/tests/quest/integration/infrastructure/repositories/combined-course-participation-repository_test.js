import sinon from 'sinon';

import { CombinedCourseParticipationStatuses } from '../../../../../src/prescription/shared/domain/constants.js';
import { CombinedCourseParticipation } from '../../../../../src/quest/domain/models/CombinedCourseParticipation.js';
import * as combinedCourseParticipationRepository from '../../../../../src/quest/infrastructure/repositories/combined-course-participation-repository.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, expect, knex } from '../../../../test-helper.js';

describe('Quest | Integration | Infrastructure | repositories | Combined-Course-Participation', function () {
  describe('#save', function () {
    it('should insert combined course participation', async function () {
      //given
      const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner().id;
      const { questId } = databaseBuilder.factory.buildCombinedCourse();

      await databaseBuilder.commit();

      //when
      await combinedCourseParticipationRepository.save({
        organizationLearnerId,
        questId,
      });

      //then
      const [participation] = await knex('combined_course_participations').where({
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
      const { questId } = databaseBuilder.factory.buildCombinedCourse();
      databaseBuilder.factory.buildCombinedCourseParticipation({
        organizationLearnerId,
        questId,
        status: CombinedCourseParticipationStatuses.COMPLETED,
      });
      await databaseBuilder.commit();

      // when
      await combinedCourseParticipationRepository.save({ organizationLearnerId, questId });

      // then
      const [participation] = await knex('combined_course_participations').where({
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
      const { questId } = databaseBuilder.factory.buildCombinedCourse();
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
  describe('#update', function () {
    let clock;
    const now = new Date('2025-07-07');

    beforeEach(function () {
      clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
    });

    afterEach(function () {
      clock.restore();
    });

    it('should update only status and updatedAt for given id', async function () {
      //given
      const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner().id;
      const { questId } = databaseBuilder.factory.buildCombinedCourse();
      const combinedCourseParticipationFromDB = databaseBuilder.factory.buildCombinedCourseParticipation({
        organizationLearnerId,
        questId,
        status: CombinedCourseParticipationStatuses.STARTED,
        createdAt: new Date('2022-01-01'),
        updatedAt: new Date('2022-01-01'),
      });

      await databaseBuilder.commit();

      //when
      const combinedCourseParticipation = new CombinedCourseParticipation({
        ...combinedCourseParticipationFromDB,
        questId: 1,
        organizationLearnerId: 1,
      });
      combinedCourseParticipation.complete();

      const updatedParticipation = await combinedCourseParticipationRepository.update({
        combinedCourseParticipation,
      });

      //then
      expect(updatedParticipation.id).to.equal(combinedCourseParticipationFromDB.id);
      expect(updatedParticipation.organizationLearnerId).to.equal(
        combinedCourseParticipationFromDB.organizationLearnerId,
      );
      expect(updatedParticipation.questId).to.equal(combinedCourseParticipationFromDB.questId);
      expect(updatedParticipation.status).to.deep.equal(CombinedCourseParticipationStatuses.COMPLETED);
      expect(updatedParticipation.updatedAt).to.deep.equal(now);
    });
  });
  describe('#findByCombinedCourseId', function () {
    it('should return participations for a given questId', async function () {
      // given
      const learner = databaseBuilder.factory.buildOrganizationLearner({ firstName: 'Paul', lastName: 'Azerty' });
      const { id: combinedCourseId, questId } = databaseBuilder.factory.buildCombinedCourse({ code: 'COMBI1' });
      const participation1 = databaseBuilder.factory.buildCombinedCourseParticipation({
        organizationLearnerId: learner.id,
        questId,
        status: CombinedCourseParticipationStatuses.COMPLETED,
      });
      const anotherlearner = databaseBuilder.factory.buildOrganizationLearner({
        firstName: 'Jeanne',
        lastName: 'Qwertee',
      });
      const participation2 = databaseBuilder.factory.buildCombinedCourseParticipation({
        organizationLearnerId: anotherlearner.id,
        questId,
        status: CombinedCourseParticipationStatuses.STARTED,
      });
      const anotherquestId = databaseBuilder.factory.buildCombinedCourse({ code: 'COMBI2' }).questId;
      databaseBuilder.factory.buildCombinedCourseParticipation({
        organizationLearnerId: anotherlearner.id,
        questId: anotherquestId,
        status: CombinedCourseParticipationStatuses.COMPLETED,
      });

      await databaseBuilder.commit();

      // when
      const results = await combinedCourseParticipationRepository.findByCombinedCourseId({ combinedCourseId });

      // then
      expect(results).lengthOf(2);
      expect(results[0]).instanceOf(CombinedCourseParticipation);
      expect(results[1]).instanceOf(CombinedCourseParticipation);

      expect(results).deep.equal([
        {
          id: participation1.id,
          firstName: learner.firstName,
          lastName: learner.lastName,
          status: CombinedCourseParticipationStatuses.COMPLETED,
          createdAt: participation1.createdAt,
          updatedAt: participation1.updatedAt,
          organizationLearnerId: learner.id,
          questId,
        },
        {
          id: participation2.id,
          firstName: anotherlearner.firstName,
          lastName: anotherlearner.lastName,
          status: CombinedCourseParticipationStatuses.STARTED,
          createdAt: participation2.createdAt,
          updatedAt: participation2.updatedAt,
          organizationLearnerId: anotherlearner.id,
          questId,
        },
      ]);
    });
  });

  describe('#findByCombinedCourseIds', function () {
    it('should return participations for given quest IDs', async function () {
      // given
      const learner1 = databaseBuilder.factory.buildOrganizationLearner({ firstName: 'Alice', lastName: 'Azerty' });
      const learner2 = databaseBuilder.factory.buildOrganizationLearner({ firstName: 'Bob', lastName: 'Bernard' });

      const { id: combinedCourseId1, questId: questId1 } = databaseBuilder.factory.buildCombinedCourse({
        code: 'COMBI1',
      });
      const { id: combinedCourseId2, questId: questId2 } = databaseBuilder.factory.buildCombinedCourse({
        code: 'COMBI2',
      });
      const { questId: questId3 } = databaseBuilder.factory.buildCombinedCourse({
        code: 'COMBI3',
      });

      const participation1 = databaseBuilder.factory.buildCombinedCourseParticipation({
        organizationLearnerId: learner1.id,
        questId: questId1,
        status: CombinedCourseParticipationStatuses.COMPLETED,
      });
      const participation2 = databaseBuilder.factory.buildCombinedCourseParticipation({
        organizationLearnerId: learner2.id,
        questId: questId2,
        status: CombinedCourseParticipationStatuses.STARTED,
      });
      // Participation that should not be included
      databaseBuilder.factory.buildCombinedCourseParticipation({
        organizationLearnerId: learner1.id,
        questId: questId3,
        status: CombinedCourseParticipationStatuses.COMPLETED,
      });

      await databaseBuilder.commit();

      // when
      const results = await combinedCourseParticipationRepository.findByCombinedCourseIds({
        combinedCourseIds: [combinedCourseId1, combinedCourseId2],
      });

      // then
      expect(results).lengthOf(2);
      expect(results[0]).instanceOf(CombinedCourseParticipation);
      expect(results[1]).instanceOf(CombinedCourseParticipation);

      expect(results).deep.equal([
        {
          id: participation1.id,
          firstName: learner1.firstName,
          lastName: learner1.lastName,
          status: CombinedCourseParticipationStatuses.COMPLETED,
          createdAt: participation1.createdAt,
          updatedAt: participation1.updatedAt,
          organizationLearnerId: learner1.id,
          questId: questId1,
        },
        {
          id: participation2.id,
          firstName: learner2.firstName,
          lastName: learner2.lastName,
          status: CombinedCourseParticipationStatuses.STARTED,
          createdAt: participation2.createdAt,
          updatedAt: participation2.updatedAt,
          organizationLearnerId: learner2.id,
          questId: questId2,
        },
      ]);
    });

    it('should return empty array when no participations match the quest IDs', async function () {
      // given
      const { id: combinedCourseId1 } = databaseBuilder.factory.buildCombinedCourse({ code: 'COMBI1' });
      const { id: combinedCourseId2 } = databaseBuilder.factory.buildCombinedCourse({ code: 'COMBI2' });
      await databaseBuilder.commit();

      // when
      const results = await combinedCourseParticipationRepository.findByCombinedCourseIds({
        combinedCourseIds: [combinedCourseId1, combinedCourseId2],
      });

      // then
      expect(results).to.deep.equal([]);
    });
  });
});
