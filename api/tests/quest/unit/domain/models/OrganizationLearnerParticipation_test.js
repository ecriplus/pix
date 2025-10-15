import { StatusesEnumValues } from '../../../../../src/devcomp/domain/models/module/UserModuleStatus.js';
import { CombinedCourseParticipationStatuses } from '../../../../../src/prescription/shared/domain/constants.js';
import {
  OrganizationLearnerParticipation,
  OrganizationLearnerParticipationStatuses,
  OrganizationLearnerParticipationTypes,
} from '../../../../../src/quest/domain/models/OrganizationLearnerParticipation.js';
import { expect } from '../../../../test-helper.js';

describe('Quest | Unit | Domain | Models | OrganizationLearnerParticipation', function () {
  describe('buildFromPassage', function () {
    it('should instantiate an OrganizationLearnerParticipation with passage data', function () {
      // given && when
      const organizationLearnerParticipation = OrganizationLearnerParticipation.buildFromPassage({
        id: 12,
        organizationLearnerId: 15,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2025-01-01'),
        terminatedAt: new Date('2025-02-01'),
        deletedAt: new Date('2025-03-01'),
        deletedBy: 13,
        status: StatusesEnumValues.IN_PROGRESS,
        moduleId: 'abcdef-42',
      });

      // then
      expect(organizationLearnerParticipation.id).to.equal(12);
      expect(organizationLearnerParticipation.organizationLearnerId).to.equal(15);
      expect(organizationLearnerParticipation.createdAt).deep.to.equal(new Date('2024-01-01'));
      expect(organizationLearnerParticipation.updatedAt).deep.to.equal(new Date('2025-01-01'));
      expect(organizationLearnerParticipation.completedAt).deep.to.equal(new Date('2025-02-01'));
      expect(organizationLearnerParticipation.deletedAt).deep.to.equal(new Date('2025-03-01'));
      expect(organizationLearnerParticipation.deletedBy).to.equal(13);
      expect(organizationLearnerParticipation.type).to.equal(OrganizationLearnerParticipationTypes.PASSAGE);
      expect(organizationLearnerParticipation.attributes).deep.equal(JSON.stringify({ id: 'abcdef-42' }));
    });

    describe('status', function () {
      it('should map IN_PROGRESS to STARTED status on OrganizationLearnerParticipation', function () {
        // given && when
        const organizationLearnerParticipation = OrganizationLearnerParticipation.buildFromPassage({
          status: StatusesEnumValues.IN_PROGRESS,
        });

        // then
        expect(organizationLearnerParticipation.status).to.equal(OrganizationLearnerParticipationStatuses.STARTED);
      });

      it('should map modules status COMPLETED to OrganizationLearnerParticipation COMPLETED status on OrganizationLearnerParticipation', function () {
        // given && when
        const organizationLearnerParticipation = OrganizationLearnerParticipation.buildFromPassage({
          status: StatusesEnumValues.COMPLETED,
        });

        // then
        expect(organizationLearnerParticipation.status).to.equal(OrganizationLearnerParticipationStatuses.COMPLETED);
      });

      it('should map modules status NOT_STARTED to OrganizationLearnerParticipation NOT_STARTED status on OrganizationLearnerParticipation', function () {
        // given && when
        const organizationLearnerParticipation = OrganizationLearnerParticipation.buildFromPassage({
          status: StatusesEnumValues.NOT_STARTED,
        });

        // then
        expect(organizationLearnerParticipation.status).to.equal(OrganizationLearnerParticipationStatuses.NOT_STARTED);
      });
    });
  });
  describe('buildFromCombinedCourseParticipation', function () {
    it('should instantiate an OrganizationLearnerParticipation with combined course participaiton data', function () {
      // given && when
      const organizationLearnerParticipation = OrganizationLearnerParticipation.buildFromCombinedCourseParticipation({
        id: 12,
        organizationLearnerId: 15,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2025-01-01'),
        status: CombinedCourseParticipationStatuses.STARTED,
        combinedCourseId: 1,
      });

      // then
      expect(organizationLearnerParticipation.id).to.equal(12);
      expect(organizationLearnerParticipation.organizationLearnerId).to.equal(15);
      expect(organizationLearnerParticipation.createdAt).deep.to.equal(new Date('2024-01-01'));
      expect(organizationLearnerParticipation.updatedAt).deep.to.equal(new Date('2025-01-01'));
      expect(organizationLearnerParticipation.completedAt).to.equal(null);
      expect(organizationLearnerParticipation.deletedAt).to.equal(null);
      expect(organizationLearnerParticipation.deletedBy).to.equal(null);
      expect(organizationLearnerParticipation.type).to.equal(OrganizationLearnerParticipationTypes.COMBINED_COURSE);
      expect(organizationLearnerParticipation.attributes).deep.equal(JSON.stringify({ id: 1 }));
    });
  });
  describe('when participation is completed', function () {
    it('it should insert updatedAt date into completedAt', function () {
      // given && when
      const organizationLearnerParticipation = OrganizationLearnerParticipation.buildFromCombinedCourseParticipation({
        id: 12,
        organizationLearnerId: 15,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2025-02-01'),
        status: CombinedCourseParticipationStatuses.COMPLETED,
        combinedCourseId: 1,
      });

      // then
      expect(organizationLearnerParticipation.id).to.equal(12);
      expect(organizationLearnerParticipation.organizationLearnerId).to.equal(15);
      expect(organizationLearnerParticipation.createdAt).deep.to.equal(new Date('2024-01-01'));
      expect(organizationLearnerParticipation.updatedAt).deep.to.equal(new Date('2025-02-01'));
      expect(organizationLearnerParticipation.completedAt).deep.to.equal(new Date('2025-02-01'));
    });
  });
});
