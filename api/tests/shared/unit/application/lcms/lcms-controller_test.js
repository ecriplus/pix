import { lcmsController } from '../../../../../src/shared/application/lcms/lcms-controller.js';
import { sharedUsecases as usecases } from '../../../../../src/shared/domain/usecases/index.js';
import { expect, hFake, sinon } from '../../../../test-helper.js';

describe('Unit | Controller | lcms-controller', function () {
  describe('#createRelease', function () {
    it('should call the createRelease', async function () {
      // given
      sinon.stub(usecases, 'createLcmsRelease').resolves();
      const request = {};

      // when
      await lcmsController.createRelease(request, hFake);

      // then
      expect(usecases.createLcmsRelease).to.have.been.called;
    });
  });

  describe('#patchCacheEntry', function () {
    const request = {
      params: {
        model: 'challenges',
        id: 'recId',
      },
      payload: {
        property: 'updatedValue',
      },
    };

    it('should call the usecase and return 204', async function () {
      // given
      sinon.stub(usecases, 'patchLearningContentCacheEntry');

      // when
      const response = await lcmsController.patchCacheEntry(request, hFake);

      // then
      expect(usecases.patchLearningContentCacheEntry).to.have.been.calledWithExactly({
        recordId: 'recId',
        updatedRecord: {
          property: 'updatedValue',
        },
        modelName: 'challenges',
      });
      expect(response.statusCode).to.equal(204);
    });
  });

  describe('#refreshCache', function () {
    context('nominal case', function () {
      it('should reply with http status 202', async function () {
        // given
        sinon.stub(usecases, 'scheduleRefreshLearningContentCacheJob').resolves();

        // when
        const response = await lcmsController.refreshCache(
          {
            auth: {
              credentials: {
                userId: 123,
              },
            },
          },
          hFake,
        );

        // then
        expect(usecases.scheduleRefreshLearningContentCacheJob).to.have.been.calledOnce;
        expect(usecases.scheduleRefreshLearningContentCacheJob).to.have.been.calledWithExactly({ userId: 123 });
        expect(response.statusCode).to.equal(202);
      });
    });
  });
});
