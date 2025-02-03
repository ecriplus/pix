import { usecases as devcompUsecases } from '../../../src/devcomp/domain/usecases/index.js';
import * as trainingSerializer from '../../../src/devcomp/infrastructure/serializers/jsonapi/training-serializer.js';
import * as certificationCenterMembershipSerializer from '../../../src/shared/infrastructure/serializers/jsonapi/certification-center-membership.serializer.js';
import * as requestResponseUtils from '../../../src/shared/infrastructure/utils/request-response-utils.js';
import { usecases } from '../../domain/usecases/index.js';

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

const findCertificationCenterMembershipsByUser = async function (
  request,
  h,
  dependencies = { certificationCenterMembershipSerializer },
) {
  const userId = request.params.id;
  const certificationCenterMemberships = await usecases.findCertificationCenterMembershipsByUser({
    userId,
  });
  return h.response(
    dependencies.certificationCenterMembershipSerializer.serializeForAdmin(certificationCenterMemberships),
  );
};

const userController = {
  findCertificationCenterMembershipsByUser,
  findPaginatedUserRecommendedTrainings,
};

export { userController };
