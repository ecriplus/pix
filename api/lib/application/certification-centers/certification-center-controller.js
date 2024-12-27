import * as divisionSerializer from '../../../src/prescription/campaign/infrastructure/serializers/jsonapi/division-serializer.js';
import * as certificationCenterMembershipSerializer from '../../../src/shared/infrastructure/serializers/jsonapi/certification-center-membership.serializer.js';
import { usecases as teamUsecases } from '../../../src/team/domain/usecases/index.js';
import { usecases } from '../../domain/usecases/index.js';

const getDivisions = async function (request) {
  const certificationCenterId = request.params.certificationCenterId;
  const divisions = await usecases.findDivisionsByCertificationCenter({
    certificationCenterId,
  });

  return divisionSerializer.serialize(divisions);
};

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

const createCertificationCenterMembershipByEmail = async function (
  request,
  h,
  dependencies = { certificationCenterMembershipSerializer },
) {
  const certificationCenterId = request.params.certificationCenterId;
  const { email } = request.payload;

  const certificationCenterMembership = await usecases.createCertificationCenterMembershipByEmail({
    certificationCenterId,
    email,
  });
  return h
    .response(dependencies.certificationCenterMembershipSerializer.serialize(certificationCenterMembership))
    .created();
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
  createCertificationCenterMembershipByEmail,
  findCertificationCenterMembershipsByCertificationCenter,
  getDivisions,
  updateReferer,
};

export { certificationCenterController };
