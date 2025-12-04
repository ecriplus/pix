import { FlashAssessmentAlgorithmConfiguration } from '../../../../../../src/certification/shared/domain/models/FlashAssessmentAlgorithmConfiguration.js';
import { EntityValidationError } from '../../../../../../src/shared/domain/errors.js';
import { catchErrSync, expect } from '../../../../../test-helper.js';

describe('Unit | Domain | Models | FlashAssessmentAlgorithmConfiguration', function () {
  context('class invariants', function () {
    const params = {
      maximumAssessmentLength: 30,
      challengesBetweenSameCompetence: 2,
      limitToOneQuestionPerTube: false,
      enablePassageByAllCompetences: false,
      variationPercent: 0.2,
      defaultCandidateCapacity: -3,
    };
    context('maximumAssessmentLength', function () {
      it('should throw an EntityValidationError if it is not an integer', function () {
        // given
        params.maximumAssessmentLength = 1.5;

        // when
        const err = catchErrSync(() => new FlashAssessmentAlgorithmConfiguration(params))();

        // then
        expect(err).to.be.an.instanceOf(EntityValidationError);
      });

      it('should throw an EntityValidationError if it is less than 0', function () {
        // given
        params.maximumAssessmentLength = -1;

        // when
        const err = catchErrSync(() => new FlashAssessmentAlgorithmConfiguration(params))();

        // then
        expect(err).to.be.an.instanceOf(EntityValidationError);
      });
    });

    context('challengesBetweenSameCompetence', function () {
      it('should throw an EntityValidationError if it is not an integer', function () {
        // given
        params.challengesBetweenSameCompetence = 1.5;

        // when
        const err = catchErrSync(() => new FlashAssessmentAlgorithmConfiguration(params))();

        // then
        expect(err).to.be.an.instanceOf(EntityValidationError);
      });

      it('should throw an EntityValidationError if it is less than 0', function () {
        // given
        params.challengesBetweenSameCompetence = -1;

        // when
        const err = catchErrSync(() => new FlashAssessmentAlgorithmConfiguration(params))();

        // then
        expect(err).to.be.an.instanceOf(EntityValidationError);
      });
    });

    context('limitToOneQuestionPerTube', function () {
      it('should throw an EntityValidationError if it is not a boolean', function () {
        // given
        params.limitToOneQuestionPerTube = 'string';

        // when
        const err = catchErrSync(() => new FlashAssessmentAlgorithmConfiguration(params))();

        // then
        expect(err).to.be.an.instanceOf(EntityValidationError);
      });
    });

    context('enablePassageByAllCompetences', function () {
      it('should throw an EntityValidationError if it is not a boolean', function () {
        // given
        params.enablePassageByAllCompetences = 'string';

        // when
        const err = catchErrSync(() => new FlashAssessmentAlgorithmConfiguration(params))();

        // then
        expect(err).to.be.an.instanceOf(EntityValidationError);
      });
    });

    context('variationPercent', function () {
      it('should throw an EntityValidationError if it is not a number', function () {
        // given
        params.variationPercent = 'not a number';

        // when
        const err = catchErrSync(() => new FlashAssessmentAlgorithmConfiguration(params))();

        // then
        expect(err).to.be.an.instanceOf(EntityValidationError);
      });

      it('should throw an EntityValidationError if it is less than 0', function () {
        // given
        params.variationPercent = -0.1;

        // when
        const err = catchErrSync(() => new FlashAssessmentAlgorithmConfiguration(params))();

        // then
        expect(err).to.be.an.instanceOf(EntityValidationError);
      });

      it('should throw an EntityValidationError if it is greater than 1', function () {
        // given
        params.variationPercent = 1.1;

        // when
        const err = catchErrSync(() => new FlashAssessmentAlgorithmConfiguration(params))();

        // then
        expect(err).to.be.an.instanceOf(EntityValidationError);
      });
    });

    context('defaultCandidateCapacity', function () {
      it('should throw an EntityValidationError if it is not a number', function () {
        // given
        params.defaultCandidateCapacity = 'not a number';

        // when
        const err = catchErrSync(() => new FlashAssessmentAlgorithmConfiguration(params))();

        // then
        expect(err).to.be.an.instanceOf(EntityValidationError);
      });
    });
  });
});
