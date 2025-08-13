import { Answer } from '../../../../../src/evaluation/domain/models/Answer.js';
import { evaluateAnswer } from '../../../../../src/evaluation/domain/services/correction-service.js';
import { domainBuilder, expect } from '../../../../test-helper.js';

describe('Unit | Domain | Service | correction-service', function () {
  describe('#evaluateAnswer', function () {
    context('when answer evaluation succeeds without forcing OK answer', function () {
      it('should return the corrected answer', function () {
        // given
        const challenge = domainBuilder.buildChallenge();
        const answer = domainBuilder.buildAnswer();
        const assessment = domainBuilder.buildAssessment();
        const accessibilityAdjustmentNeeded = false;

        // when
        const a = evaluateAnswer({ challenge, answer, assessment, accessibilityAdjustmentNeeded });

        // then
        expect(a).to.be.an.instanceOf(Answer);
      });
    });

    context('when evaluating answer forcing OK answer', function () {
      it('should return an OK corrected answer', function () {
        // given
        const challenge = domainBuilder.buildChallenge();
        const answer = domainBuilder.buildAnswer({
          value: 'Some random value',
        });
        const assessment = domainBuilder.buildAssessment();
        const accessibilityAdjustmentNeeded = false;

        // when
        const correctedAnswer = evaluateAnswer({
          challenge,
          answer,
          assessment,
          accessibilityAdjustmentNeeded,
          forceOKAnswer: true,
        });

        // then
        expect(correctedAnswer).to.be.an.instanceOf(Answer);
        expect(correctedAnswer.isOk()).to.be.true;
      });
    });
  });
});
