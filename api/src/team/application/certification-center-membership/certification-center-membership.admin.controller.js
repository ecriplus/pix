import { BadRequestError } from '../../../shared/application/http-errors.js';
import * as certificationCenterMembershipSerializer from '../../../shared/infrastructure/serializers/jsonapi/certification-center-membership.serializer.js';
import { requestResponseUtils } from '../../../shared/infrastructure/utils/request-response-utils.js';
import { usecases } from '../../domain/usecases/index.js';

const updateRole = async function (
  request,
  h,
  dependencies = { requestResponseUtils, certificationCenterMembershipSerializer },
) {
  const certificationCenterMembershipId = request.params.id;
  const certificationCenterMembership = dependencies.certificationCenterMembershipSerializer.deserialize(
    request.payload,
  );
  const pixAgentUserId = dependencies.requestResponseUtils.extractUserIdFromRequest(request);

  if (certificationCenterMembershipId !== certificationCenterMembership.id) {
    throw new BadRequestError();
  }

  const updatedCertificationCenterMembership = await usecases.updateCertificationCenterMembership({
    certificationCenterMembershipId,
    role: certificationCenterMembership.role,
    updatedByUserId: pixAgentUserId,
  });

  return h.response(
    dependencies.certificationCenterMembershipSerializer.serializeForAdmin(updatedCertificationCenterMembership),
  );
};

const disableFromPixAdmin = async function (request, h, dependencies = { requestResponseUtils }) {
  const certificationCenterMembershipId = request.params.id;
  const pixAgentUserId = dependencies.requestResponseUtils.extractUserIdFromRequest(request);

  await usecases.disableCertificationCenterMembershipFromPixAdmin({
    certificationCenterMembershipId,
    updatedByUserId: pixAgentUserId,
  });
  return h.response().code(204);
};

const certificationCenterMembershipAdminController = {
  updateRole,
  disableFromPixAdmin,
};

export { certificationCenterMembershipAdminController };
