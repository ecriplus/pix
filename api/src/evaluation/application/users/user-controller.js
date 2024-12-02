import * as userSerializer from '../../../shared/infrastructure/serializers/jsonapi/user-serializer.js';
import { evaluationUsecases as usecases } from '../../domain/usecases/index.js';

const rememberUserHasSeenNewDashboardInfo = async function (request, h, dependencies = { userSerializer }) {
  const authenticatedUserId = request.auth.credentials.userId;

  const updatedUser = await usecases.rememberUserHasSeenNewDashboardInfo({ userId: authenticatedUserId });
  return dependencies.userSerializer.serialize(updatedUser);
};

const rememberUserHasSeenAssessmentInstructions = async function (request, h, dependencies = { userSerializer }) {
  const authenticatedUserId = request.auth.credentials.userId;

  const updatedUser = await usecases.rememberUserHasSeenAssessmentInstructions({ userId: authenticatedUserId });
  return dependencies.userSerializer.serialize(updatedUser);
};

const userController = {
  rememberUserHasSeenNewDashboardInfo,
  rememberUserHasSeenAssessmentInstructions,
};

export { userController };
