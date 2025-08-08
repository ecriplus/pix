import { combinedCourseController } from '../../../../src/quest/application/combined-course-controller.js';
import { usecases } from '../../../../src/quest/domain/usecases/index.js';
import { config } from '../../../../src/shared/config.js';
import { expect, hFake, sinon } from '../../../test-helper.js';

describe('Unit | Application | Controller | Combined Course', function () {
  describe('#getByCode', function () {
    it('should call usecase with hostURL containing TLD when it is provided', async function () {
      // given
      const code = 'abc123';
      const userId = 1;
      const TLD = 'fr';
      const hostURL = config.domain.pixApp + '.' + TLD;
      const request = {
        query: {
          filter: {
            code,
          },
        },
      };
      const dependencies = {
        combinedCourseSerializer: {
          serialize: sinon.stub(),
        },
        requestResponseUtils: {
          extractUserIdFromRequest: sinon.stub(),
          extractTLDFromRequest: sinon.stub(),
        },
      };
      sinon.stub(usecases, 'getCombinedCourseByCode');

      dependencies.requestResponseUtils.extractUserIdFromRequest.returns(userId);
      dependencies.requestResponseUtils.extractTLDFromRequest.returns(TLD);
      usecases.getCombinedCourseByCode.withArgs({ userId, code, hostURL }).resolves();
      // when
      await combinedCourseController.getByCode(request, hFake, dependencies);

      // then
      expect(usecases.getCombinedCourseByCode).to.have.been.calledWithExactly({
        userId,
        code,
        hostURL,
      });
    });
  });
});
