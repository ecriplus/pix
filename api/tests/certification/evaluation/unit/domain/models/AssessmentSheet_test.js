import { ABORT_REASONS } from '../../../../../../src/certification/shared/domain/constants/abort-reasons.js';
import { Assessment } from '../../../../../../src/shared/domain/models/Assessment.js';
import { domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Unit | Certification | Evaluation | Domain | Models | AssessmentSheet', function () {
  context('isAbortReasonTechnical', function () {
    it('should return false when abort reason is null', function () {
      const assessmentSheet = domainBuilder.certification.evaluation.buildAssessmentSheet({
        abortReason: null,
      });
      expect(assessmentSheet.isAbortReasonTechnical).to.be.false;
    });
    it('should return true when abort reason is technical', function () {
      const assessmentSheet = domainBuilder.certification.evaluation.buildAssessmentSheet({
        abortReason: ABORT_REASONS.TECHNICAL,
      });
      expect(assessmentSheet.isAbortReasonTechnical).to.be.true;
    });
    it('should return false when abort reason is not technical', function () {
      const assessmentSheet = domainBuilder.certification.evaluation.buildAssessmentSheet({
        abortReason: ABORT_REASONS.CANDIDATE,
      });
      expect(assessmentSheet.isAbortReasonTechnical).to.be.false;
    });
  });
  context('complete', function () {
    let clock, assessmentSheetBaseData;
    const now = new Date();

    beforeEach(function () {
      assessmentSheetBaseData = {
        certificationCourseId: 123,
        assessmentId: 456,
        abortReason: 'candidate',
        maxReachableLevelOnCertificationDate: 6,
        isRejectedForFraud: true,
        answers: [domainBuilder.buildAnswer()],
      };
      clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
    });

    afterEach(async function () {
      clock.restore();
    });

    it(`should update state and updatedAt when assessment sheet is in state ${Assessment.states.STARTED}`, function () {
      const assessmentSheet = domainBuilder.certification.evaluation.buildAssessmentSheet({
        ...assessmentSheetBaseData,
        state: Assessment.states.STARTED,
        updatedAt: new Date('2021-10-29'),
      });
      assessmentSheet.complete();

      expect(assessmentSheet).to.deepEqualInstance(
        domainBuilder.certification.evaluation.buildAssessmentSheet({
          ...assessmentSheetBaseData,
          state: Assessment.states.COMPLETED,
          updatedAt: now,
        }),
      );
    });

    Object.values(Assessment.states)
      .filter((state) => state !== Assessment.states.STARTED)
      .forEach((state) => {
        it(`should do nothing state is ${state}`, async function () {
          const assessmentSheet = domainBuilder.certification.evaluation.buildAssessmentSheet({
            ...assessmentSheetBaseData,
            state,
            updatedAt: new Date('2021-10-29'),
          });
          assessmentSheet.complete();

          expect(assessmentSheet).to.deepEqualInstance(
            domainBuilder.certification.evaluation.buildAssessmentSheet({
              ...assessmentSheetBaseData,
              state,
              updatedAt: new Date('2021-10-29'),
            }),
          );
        });
      });
  });
});
