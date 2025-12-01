import sinon from 'sinon';

import { CombinedCourseParticipationStatuses } from '../../../../../src/prescription/shared/domain/constants.js';
import { CombinedCourseParticipation } from '../../../../../src/quest/domain/models/CombinedCourseParticipation.js';
import {
  OrganizationLearnerParticipationStatuses,
  OrganizationLearnerParticipationTypes,
} from '../../../../../src/quest/domain/models/OrganizationLearnerParticipation.js';
import * as combinedCourseParticipationRepository from '../../../../../src/quest/infrastructure/repositories/combined-course-participation-repository.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, expect, knex } from '../../../../test-helper.js';

describe('Quest | Integration | Infrastructure | repositories | Combined-Course-Participation', function () {
  describe('#save', function () {
    it('should insert organization learner participations of type combined course', async function () {
      //given
      const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner().id;
      const { id: combinedCourseId } = databaseBuilder.factory.buildCombinedCourse();

      await databaseBuilder.commit();

      //when
      await combinedCourseParticipationRepository.save({
        organizationLearnerId,
        combinedCourseId,
      });

      //then
      const participations = await knex('organization_learner_participations')
        .select(
          'id as combinedCourseParticipationId',
          'referenceId as combinedCourseParticipationsCombinedCourseId',
          'status as combinedCourseParticipationStatus',
          'organizationLearnerId as combinedCourseParticipationsOrganizationLearnerId',
          'createdAt as combinedCourseParticipationsCreatedAt',
          'updatedAt as combinedCourseParticipationsUpdatedAt',
          'type',
        )
        .where({
          'organization_learner_participations.organizationLearnerId': organizationLearnerId,
          referenceId: combinedCourseId,
        });

      expect(participations).to.have.lengthOf(1);

      const participation = participations[0];

      expect(participation.combinedCourseParticipationsCombinedCourseId).equal(combinedCourseId.toString());
      expect(participation.combinedCourseParticipationStatus).equal(OrganizationLearnerParticipationStatuses.STARTED);
      expect(participation.type).equal(OrganizationLearnerParticipationTypes.COMBINED_COURSE);
      expect(participation.combinedCourseParticipationsOrganizationLearnerId).equal(organizationLearnerId);
    });

    it('should left intact combined course participation for given organization learner and combined course id', async function () {
      // given
      const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner().id;
      const { id: combinedCourseId } = databaseBuilder.factory.buildCombinedCourse();
      databaseBuilder.factory.buildOrganizationLearnerParticipation({
        organizationLearnerId,
        combinedCourseId,
        status: OrganizationLearnerParticipationStatuses.COMPLETED,
        type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
      });
      await databaseBuilder.commit();

      // when
      await combinedCourseParticipationRepository.save({ organizationLearnerId, combinedCourseId });

      // then
      const participations = await knex('organization_learner_participations').where({
        organizationLearnerId,
      });

      expect(participations).to.have.lengthOf(1);
      expect(participations[0].organizationLearnerId).to.deep.equal(organizationLearnerId);
      expect(participations[0].status).equal(OrganizationLearnerParticipationStatuses.COMPLETED);
      expect(participations[0].referenceId).equal(combinedCourseId.toString());
    });
  });

  describe('#findById', function () {
    it('should return combined course participation for given participationId', async function () {
      // given
      const { id: organizationLearnerId } = databaseBuilder.factory.buildOrganizationLearner();
      const { id: participationId } = databaseBuilder.factory.buildOrganizationLearnerParticipation({
        organizationLearnerId,
        status: OrganizationLearnerParticipationStatuses.STARTED,
        type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
      });
      await databaseBuilder.commit();

      // when
      const result = await combinedCourseParticipationRepository.findById({ participationId });

      // then
      expect(result.id).equal(participationId);
      expect(result.organizationLearnerId).equal(organizationLearnerId);
    });

    it('should return null when participation does not have combined course type', async function () {
      // given
      const { id: organizationLearnerId } = databaseBuilder.factory.buildOrganizationLearner();
      const { id: participationId } = databaseBuilder.factory.buildOrganizationLearnerParticipation({
        organizationLearnerId,
        status: OrganizationLearnerParticipationStatuses.STARTED,
        type: OrganizationLearnerParticipationTypes.PASSAGE,
      });
      await databaseBuilder.commit();

      // when
      const result = await combinedCourseParticipationRepository.findById({ participationId });

      // then
      expect(result).null;
    });

    it('should return null when organization learner is deleted', async function () {
      // given
      const { id: userId } = databaseBuilder.factory.buildUser();
      const { id: organizationLearnerId } = databaseBuilder.factory.buildOrganizationLearner({
        deletedAt: new Date(),
        deletedBy: userId,
      });
      const { id: participationId } = databaseBuilder.factory.buildOrganizationLearnerParticipation({
        organizationLearnerId,
        status: OrganizationLearnerParticipationStatuses.STARTED,
        type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
      });
      await databaseBuilder.commit();

      // when
      const result = await combinedCourseParticipationRepository.findById({ participationId });

      // then
      expect(result).null;
    });

    it('should return null when participation has been deleted', async function () {
      // given
      const { id: userId } = databaseBuilder.factory.buildUser();
      const { id: organizationLearnerId } = databaseBuilder.factory.buildOrganizationLearner();
      const { id: participationId } = databaseBuilder.factory.buildOrganizationLearnerParticipation({
        organizationLearnerId,
        status: OrganizationLearnerParticipationStatuses.STARTED,
        type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
        deletedAt: new Date(),
        deletedBy: userId,
      });

      // when
      const result = await combinedCourseParticipationRepository.findById({ participationId });

      // then
      expect(result).null;
    });

    it('should return null when participation does not exist', async function () {
      // when
      const result = await combinedCourseParticipationRepository.findById({ participationId: 12 });

      // then
      expect(result).null;
    });
  });

  describe('#isParticipationOnCombinedCourse', function () {
    it('should return true if participation is on combined course', async function () {
      // given
      const { id: combinedCourseId } = databaseBuilder.factory.buildCombinedCourse();
      const { id: participationId } = databaseBuilder.factory.buildOrganizationLearnerParticipation({
        combinedCourseId,
        type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
        status: OrganizationLearnerParticipationStatuses.STARTED,
      });
      await databaseBuilder.commit();

      // when
      const result = await combinedCourseParticipationRepository.isParticipationOnCombinedCourse({
        combinedCourseId,
        participationId,
      });

      // then
      expect(result).true;
    });

    it('should return false if participation is not on combined course', async function () {
      // given
      const { id: combinedCourseId } = databaseBuilder.factory.buildCombinedCourse();
      const { id: participationId } = databaseBuilder.factory.buildOrganizationLearnerParticipation({
        combinedCourseId: '123',
        type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
        status: OrganizationLearnerParticipationStatuses.STARTED,
      });
      await databaseBuilder.commit();

      // when
      const result = await combinedCourseParticipationRepository.isParticipationOnCombinedCourse({
        combinedCourseId,
        participationId,
      });

      // then
      expect(result).false;
    });

    it('should return false if participation is not of COMBINED_COURSE type', async function () {
      // given
      const { id: combinedCourseId } = databaseBuilder.factory.buildCombinedCourse();
      const { id: participationId } = databaseBuilder.factory.buildOrganizationLearnerParticipation({
        combinedCourseId,
        type: OrganizationLearnerParticipationTypes.PASSAGE,
        status: OrganizationLearnerParticipationStatuses.STARTED,
      });
      await databaseBuilder.commit();

      // when
      const result = await combinedCourseParticipationRepository.isParticipationOnCombinedCourse({
        combinedCourseId,
        participationId,
      });

      // then
      expect(result).false;
    });
  });

  describe('#getByUserId', function () {
    it('should return combinedCourse participation for given user and combinedCourse ids', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const {
        firstName,
        lastName,
        id: organizationLearnerId,
      } = databaseBuilder.factory.buildOrganizationLearner({ userId });
      const { id: combinedCourseId } = databaseBuilder.factory.buildCombinedCourse();
      databaseBuilder.factory.buildOrganizationLearnerParticipation({
        organizationLearnerId,
        status: OrganizationLearnerParticipationStatuses.COMPLETED,
        type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
        combinedCourseId,
      });
      await databaseBuilder.commit();

      // when
      const result = await combinedCourseParticipationRepository.getByUserId({ userId, combinedCourseId });

      // then
      expect(result.combinedCourseId).to.deep.equal(combinedCourseId);
      expect(result.organizationLearnerId).to.deep.equal(organizationLearnerId);
      expect(result.firstName).equal(firstName);
      expect(result.lastName).equal(lastName);
      expect(result.status).to.deep.equal(OrganizationLearnerParticipationStatuses.COMPLETED);
    });

    it('should throw NotFound error when combinedCourse participation does not exist for given user and combinedCourse ids', async function () {
      // given
      const userId = 1;
      const combinedCourseId = 2;

      // when
      const error = await catchErr(combinedCourseParticipationRepository.getByUserId)({ userId, combinedCourseId });

      // then
      expect(error).to.be.instanceof(NotFoundError);
      expect(error.message).to.equal(
        `CombinedCourseParticipation introuvable pour l'utilisateur d'id ${userId} et au parcours d'id ${combinedCourseId}`,
      );
    });
  });

  describe('#findMostRecentByLearnerId', function () {
    it('should return most recent combinedCourse participation for given learnerId and combinedCourse ids', async function () {
      // given
      const {
        firstName,
        lastName,
        id: organizationLearnerId,
        organizationId,
      } = databaseBuilder.factory.buildOrganizationLearner();
      const { id: combinedCourseId } = databaseBuilder.factory.buildCombinedCourse({ organizationId });
      const expectedCombinedCourseParticipation = databaseBuilder.factory.buildOrganizationLearnerParticipation({
        organizationLearnerId,
        status: OrganizationLearnerParticipationStatuses.COMPLETED,
        type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
        createdAt: new Date('2025-01-01'),
        combinedCourseId,
      });
      databaseBuilder.factory.buildOrganizationLearnerParticipation({
        organizationLearnerId,
        status: OrganizationLearnerParticipationStatuses.COMPLETED,
        type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
        createdAt: new Date('2024-01-01'),
        combinedCourseId,
      });
      await databaseBuilder.commit();

      // when
      const result = await combinedCourseParticipationRepository.findMostRecentByLearnerId({
        organizationLearnerId,
        combinedCourseId,
      });

      // then
      expect(result).instanceOf(CombinedCourseParticipation);
      expect(result.id).equal(expectedCombinedCourseParticipation.id);
      expect(result.combinedCourseId).equal(combinedCourseId);
      expect(result.organizationLearnerId).equal(organizationLearnerId);
      expect(result.firstName).equal(firstName);
      expect(result.lastName).equal(lastName);
      expect(result.status).equal(OrganizationLearnerParticipationStatuses.COMPLETED);
    });

    it('should return null when participation is not found', async function () {
      // given
      const organizationLearnerId = 1;
      const combinedCourseId = 2;

      // when
      const result = await combinedCourseParticipationRepository.findMostRecentByLearnerId({
        organizationLearnerId,
        combinedCourseId,
      });

      // then
      expect(result).null;
    });
  });

  describe('#findPaginatedCombinedCourseParticipationById', function () {
    let combinedCourseId;
    let organizationLearner1, organizationLearner2, organizationLearner3;

    beforeEach(async function () {
      //given
      const combinedCourse = databaseBuilder.factory.buildCombinedCourse();
      combinedCourseId = combinedCourse.id;

      organizationLearner1 = databaseBuilder.factory.buildOrganizationLearner({
        firstName: 'Georges',
        lastName: 'Zelio',
        division: '6eme',
        group: null,
        organizationId: combinedCourse.organizationId,
      });
      organizationLearner2 = databaseBuilder.factory.buildOrganizationLearner({
        firstName: 'Loubna',
        lastName: 'Aresto',
        division: '6eme',
        group: null,
        organizationId: combinedCourse.organizationId,
      });
      organizationLearner3 = databaseBuilder.factory.buildOrganizationLearner({
        userId: null,
        firstName: 'Nour',
        lastName: 'Aresto',
        division: null,
        group: 'A',
        organizationId: combinedCourse.organizationId,
      });

      databaseBuilder.factory.buildOrganizationLearnerParticipation({
        organizationLearnerId: organizationLearner1.id,
        combinedCourseId,
        type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
        status: OrganizationLearnerParticipationStatuses.STARTED,
      });
      databaseBuilder.factory.buildOrganizationLearnerParticipation({
        organizationLearnerId: organizationLearner2.id,
        combinedCourseId,
        type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
        status: OrganizationLearnerParticipationStatuses.STARTED,
      });
      databaseBuilder.factory.buildOrganizationLearnerParticipation({
        organizationLearnerId: organizationLearner3.id,
        combinedCourseId,
        status: CombinedCourseParticipationStatuses.COMPLETED,
        type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
      });

      const { id: anotherCombinedCourseId } = databaseBuilder.factory.buildCombinedCourse({
        organizationId: combinedCourse.organizationId,
        code: 'anotherQuest',
      });
      databaseBuilder.factory.buildOrganizationLearnerParticipation({
        organizationLearnerId: organizationLearner1.id,
        combinedCourseId: anotherCombinedCourseId,
        status: CombinedCourseParticipationStatuses.COMPLETED,
        type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
      });

      await databaseBuilder.commit();
    });

    it('should return user ids only for given combinedCourse id', async function () {
      // when
      const { organizationLearnerIds } =
        await combinedCourseParticipationRepository.findPaginatedCombinedCourseParticipationById({
          combinedCourseId,
        });

      // then
      expect(organizationLearnerIds).deep.equal([
        organizationLearner2.id,
        organizationLearner3.id,
        organizationLearner1.id,
      ]);
    });

    it('should return paginated user ids', async function () {
      // when
      const { organizationLearnerIds } =
        await combinedCourseParticipationRepository.findPaginatedCombinedCourseParticipationById({
          combinedCourseId,
          page: { size: 1, number: 3 },
        });
      // then
      expect(organizationLearnerIds).deep.equal([organizationLearner1.id]);
    });

    describe('filters', function () {
      it('should return participations even with empty filters', async function () {
        // when
        const { organizationLearnerIds } =
          await combinedCourseParticipationRepository.findPaginatedCombinedCourseParticipationById({
            combinedCourseId,
            filters: {},
          });

        // then
        expect(organizationLearnerIds).deep.equal([
          organizationLearner2.id,
          organizationLearner3.id,
          organizationLearner1.id,
        ]);
      });

      it('should return participation matching learner lastName', async function () {
        // when
        const { organizationLearnerIds } =
          await combinedCourseParticipationRepository.findPaginatedCombinedCourseParticipationById({
            combinedCourseId,
            filters: { fullName: 'are' },
          });

        // then
        expect(organizationLearnerIds).deep.equal([organizationLearner2.id, organizationLearner3.id]);
      });

      it('should return participation matching learner firstName', async function () {
        // when
        const { organizationLearnerIds } =
          await combinedCourseParticipationRepository.findPaginatedCombinedCourseParticipationById({
            combinedCourseId,
            filters: { fullName: 'GEO' },
          });

        // then
        expect(organizationLearnerIds).deep.equal([organizationLearner1.id]);
      });

      it('should return participation matching participation status', async function () {
        // when
        const { organizationLearnerIds } =
          await combinedCourseParticipationRepository.findPaginatedCombinedCourseParticipationById({
            combinedCourseId,
            filters: { statuses: [CombinedCourseParticipationStatuses.STARTED] },
          });

        // then
        expect(organizationLearnerIds).deep.equal([organizationLearner2.id, organizationLearner1.id]);
      });

      it('should return participations even with empty status filter', async function () {
        // when
        const { organizationLearnerIds } =
          await combinedCourseParticipationRepository.findPaginatedCombinedCourseParticipationById({
            combinedCourseId,
            filters: { statuses: [] },
          });

        // then
        expect(organizationLearnerIds).deep.equal([
          organizationLearner2.id,
          organizationLearner3.id,
          organizationLearner1.id,
        ]);
      });

      it('should return participations matching learner division', async function () {
        // when
        const { organizationLearnerIds } =
          await combinedCourseParticipationRepository.findPaginatedCombinedCourseParticipationById({
            combinedCourseId,
            filters: { divisions: ['6eme'] },
          });

        // then
        expect(organizationLearnerIds).deep.equal([organizationLearner2.id, organizationLearner1.id]);
      });

      it('should return participations even with empty division filter', async function () {
        // when
        const { organizationLearnerIds } =
          await combinedCourseParticipationRepository.findPaginatedCombinedCourseParticipationById({
            combinedCourseId,
            filters: { divisions: [] },
          });

        // then
        expect(organizationLearnerIds).deep.equal([
          organizationLearner2.id,
          organizationLearner3.id,
          organizationLearner1.id,
        ]);
      });

      it('should return participations matching learner group', async function () {
        // when
        const { organizationLearnerIds } =
          await combinedCourseParticipationRepository.findPaginatedCombinedCourseParticipationById({
            combinedCourseId,
            filters: { groups: ['A'] },
          });

        // then
        expect(organizationLearnerIds).deep.equal([organizationLearner3.id]);
      });

      it('should return participations even with empty group filter', async function () {
        // when
        const { organizationLearnerIds } =
          await combinedCourseParticipationRepository.findPaginatedCombinedCourseParticipationById({
            combinedCourseId,
            filters: { groups: [] },
          });

        // then
        expect(organizationLearnerIds).deep.equal([
          organizationLearner2.id,
          organizationLearner3.id,
          organizationLearner1.id,
        ]);
      });
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

    it('should update only given field', async function () {
      //given
      const organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner().id;
      const { id: combinedCourseId } = databaseBuilder.factory.buildCombinedCourse();
      const combinedCourseParticipationFromDB = databaseBuilder.factory.buildOrganizationLearnerParticipation({
        organizationLearnerId,
        status: OrganizationLearnerParticipationStatuses.STARTED,
        createdAt: new Date('2022-01-01'),
        updatedAt: new Date('2022-02-01'),
        combinedCourseId,
        type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
        referenceId: combinedCourseId.toString(),
      });

      await databaseBuilder.commit();

      //when

      await combinedCourseParticipationRepository.update({
        id: combinedCourseParticipationFromDB.id,
        status: OrganizationLearnerParticipationStatuses.COMPLETED,
      });

      const updatedParticipation = await knex('organization_learner_participations')
        .where({
          id: combinedCourseParticipationFromDB.id,
        })
        .first();

      //then
      expect(updatedParticipation.id).to.equal(combinedCourseParticipationFromDB.id);
      expect(updatedParticipation.organizationLearnerId).to.equal(
        combinedCourseParticipationFromDB.organizationLearnerId,
      );
      expect(updatedParticipation.type).to.equal(OrganizationLearnerParticipationTypes.COMBINED_COURSE);
      expect(updatedParticipation.referenceId).to.equal(combinedCourseId.toString());
      expect(updatedParticipation.updatedAt).to.deep.equal(new Date('2022-02-01'));
      expect(updatedParticipation.createdAt).to.deep.equal(new Date('2022-01-01'));

      expect(updatedParticipation.status).to.deep.equal(OrganizationLearnerParticipationStatuses.COMPLETED);
    });
  });

  describe('#findByCombinedCourseIds', function () {
    it('should return a list of participations for given combinedCourse ids', async function () {
      // given
      const { id: combinedCourseId1, organizationId } = databaseBuilder.factory.buildCombinedCourse({
        code: 'COMBI1',
      });
      const { id: combinedCourseId2 } = databaseBuilder.factory.buildCombinedCourse({
        code: 'COMBI2',
        organizationId,
      });
      const { id: combinedCourseId3 } = databaseBuilder.factory.buildCombinedCourse({
        code: 'COMBI3',
      });

      const learner1 = databaseBuilder.factory.buildOrganizationLearner({
        firstName: 'Alice',
        lastName: 'Azerty',
        division: '6eme',
        group: 'Groupe 2',
        organizationId,
      });
      const learner2 = databaseBuilder.factory.buildOrganizationLearner({
        firstName: 'Bob',
        lastName: 'Bernard',
        division: '6eme',
        group: 'Groupe 2',
        organizationId,
      });

      databaseBuilder.factory.buildOrganizationLearnerParticipation({
        organizationLearnerId: learner1.id,
        status: OrganizationLearnerParticipationStatuses.COMPLETED,
        combinedCourseId: combinedCourseId1,
        type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
      });
      databaseBuilder.factory.buildOrganizationLearnerParticipation({
        organizationLearnerId: learner2.id,
        status: OrganizationLearnerParticipationStatuses.STARTED,
        combinedCourseId: combinedCourseId2,
        type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
      });
      // Participation that should not be included
      databaseBuilder.factory.buildOrganizationLearnerParticipation({
        organizationLearnerId: learner1.id,
        status: OrganizationLearnerParticipationStatuses.COMPLETED,
        combinedCourseId: combinedCourseId3,
        type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
      });

      await databaseBuilder.commit();

      // when
      const combinedCourseParticipations = await combinedCourseParticipationRepository.findByCombinedCourseIds({
        combinedCourseIds: [combinedCourseId1, combinedCourseId2],
      });

      // then
      expect(combinedCourseParticipations).lengthOf(2);
      expect(combinedCourseParticipations[0]).instanceOf(CombinedCourseParticipation);
      expect(combinedCourseParticipations[1]).instanceOf(CombinedCourseParticipation);
      expect(combinedCourseParticipations[0].status).to.deep.equal(OrganizationLearnerParticipationStatuses.COMPLETED);
      expect(combinedCourseParticipations[1].status).to.deep.equal(OrganizationLearnerParticipationStatuses.STARTED);
    });

    it('should return empty array when no participations match the combinedCourse ids', async function () {
      // given
      const { id: combinedCourseId1 } = databaseBuilder.factory.buildCombinedCourse({ code: 'COMBI1' });
      const { id: combinedCourseId2 } = databaseBuilder.factory.buildCombinedCourse({ code: 'COMBI2' });
      await databaseBuilder.commit();

      // when
      const combinedCourseParticipations = await combinedCourseParticipationRepository.findByCombinedCourseIds({
        combinedCourseIds: [combinedCourseId1, combinedCourseId2],
      });

      // then
      expect(combinedCourseParticipations).to.deep.equal([]);
    });

    it('should not return participations for deleted organisation learner', async function () {
      // given
      const { id: combinedCourseId, organizationId } = databaseBuilder.factory.buildCombinedCourse({
        code: 'COMBI1',
      });

      const deletedLearner = databaseBuilder.factory.buildOrganizationLearner({
        firstName: 'Deleted',
        lastName: 'Learner',
        organizationId,
        deletedAt: new Date('2024-01-01'),
      });

      databaseBuilder.factory.buildOrganizationLearnerParticipation({
        organizationLearnerId: deletedLearner.id,
        status: OrganizationLearnerParticipationStatuses.COMPLETED,
        combinedCourseId,
        type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
      });

      await databaseBuilder.commit();

      // when
      const combinedCourseParticipations = await combinedCourseParticipationRepository.findByCombinedCourseIds({
        combinedCourseIds: [combinedCourseId],
      });

      // then
      expect(combinedCourseParticipations).to.deep.equal([]);
    });
  });
});
