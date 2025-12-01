import {
  OrganizationLearnerParticipation,
  OrganizationLearnerParticipationStatuses,
} from '../../../../../src/quest/domain/models/OrganizationLearnerParticipation.js';
import * as organizationLearnerParticipationPrescriptionRepository from '../../../../../src/quest/infrastructure/repositories/organization-learner-participation-repository.js';
import { databaseBuilder, expect } from '../../../../test-helper.js';

describe('Quest | Integration | Infrastructure | repositories | organization learner passage participations', function () {
  describe('#findByOrganizationLearnerIdAndModuleIds', function () {
    it('should return participations given learner and modulesIds', async function () {
      // given
      const otherLearner = databaseBuilder.factory.buildOrganizationLearner();
      databaseBuilder.factory.buildOrganizationLearnerParticipation.ofTypePassage({
        organizationLearnerId: otherLearner.id,
        moduleId: '123-abcd',
        status: OrganizationLearnerParticipationStatuses.NOT_STARTED,
      });
      const organizationLearner = databaseBuilder.factory.buildOrganizationLearner();
      databaseBuilder.factory.buildOrganizationLearnerParticipation.ofTypePassage({
        organizationLearnerId: organizationLearner.id,
        moduleId: '123-abcd',
        status: OrganizationLearnerParticipationStatuses.NOT_STARTED,
      });
      databaseBuilder.factory.buildOrganizationLearnerParticipation.ofTypePassage({
        organizationLearnerId: organizationLearner.id,
        status: OrganizationLearnerParticipationStatuses.COMPLETED,
        moduleId: '456-abcd',
      });
      databaseBuilder.factory.buildOrganizationLearnerParticipation.ofTypePassage({
        organizationLearnerId: organizationLearner.id,
        status: OrganizationLearnerParticipationStatuses.COMPLETED,
        moduleId: '789-abcd',
      });

      await databaseBuilder.commit();

      const result =
        await organizationLearnerParticipationPrescriptionRepository.findByOrganizationLearnerIdAndModuleIds({
          organizationLearnerId: organizationLearner.id,
          moduleIds: ['123-abcd', '456-abcd'],
        });

      expect(result).lengthOf(2);
      expect(result[0]).instanceOf(OrganizationLearnerParticipation);
      expect(result[1]).instanceOf(OrganizationLearnerParticipation);
    });

    it('return null on empty result', async function () {
      const result =
        await organizationLearnerParticipationPrescriptionRepository.findByOrganizationLearnerIdAndModuleIds({
          organizationLearnerId: 1234,
          moduleIds: ['123-abcd'],
        });

      expect(result).empty;
    });

    it('return null on deleted result', async function () {
      const organizationLearner = databaseBuilder.factory.buildOrganizationLearner();
      databaseBuilder.factory.buildOrganizationLearnerParticipation.ofTypePassage({
        organizationLearnerId: organizationLearner.id,
        moduleId: '123-abcd',
        status: OrganizationLearnerParticipationStatuses.NOT_STARTED,
        deletedAt: new Date('2024-01-01'),
      });

      await databaseBuilder.commit();
      const result =
        await organizationLearnerParticipationPrescriptionRepository.findByOrganizationLearnerIdAndModuleIds({
          organizationLearnerId: organizationLearner.id,
          moduleIds: ['123-abcd'],
        });

      expect(result).empty;
    });

    it('should fully instantiate model', async function () {
      // given
      const organizationLearner = databaseBuilder.factory.buildOrganizationLearner();
      const passage = databaseBuilder.factory.buildOrganizationLearnerParticipation.ofTypePassage({
        organizationLearnerId: organizationLearner.id,
        moduleId: '123-abcd',
        status: OrganizationLearnerParticipationStatuses.COMPLETED,
      });

      await databaseBuilder.commit();

      const result =
        await organizationLearnerParticipationPrescriptionRepository.findByOrganizationLearnerIdAndModuleIds({
          organizationLearnerId: organizationLearner.id,
          moduleIds: ['123-abcd'],
        });

      expect(result[0].id).equal(passage.id);
      expect(result[0].organizationLearnerId).equal(passage.organizationLearnerId);
      expect(result[0].createdAt).deep.equal(passage.createdAt);
      expect(result[0].updatedAt).deep.equal(passage.updatedAt);
      expect(result[0].completedAt).deep.equal(passage.completedAt);
      expect(result[0].deletedAt).deep.equal(passage.deletedAt);
      expect(result[0].deletedBy).equal(passage.deletedBy);
      expect(result[0].status).equal(passage.status);
      expect(result[0].type).equal(passage.type);
      expect(result[0].referenceId).equal(passage.referenceId);
    });
  });
});
