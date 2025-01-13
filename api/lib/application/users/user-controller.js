import { usecases as devcompUsecases } from '../../../src/devcomp/domain/usecases/index.js';
import * as trainingSerializer from '../../../src/devcomp/infrastructure/serializers/jsonapi/training-serializer.js';
import * as certificationCenterMembershipSerializer from '../../../src/shared/infrastructure/serializers/jsonapi/certification-center-membership.serializer.js';
import * as requestResponseUtils from '../../../src/shared/infrastructure/utils/request-response-utils.js';
import { usecases } from '../../domain/usecases/index.js';
import * as userOrganizationForAdminSerializer from '../../infrastructure/serializers/jsonapi/user-organization-for-admin-serializer.js';

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

const reassignAuthenticationMethods = async function (request, h) {
  const authenticationMethodId = request.params.authenticationMethodId;
  const originUserId = request.params.userId;
  const targetUserId = request.payload.data.attributes['user-id'];

  await usecases.reassignAuthenticationMethodToAnotherUser({
    originUserId,
    targetUserId,
    authenticationMethodId,
  });
  return h.response().code(204);
};

const findUserOrganizationsForAdmin = async function (
  request,
  h,
  dependencies = { userOrganizationForAdminSerializer },
) {
  const userId = request.params.id;
  const organizations = await usecases.findUserOrganizationsForAdmin({
    userId,
  });
  return h.response(dependencies.userOrganizationForAdminSerializer.serialize(organizations));
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
  findUserOrganizationsForAdmin,
  reassignAuthenticationMethods,
};

export { userController };
