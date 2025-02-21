import * as requestResponseUtils from '../../../src/shared/infrastructure/utils/request-response-utils.js';
import { usecases } from '../../domain/usecases/index.js';

const disableFromPixCertif = async function (request, h, dependencies = { requestResponseUtils }) {
  const certificationCenterMembershipId = request.params.certificationCenterMembershipId;
  const currentUserId = dependencies.requestResponseUtils.extractUserIdFromRequest(request);

  await usecases.disableCertificationCenterMembershipFromPixCertif({
    certificationCenterMembershipId,
    updatedByUserId: currentUserId,
  });
  return h.response().code(204);
};

const certificationCenterMembershipController = {
  disableFromPixCertif,
};

export { certificationCenterMembershipController };
