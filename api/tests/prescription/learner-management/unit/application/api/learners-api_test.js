import { hasBeenLearner } from '../../../../../../src/prescription/learner-management/application/api/learners-api.js';
import { usecases } from '../../../../../../src/prescription/learner-management/domain/usecases/index.js';
import { catchErr, expect, sinon } from '../../../../../test-helper.js';

describe('Unit | Prescription | learner management | Api | learners', function () {
  describe('#hasBeenLearner', function () {
    it('should throw a "TypeError" when "userId" is not defined', async function () {
      // given
      const hasBeenLearnerStub = sinon.stub(usecases, 'hasBeenLearner');

      // when
      const error = await catchErr(hasBeenLearner)({ userId: undefined });

      // then
      expect(error).to.be.instanceOf(TypeError);
      expect(hasBeenLearnerStub).to.not.have.been.called;
    });

    it('should check if "userId" in param has been a learner', async function () {
      // given
      const hasBeenLearnerStub = sinon.stub(usecases, 'hasBeenLearner').resolves(true);
      const userId = 1;

      // when
      const result = await hasBeenLearner({ userId });

      // then
      expect(result).to.be.true;
      expect(hasBeenLearnerStub).to.have.been.calledOnceWith({ userId });
    });
  });
});
