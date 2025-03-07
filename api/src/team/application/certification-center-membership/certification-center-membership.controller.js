import { ForbiddenError } from '../../../shared/application/http-errors.js';
import * as certificationCenterMembershipSerializer from '../../../shared/infrastructure/serializers/jsonapi/certification-center-membership.serializer.js';
import { requestResponseUtils } from '../../../shared/infrastructure/utils/request-response-utils.js';
import { usecases } from '../../domain/usecases/index.js';
import { certificationCenterMembershipRepository } from '../../infrastructure/repositories/certification-center-membership.repository.js';

const findCertificationCenterMemberships = async function (
  request,
  h,
  dependencies = { certificationCenterMembershipSerializer },
) {
  const certificationCenterId = request.params.certificationCenterId;
  const certificationCenterMemberships = await usecases.findCertificationCenterMembershipsByCertificationCenter({
    certificationCenterId,
  });

  return dependencies.certificationCenterMembershipSerializer.serializeMembers(certificationCenterMemberships);
};

const updateFromPixCertif = async function (
  request,
  h,
  dependencies = { requestResponseUtils, certificationCenterMembershipSerializer },
) {
  const certificationCenterId = request.params.certificationCenterId;
  const certificationCenterMembershipId = request.params.id;
  const certificationCenterMembership = dependencies.certificationCenterMembershipSerializer.deserialize(
    request.payload,
  );
  const currentUserId = dependencies.requestResponseUtils.extractUserIdFromRequest(request);

  const foundCertificationCenterId = await certificationCenterMembershipRepository.getCertificationCenterId(
    certificationCenterMembershipId,
  );
  if (foundCertificationCenterId !== certificationCenterId) {
    throw new ForbiddenError('Wrong certification center');
  }

  const updatedCertificationCenterMembership = await usecases.updateCertificationCenterMembership({
    certificationCenterMembershipId,
    role: certificationCenterMembership.role,
    updatedByUserId: currentUserId,
  });

  return h.response(
    dependencies.certificationCenterMembershipSerializer.serializeMembers(updatedCertificationCenterMembership),
  );
};

const updateReferer = async function (request, h) {
  const certificationCenterId = request.params.certificationCenterId;
  const { userId, isReferer } = request.payload.data.attributes;

  await usecases.updateCertificationCenterReferer({
    userId,
    certificationCenterId,
    isReferer,
  });
  return h.response().code(204);
};

const certificationCenterMembershipController = {
  findCertificationCenterMemberships,
  updateFromPixCertif,
  updateReferer,
};
export { certificationCenterMembershipController };
