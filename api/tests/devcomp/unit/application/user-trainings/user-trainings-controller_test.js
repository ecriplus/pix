import { userTrainingsController } from '../../../../../src/devcomp/application/user-trainings/user-trainings-controller.js';
import { usecases as devcompUsecases } from '../../../../../src/devcomp/domain/usecases/index.js';
import { expect, hFake, sinon } from '../../../../test-helper.js';

describe('Unit | Controller | user-trainings-controller', function () {
  describe('#findPaginatedUserRecommendedTrainings', function () {
    it('should call the appropriate use-case', async function () {
      // given
      const page = Symbol('page');
      const locale = 'fr';
      const request = {
        auth: {
          credentials: {
            userId: 1,
          },
        },
        query: { page },
        headers: { 'accept-language': locale },
      };
      const expectedResult = Symbol('serialized-trainings');
      const userRecommendedTrainings = Symbol('userRecommendedTrainings');
      const meta = Symbol('meta');
      const requestResponseUtils = { extractLocaleFromRequest: sinon.stub() };
      requestResponseUtils.extractLocaleFromRequest.withArgs(request).returns(locale);
      sinon.stub(devcompUsecases, 'findPaginatedUserRecommendedTrainings').resolves({ userRecommendedTrainings, meta });
      const trainingSerializer = { serialize: sinon.stub() };
      trainingSerializer.serialize.returns(expectedResult);

      // when
      const response = await userTrainingsController.findPaginatedUserRecommendedTrainings(request, hFake, {
        requestResponseUtils,
        devcompUsecases,
        trainingSerializer,
      });

      // then
      expect(requestResponseUtils.extractLocaleFromRequest).to.have.been.calledOnce;
      expect(devcompUsecases.findPaginatedUserRecommendedTrainings).to.have.been.calledOnce;
      expect(devcompUsecases.findPaginatedUserRecommendedTrainings).to.have.been.calledWithExactly({
        userId: 1,
        locale,
        page,
      });
      expect(trainingSerializer.serialize).to.have.been.calledWithExactly(userRecommendedTrainings, meta);
      expect(response).to.equal(expectedResult);
    });
  });
});
