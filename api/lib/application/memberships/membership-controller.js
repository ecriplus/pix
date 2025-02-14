import * as requestResponseUtils from '../../../src/shared/infrastructure/utils/request-response-utils.js';
import { usecases } from '../../domain/usecases/index.js';

const disableOwnOrganizationMembership = async function (request, h) {
  const organizationId = request.payload.organizationId;
  const userId = requestResponseUtils.extractUserIdFromRequest(request);

  await usecases.disableOwnOrganizationMembership({ organizationId, userId });

  return h.response().code(204);
};

const membershipController = { disableOwnOrganizationMembership };

export { membershipController };
