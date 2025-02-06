import * as certificationCenterMembershipSerializer from '../../../src/shared/infrastructure/serializers/jsonapi/certification-center-membership.serializer.js';
import { usecases as teamUsecases } from '../../../src/team/domain/usecases/index.js';
import { usecases } from '../../domain/usecases/index.js';

const findCertificationCenterMembershipsByCertificationCenter = async function (
  request,
  h,
  dependencies = { certificationCenterMembershipSerializer },
) {
  const certificationCenterId = request.params.certificationCenterId;
  const certificationCenterMemberships = await teamUsecases.findCertificationCenterMembershipsByCertificationCenter({
    certificationCenterId,
  });

  return dependencies.certificationCenterMembershipSerializer.serialize(certificationCenterMemberships);
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

const certificationCenterController = {
  findCertificationCenterMembershipsByCertificationCenter,
  updateReferer,
};

export { certificationCenterController };
