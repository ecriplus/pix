const moment = require('moment');
const { expect, sinon, domainBuilder } = require('../../../test-helper');
const Assessment = require('../../../../lib/domain/models/Assessment');
const AssessmentResult = require('../../../../lib/domain/models/AssessmentResult');

describe('Unit | Domain | Models | Assessment', () => {

  describe('#isCompleted', () => {

    it('should return true when its state is completed', () => {
      // given
      const assessment = Assessment.fromAttributes({ state: 'completed' });

      // when
      const isCompleted = assessment.isCompleted();

      // then
      expect(isCompleted).to.be.true;
    });

    it('should return false when its state is not completed', () => {
      // given
      const assessment = Assessment.fromAttributes({ state: '' });

      // when
      const isCompleted = assessment.isCompleted();

      // then
      expect(isCompleted).to.be.false;
    });

  });

  describe('#getLastAssessmentResult', () => {

    it('should return the last assessment results', () => {
      // given
      const assessmentResultComputed = new AssessmentResult({
        id: 1,
        createdAt: '2017-12-20',
        emitter: 'PIX-ALGO',
      });
      const assessmentResultJury = new AssessmentResult({
        id: 2,
        createdAt: '2017-12-24',
        emitter: 'Michel',
      });

      const assessmentResultJuryOld = new AssessmentResult({
        id: 3,
        createdAt: '2017-12-22',
        emitter: 'Gerard',
      });

      const assessment = Assessment.fromAttributes({
        status: 'completed',
        assessmentResults: [assessmentResultComputed, assessmentResultJury, assessmentResultJuryOld],
      });

      // when
      const lastResult = assessment.getLastAssessmentResult();

      // then
      expect(lastResult.id).to.be.equal(2);
      expect(lastResult.emitter).to.be.equal('Michel');
    });

    it('should return null when assessment has no result', () => {
      // given
      const assessment = Assessment.fromAttributes({ status: '' });

      // when
      const lastResult = assessment.getLastAssessmentResult();

      // then
      expect(lastResult).to.be.null;
    });

  });

  describe('#getPixScore', () => {

    it('should return the pixScore of last assessment results', () => {
      // given
      const assessmentResultComputed = new AssessmentResult({
        id: 1,
        createdAt: '2017-12-20',
        pixScore: 12,
        emitter: 'PIX-ALGO',
      });
      const assessmentResultJury = new AssessmentResult({
        id: 2,
        createdAt: '2017-12-24',
        pixScore: 18,
        emitter: 'Michel',
      });

      const assessment = Assessment.fromAttributes({
        status: 'completed',
        assessmentResults: [assessmentResultComputed, assessmentResultJury],
      });

      // when
      const pixScore = assessment.getPixScore();

      // then
      expect(pixScore).to.be.equal(18);
    });

    it('should return null when assessment has no result', () => {
      // given
      const assessment = Assessment.fromAttributes({ status: '' });

      // when
      const pixScore = assessment.getPixScore();

      // then
      expect(pixScore).to.be.null;
    });

  });

  describe('#getLevel', () => {

    it('should return the pixScore of last assessment results', () => {
      // given
      const assessmentResultComputed = new AssessmentResult({
        id: 1,
        createdAt: '2017-12-20',
        level: 1,
        emitter: 'PIX-ALGO',
      });
      const assessmentResultJury = new AssessmentResult({
        id: 2,
        createdAt: '2017-12-24',
        level: 5,
        emitter: 'Michel',
      });

      const assessment = Assessment.fromAttributes({
        status: 'completed',
        assessmentResults: [assessmentResultComputed, assessmentResultJury],
      });

      // when
      const level = assessment.getLevel();

      // then
      expect(level).to.be.equal(5);
    });

    it('should return null when assessment has no result', () => {
      // given
      const assessment = Assessment.fromAttributes({ status: '' });

      // when
      const level = assessment.getLevel();

      // then
      expect(level).to.be.null;
    });

  });

  describe('#setCompleted', () => {

    it('should return the same object with state completed', () => {
      // given
      const assessment = Assessment.fromAttributes({ state: 'started', userId: 2 });

      // when
      assessment.setCompleted();

      // then
      expect(assessment.state).to.be.equal('completed');
      expect(assessment.userId).to.be.equal(2);

    });
  });

  describe('#validate', () => {
    let assessment;

    it('should return resolved promise when object is valid', () => {
      // given
      assessment = Assessment.fromAttributes({ type: 'DEMO' });

      // when
      const promise = assessment.validate();

      // then
      return expect(promise).to.be.fulfilled;
    });

    it('should return resolved promise when Placement assessment is valid', () => {
      //given
      assessment = Assessment.fromAttributes({ userId: 3, type: 'PLACEMENT' });

      // when
      const promise = assessment.validate();

      // then
      return expect(promise).to.be.fulfilled;
    });

    it('should return rejected promise when Placement assessment has no userId', () => {
      //given
      assessment = Assessment.fromAttributes({ type: 'PLACEMENT' });

      // when
      const promise = assessment.validate();

      // then
      return expect(promise).to.be.rejected;
    });

    it('should return rejected promise when userId is null for placement', () => {
      //given
      assessment = Assessment.fromAttributes({ userId: null, type: 'PLACEMENT' });

      // when
      const promise = assessment.validate();

      // then
      return expect(promise).to.be.rejected;
    });

  });

  describe('#hasTypeSmartPlacement', () => {
    it('should return true when the assessment is a SMART_PLACEMENT', () => {
      // given
      const assessment = Assessment.fromAttributes({ type: 'SMART_PLACEMENT' });

      // when
      const isSmartPlacementAssessment = assessment.hasTypeSmartPlacement();

      // then
      expect(isSmartPlacementAssessment).to.be.true;
    });

    it('should return false when the assessment is not a SMART_PLACEMENT', () => {
      // given
      const assessment = Assessment.fromAttributes({ type: 'PLACEMENT' });

      // when
      const isSmartPlacementAssessment = assessment.hasTypeSmartPlacement();

      // then
      expect(isSmartPlacementAssessment).to.be.false;
    });

    it('should return false when the assessment has no type', () => {
      // given
      const assessment = Assessment.fromAttributes({});

      // when
      const isSmartPlacementAssessment = assessment.hasTypeSmartPlacement();

      // then
      expect(isSmartPlacementAssessment).to.be.false;
    });
  });

  describe('#hasTypeCertification', () => {
    it('should return true when the assessment is a CERTIFICATION', () => {
      // given
      const assessment = domainBuilder.buildAssessment({ type: 'CERTIFICATION' });

      // when
      const isCertificationAssessment = assessment.hasTypeCertification();

      // then
      expect(isCertificationAssessment).to.be.true;
    });

    it('should return false when the assessment is not a CERTIFICATION', () => {
      // given
      const assessment = domainBuilder.buildAssessment({ type: 'PLACEMENT' });

      // when
      const isCertificationAssessment = assessment.hasTypeCertification();

      // then
      expect(isCertificationAssessment).to.be.false;
    });

    it('should return false when the assessment has no type', () => {
      // given
      const assessment = domainBuilder.buildAssessment({ type: null });

      // when
      const isCertificationAssessment = assessment.hasTypeCertification();

      // then
      expect(isCertificationAssessment).to.be.false;
    });
  });

  describe('#hasTypePlacement', () => {

    it('should return true when the assessment is a placement', () => {
      // given
      const assessment = domainBuilder.buildAssessment({ type: Assessment.types.PLACEMENT });

      // when/then
      expect(assessment.hasTypePlacement()).to.be.true;
    });

    it('should return false when the assessment is not a placement', () => {
      // given
      const assessment = domainBuilder.buildAssessment({ type: Assessment.types.SMARTPLACEMENT });

      // when/then
      expect(assessment.hasTypePlacement()).to.be.false;
    });

    it('should return false when the assessment has no type', () => {
      // given
      const assessment = domainBuilder.buildAssessment({ type: null });

      // when/then
      expect(assessment.hasTypePlacement()).to.be.false;
    });
  });

  describe('#hasTypePreview', () => {

    it('should return true when the assessment is a preview', () => {
      // given
      const assessment = domainBuilder.buildAssessment({ type: Assessment.types.PREVIEW });

      // when/then
      expect(assessment.hasTypePreview()).to.be.true;
    });

    it('should return false when the assessment is not a placement', () => {
      // given
      const assessment = domainBuilder.buildAssessment({ type: Assessment.types.SMARTPLACEMENT });

      // when/then
      expect(assessment.hasTypePreview()).to.be.false;
    });

    it('should return false when the assessment has no type', () => {
      // given
      const assessment = domainBuilder.buildAssessment({ type: null });

      // when/then
      expect(assessment.hasTypePreview()).to.be.false;
    });
  });

  describe('#hasTypeDemo', () => {

    it('should return true when the assessment is a preview', () => {
      // given
      const assessment = domainBuilder.buildAssessment({ type: Assessment.types.DEMO });

      // when/then
      expect(assessment.hasTypeDemo()).to.be.true;
    });

    it('should return false when the assessment is not a placement', () => {
      // given
      const assessment = domainBuilder.buildAssessment({ type: Assessment.types.SMARTPLACEMENT });

      // when/then
      expect(assessment.hasTypeDemo()).to.be.false;
    });

    it('should return false when the assessment has no type', () => {
      // given
      const assessment = domainBuilder.buildAssessment({ type: null });

      // when/then
      expect(assessment.hasTypeDemo()).to.be.false;
    });
  });

  describe('#canBeScored', () => {

    [
      { type: Assessment.types.CERTIFICATION, expected: true },
      { type: Assessment.types.DEMO, expected: false },
      { type: Assessment.types.PLACEMENT, expected: true },
      { type: Assessment.types.PREVIEW, expected: false },
      { type: Assessment.types.SMARTPLACEMENT, expected: false }
    ].forEach((data) => {
      it(`should return ${data.expected} when assessment has type ${data.type}`, () => {
        // given
        const assessment = domainBuilder.buildAssessment({ type: data.type });

        // when
        const result = assessment.canBeScored();

        // then
        expect(result).to.equal(data.expected);
      });
    });
  });

  describe('#isCertifiable', () => {

    it('should return true when the last assessment has a level > 0', () => {
      // given
      const assessmentResultComputed = new AssessmentResult({
        id: 3,
        createdAt: '2017-12-22',
        emitter: 'Gerard',
        level: 3,
      });

      const assessment = Assessment.fromAttributes({
        assessmentResults: [assessmentResultComputed]
      });

      // when
      const isCompleted = assessment.isCertifiable();

      // then
      expect(isCompleted).to.be.true;
    });

    it('should return false when the last assessment has a level < 1', () => {
      // given
      const assessmentResultComputed = new AssessmentResult({
        id: 3,
        createdAt: '2017-12-22',
        emitter: 'Gerard',
        level: 0,
      });

      const assessment = Assessment.fromAttributes({
        assessmentResults: [assessmentResultComputed]
      });

      // when
      const isCompleted = assessment.isCertifiable();

      // then
      expect(isCompleted).to.be.false;
    });
  });

  describe('#start', () => {

    it('should set the status to "started"', () => {
      // given
      const assessment = domainBuilder.buildAssessment({ status: undefined });

      // when
      assessment.start();

      // then
      expect(assessment.state).to.equal(Assessment.states.STARTED);
    });

  });

  describe('#getRemainingDaysBeforeNewAttempt', () => {

    let clock;
    let testCurrentDate;

    beforeEach(() => {
      testCurrentDate = new Date('2018-01-10 05:00:00');
      clock = sinon.useFakeTimers(testCurrentDate.getTime());
    });

    afterEach(() => {
      clock.restore();
    });

    [
      { daysBefore: 0, hoursBefore: 2, expectedDaysBeforeNewAttempt: 7 },
      { daysBefore: 1, hoursBefore: 0, expectedDaysBeforeNewAttempt: 6 },
      { daysBefore: 5, hoursBefore: 0, expectedDaysBeforeNewAttempt: 2 },
      { daysBefore: 5, hoursBefore: 12, expectedDaysBeforeNewAttempt: 2 },
      { daysBefore: 6, hoursBefore: 0, expectedDaysBeforeNewAttempt: 1 },
      { daysBefore: 6, hoursBefore: 11, expectedDaysBeforeNewAttempt: 1 },
      { daysBefore: 6, hoursBefore: 12, expectedDaysBeforeNewAttempt: 1 },
      { daysBefore: 6, hoursBefore: 13, expectedDaysBeforeNewAttempt: 1 },
      { daysBefore: 7, hoursBefore: 0, expectedDaysBeforeNewAttempt: 0 },
      { daysBefore: 10, hoursBefore: 0, expectedDaysBeforeNewAttempt: 0 },
    ].forEach(({ daysBefore, hoursBefore, expectedDaysBeforeNewAttempt }) => {
      it(`should return ${expectedDaysBeforeNewAttempt} days when the last result is ${daysBefore} days and ${hoursBefore} hours old`, () => {
        const assessmentCreationDate = moment(testCurrentDate).subtract(daysBefore, 'day').subtract(hoursBefore, 'hour').toDate();
        const assessmentResults = [domainBuilder.buildAssessmentResult({ createdAt: assessmentCreationDate })];
        const assessment = domainBuilder.buildAssessment({
          type: Assessment.types.PLACEMENT,
          status: Assessment.types.COMPLETED,
          assessmentResults
        });

        // when
        const daysBeforeNewAttempt = assessment.getRemainingDaysBeforeNewAttempt();

        // then
        expect(daysBeforeNewAttempt).to.equal(expectedDaysBeforeNewAttempt);
      });
    });

  });

  describe('canStartNewAttemptOnCourse', () => {

    let clock;
    let testCurrentDate;

    beforeEach(() => {
      testCurrentDate = new Date('2018-01-10 05:00:00');
      clock = sinon.useFakeTimers(testCurrentDate.getTime());
    });

    afterEach(() => {
      clock.restore();
    });

    it('should throw an error if the assessment if not a placement', () => {
      // given
      const assessment = domainBuilder.buildAssessment({ type: Assessment.types.CERTIFICATION });

      // when/then
      expect(() => assessment.canStartNewAttemptOnCourse()).to.throw(Error);
    });

    it('should be false is the assessment is not completed', () => {
      // given
      const assessment = domainBuilder.buildAssessment({
        type: Assessment.types.PLACEMENT,
        state: Assessment.states.STARTED,
      });

      // when
      const canStartNewAttemptOnCourse = assessment.canStartNewAttemptOnCourse();

      // then
      expect(canStartNewAttemptOnCourse).to.be.false;
    });

    it('should be false is the number of days to wait before new attempt is over 0', () => {
      // given
      const assessmentCreationDate = moment(testCurrentDate).subtract(2, 'day').toDate();
      const assessmentResults = [domainBuilder.buildAssessmentResult({ createdAt: assessmentCreationDate })];
      const assessment = domainBuilder.buildAssessment({
        type: Assessment.types.PLACEMENT,
        status: Assessment.types.COMPLETED,
        assessmentResults
      });

      // when
      const canStartNewAttemptOnCourse = assessment.canStartNewAttemptOnCourse();

      // then
      expect(canStartNewAttemptOnCourse).to.be.false;
    });

    it('should be true is the number of days to wait before new attempt is equal to 0', () => {
      // given
      const assessmentCreationDate = moment(testCurrentDate).subtract(8, 'day').toDate();
      const assessmentResults = [domainBuilder.buildAssessmentResult({ createdAt: assessmentCreationDate })];
      const assessment = domainBuilder.buildAssessment({
        type: Assessment.types.PLACEMENT,
        status: Assessment.types.COMPLETED,
        assessmentResults
      });

      // when
      const canStartNewAttemptOnCourse = assessment.canStartNewAttemptOnCourse();

      // then
      expect(canStartNewAttemptOnCourse).to.be.true;
    });

  });

});
