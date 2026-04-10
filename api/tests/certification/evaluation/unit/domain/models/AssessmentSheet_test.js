import { ABORT_REASONS } from '../../../../../../src/certification/shared/domain/constants/abort-reasons.js';
import { domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Certification | Evaluation | Unit | Domain | Models | AssessmentSheet', function () {
  const STATES = domainBuilder.certification.evaluation.buildAssessmentSheet.STATES;

  context('#get isAbortReasonTechnical', function () {
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

  context('#complete', function () {
    let clock, assessmentSheetBaseData;
    const now = new Date();

    beforeEach(function () {
      assessmentSheetBaseData = {
        certificationCourseId: 123,
        assessmentId: 456,
        abortReason: 'candidate',
        isRejectedForFraud: true,
        answers: [domainBuilder.buildAnswer()],
      };
      clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
    });

    afterEach(async function () {
      clock.restore();
    });

    it(`should update state and updatedAt when assessment sheet is in state ${STATES.STARTED}`, function () {
      const assessmentSheet = domainBuilder.certification.evaluation.buildAssessmentSheet({
        ...assessmentSheetBaseData,
        state: STATES.STARTED,
        updatedAt: new Date('2021-10-29'),
      });
      assessmentSheet.complete();

      expect(assessmentSheet).to.deepEqualInstance(
        domainBuilder.certification.evaluation.buildAssessmentSheet({
          ...assessmentSheetBaseData,
          state: STATES.COMPLETED,
          updatedAt: now,
        }),
      );
    });

    Object.values(STATES)
      .filter((state) => state !== STATES.STARTED)
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

  context('#get isStarted', function () {
    it(`returns true when state is ${STATES.STARTED}`, function () {
      const assessmentSheet = domainBuilder.certification.evaluation.buildAssessmentSheet({
        state: STATES.STARTED,
      });

      expect(assessmentSheet.isStarted).to.be.true;
    });

    Object.values(STATES)
      .filter((state) => state !== STATES.STARTED)
      .forEach((state) => {
        it(`return false when state is ${state}`, async function () {
          const assessmentSheet = domainBuilder.certification.evaluation.buildAssessmentSheet({
            state,
          });

          expect(assessmentSheet.isStarted).to.be.false;
        });
      });
  });

  context('#isEndedByInvigilator', function () {
    it(`returns true when state is ${STATES.ENDED_BY_INVIGILATOR}`, function () {
      const assessmentSheet = domainBuilder.certification.evaluation.buildAssessmentSheet({
        state: STATES.ENDED_BY_INVIGILATOR,
      });

      expect(assessmentSheet.isEndedByInvigilator()).to.be.true;
    });

    Object.values(STATES)
      .filter((state) => state !== STATES.ENDED_BY_INVIGILATOR)
      .forEach((state) => {
        it(`return false when state is ${state}`, async function () {
          const assessmentSheet = domainBuilder.certification.evaluation.buildAssessmentSheet({
            state,
          });

          expect(assessmentSheet.isEndedByInvigilator()).to.be.false;
        });
      });
  });

  context('#hasBeenEndedDueToFinalization', function () {
    it(`returns true when state is ${STATES.ENDED_DUE_TO_FINALIZATION}`, function () {
      const assessmentSheet = domainBuilder.certification.evaluation.buildAssessmentSheet({
        state: STATES.ENDED_DUE_TO_FINALIZATION,
      });

      expect(assessmentSheet.hasBeenEndedDueToFinalization()).to.be.true;
    });

    Object.values(STATES)
      .filter((state) => state !== STATES.ENDED_DUE_TO_FINALIZATION)
      .forEach((state) => {
        it(`return false when state is ${state}`, async function () {
          const assessmentSheet = domainBuilder.certification.evaluation.buildAssessmentSheet({
            state,
          });

          expect(assessmentSheet.hasBeenEndedDueToFinalization()).to.be.false;
        });
      });
  });

  context('#hasAnsweredChallenge', function () {
    it('returns false when no answers yet', function () {
      const assessmentSheet = domainBuilder.certification.evaluation.buildAssessmentSheet({
        answers: [],
      });

      expect(assessmentSheet.hasAnsweredChallenge('myFavoriteChallengeId')).to.be.false;
    });

    it('returns false when no answers on the provided challenge exist', function () {
      const assessmentSheet = domainBuilder.certification.evaluation.buildAssessmentSheet({
        answers: [domainBuilder.buildAnswer({ challengeId: 'someOtherChallengeId' })],
      });

      expect(assessmentSheet.hasAnsweredChallenge('myFavoriteChallengeId')).to.be.false;
    });

    it('returns true when an answer has been submitted with provided challenge', function () {
      const assessmentSheet = domainBuilder.certification.evaluation.buildAssessmentSheet({
        answers: [domainBuilder.buildAnswer({ challengeId: 'myFavoriteChallengeId' })],
      });

      expect(assessmentSheet.hasAnsweredChallenge('myFavoriteChallengeId')).to.be.true;
    });
  });

  context('#isChallengeExpectedToBeAnsweredNext', function () {
    it('returns true when no lastChallengeId in assessment sheet', function () {
      const assessmentSheet = domainBuilder.certification.evaluation.buildAssessmentSheet({
        lastChallengeId: null,
      });

      expect(assessmentSheet.isChallengeExpectedToBeAnsweredNext('myFavoriteChallengeId')).to.be.true;
    });

    it('returns true when submitted challengeId is the one expected to be answered next', function () {
      const assessmentSheet = domainBuilder.certification.evaluation.buildAssessmentSheet({
        lastChallengeId: 'myFavoriteChallengeId',
      });

      expect(assessmentSheet.isChallengeExpectedToBeAnsweredNext('myFavoriteChallengeId')).to.be.true;
    });

    it('returns false when submitted challengeId is not the one expected to be answered next', function () {
      const assessmentSheet = domainBuilder.certification.evaluation.buildAssessmentSheet({
        lastChallengeId: 'someOtherChallengeId',
      });

      expect(assessmentSheet.isChallengeExpectedToBeAnsweredNext('myFavoriteChallengeId')).to.be.false;
    });
  });
});
