import * as assessmentSheetRepository from '../../../../../../src/certification/evaluation/infrastructure/repositories/assessment-sheet-repository.js';
import { Assessment } from '../../../../../../src/shared/domain/models/Assessment.js';
import { databaseBuilder, expect } from '../../../../../test-helper.js';
import { domainBuilder } from '../../../../../tooling/domain-builder/domain-builder.js';

describe('Integration | Certification | Evaluation | Infrastructure | Repositories | AssessmentSheetRepository', function () {
  let certificationCourseId, assessmentId, answerData;
  beforeEach(async function () {
    certificationCourseId = databaseBuilder.factory.buildCertificationCourse({
      abortReason: 'candidate',
      maxReachableLevelOnCertificationDate: 6,
      isRejectedForFraud: true,
    }).id;
    assessmentId = databaseBuilder.factory.buildAssessment({
      certificationCourseId,
      state: Assessment.states.COMPLETED,
      updatedAt: new Date('2023-10-05'),
    }).id;
    answerData = databaseBuilder.factory.buildAnswer({ assessmentId, result: 'ok' });
    await databaseBuilder.commit();
  });
  describe('#findByCertificationCourseId', function () {
    context('when the certification course exists', function () {
      it('should return the assessment sheet', async function () {
        // when
        const assessmentSheet = await assessmentSheetRepository.findByCertificationCourseId(certificationCourseId);

        // then
        expect(assessmentSheet).to.deepEqualInstance(
          domainBuilder.certification.evaluation.buildAssessmentSheet({
            certificationCourseId,
            assessmentId,
            abortReason: 'candidate',
            maxReachableLevelOnCertificationDate: 6,
            isRejectedForFraud: true,
            state: Assessment.states.COMPLETED,
            updatedAt: new Date('2023-10-05'),
            answers: [domainBuilder.buildAnswer(answerData)],
          }),
        );
      });
    });

    context('when the certification course does not exist', function () {
      it('should return null', async function () {
        // when
        const assessmentSheet = await assessmentSheetRepository.findByCertificationCourseId(certificationCourseId + 1);

        // then
        expect(assessmentSheet).to.be.null;
      });
    });
  });

  describe('#update', function () {
    it('should update only the state and the updatedAt date of the assessment the assessment sheet', async function () {
      // given
      const assessmentSheetToUpdate = domainBuilder.certification.evaluation.buildAssessmentSheet({
        certificationCourseId,
        assessmentId,
        abortReason: 'technical',
        maxReachableLevelOnCertificationDate: 1,
        isRejectedForFraud: false,
        state: Assessment.states.STARTED,
        updatedAt: new Date('2024-05-11'),
        answers: [],
      });

      // when
      await assessmentSheetRepository.update(assessmentSheetToUpdate);

      // then
      const updatedAssessmentSheet = await assessmentSheetRepository.findByCertificationCourseId(certificationCourseId);
      expect(updatedAssessmentSheet).to.deepEqualInstance(
        domainBuilder.certification.evaluation.buildAssessmentSheet({
          certificationCourseId,
          assessmentId,
          abortReason: 'candidate',
          maxReachableLevelOnCertificationDate: 6,
          isRejectedForFraud: true,
          state: Assessment.states.STARTED,
          updatedAt: new Date('2024-05-11'),
          answers: [domainBuilder.buildAnswer(answerData)],
        }),
      );
    });
  });
});
