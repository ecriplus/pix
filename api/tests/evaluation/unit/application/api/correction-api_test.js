import * as correctionApi from '../../../../../src/evaluation/application/api/correction-api.js';
import { Answer } from '../../../../../src/evaluation/domain/models/Answer.js';
import { domainBuilder, expect } from '../../../../test-helper.js';

describe('Evaluation | Unit | Application | API | correction-api', function () {
  describe('#correctAnswer', function () {
    it('corrects the answer and return the corrected versions of the answer', async function () {
      // given
      const challenge = domainBuilder.buildChallenge();
      const answer = domainBuilder.buildAnswer({ userId: 123 });
      const hasChallengeBeenFocusedOut = false;
      const isCertificationEvaluation = true;
      const accessibilityAdjustmentNeeded = false;

      // when
      const a = correctionApi.correctAnswer({
        challenge,
        answer,
        hasChallengeBeenFocusedOut,
        isCertificationEvaluation,
        accessibilityAdjustmentNeeded,
      });

      // then
      expect(a).to.be.an.instanceOf(Answer);
    });
  });
});
