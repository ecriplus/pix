import { NotFoundError } from '../../../../../../src/shared/domain/errors.js';
import { repositories } from '../../../../../../src/shared/infrastructure/repositories/index.js';
import { catchErr, expect } from '../../../../../test-helper.js';

describe('Integration | Repository | certification-challenge-repository', function () {
  describe('#selectNextCertificationChallenge', function () {
    describe('when there is no challenge', function () {
      it('should throw an error', async function () {
        // given
        const assessmentId = 123;

        // when
        const error = await catchErr(repositories.certificationEvaluationRepository.selectNextCertificationChallenge)({
          assessmentId,
        });

        // then
        expect(error).to.be.instanceof(NotFoundError);
      });
    });
  });
});
