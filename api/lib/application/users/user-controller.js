import { usecases as devcompUsecases } from '../../../src/devcomp/domain/usecases/index.js';
import * as trainingSerializer from '../../../src/devcomp/infrastructure/serializers/jsonapi/training-serializer.js';
import * as requestResponseUtils from '../../../src/shared/infrastructure/utils/request-response-utils.js';

const findPaginatedUserRecommendedTrainings = async function (
  request,
  h,
  dependencies = {
    trainingSerializer,
    requestResponseUtils,
    devcompUsecases,
  },
) {
  const locale = dependencies.requestResponseUtils.extractLocaleFromRequest(request);
  const { page } = request.query;
  const { userRecommendedTrainings, meta } = await dependencies.devcompUsecases.findPaginatedUserRecommendedTrainings({
    userId: request.auth.credentials.userId,
    locale,
    page,
  });

  return dependencies.trainingSerializer.serialize(userRecommendedTrainings, meta);
};

const userController = {
  findPaginatedUserRecommendedTrainings,
};

export { userController };
