import jsonapiSerializer from 'jsonapi-serializer';

import { ForbiddenAccess } from '../../../../shared/domain/errors.js';
import { extractUserIdFromRequest } from '../../../../shared/infrastructure/utils/request-response-utils.js';
import * as sessionRepository from '../../../session-management/infrastructure/repositories/session-repository.js';
import * as supervisorAccessRepository from '../../infrastructure/repositories/supervisor-access-repository.js';

const { Error: JSONAPIError } = jsonapiSerializer;

const FORBIDDEN_ERROR_MESSAGE = 'User is not allowed to access to this resource.';

function _replyForbiddenError(h) {
  const errorHttpStatusCode = 403;

  const jsonApiError = new JSONAPIError({
    code: errorHttpStatusCode,
    title: 'Forbidden access',
    detail: 'Missing or insufficient permissions.',
  });

  return h.response(jsonApiError).code(errorHttpStatusCode).takeover();
}

async function checkUserHaveCertificationCenterMembershipForSession(request, h, dependencies = { sessionRepository }) {
  const userId = request.auth.credentials.userId;
  const sessionId = request.params.sessionId;

  try {
    const hasMembershipAccess =
      await dependencies.sessionRepository.doesUserHaveCertificationCenterMembershipForSession({
        userId,
        sessionId,
      });

    if (!hasMembershipAccess) {
      throw new ForbiddenAccess(FORBIDDEN_ERROR_MESSAGE);
    }
    return h.response(true);
  } catch {
    return _replyForbiddenError(h);
  }
}

async function checkUserHaveInvigilatorAccessForSession(request, h, dependencies = { supervisorAccessRepository }) {
  const userId = extractUserIdFromRequest(request);
  const sessionId = request.params.sessionId;

  try {
    const isSupervisorForSession = await dependencies.supervisorAccessRepository.isUserSupervisorForSession({
      sessionId,
      userId,
    });

    if (!isSupervisorForSession) {
      throw new ForbiddenAccess(FORBIDDEN_ERROR_MESSAGE);
    }
    return h.response(true);
  } catch {
    return _replyForbiddenError(h);
  }
}

const authorization = {
  checkUserHaveCertificationCenterMembershipForSession,
  checkUserHaveInvigilatorAccessForSession,
};

export { authorization };
