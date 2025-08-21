import * as requestResponseUtils from '../../../shared/infrastructure/utils/request-response-utils.js';
import { usecases as devcompUsecases } from '../../domain/usecases/index.js';
import * as trainingSerializer from '../../infrastructure/serializers/jsonapi/training-serializer.js';

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

const userTrainingsController = {
  findPaginatedUserRecommendedTrainings,
};

export { userTrainingsController };
