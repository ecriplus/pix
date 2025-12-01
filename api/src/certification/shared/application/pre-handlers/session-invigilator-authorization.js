import { extractUserIdFromRequest } from '../../../../shared/infrastructure/utils/request-response-utils.js';
import * as invigilatorAccessRepository from '../../../session-management/infrastructure/repositories/invigilator-access-repository.js';

const verifyByCertificationCandidateId = async function (request, h, dependencies = { invigilatorAccessRepository }) {
  const invigilatorUserId = extractUserIdFromRequest(request);
  const certificationCandidateId = request.params.certificationCandidateId;
  const isInvigilatorForSession = await dependencies.invigilatorAccessRepository.isUserInvigilatorForSessionCandidate({
    invigilatorId: invigilatorUserId,
    certificationCandidateId,
  });

  if (!isInvigilatorForSession) {
    return h.response().code(401).takeover();
  }

  return true;
};

const verifyBySessionId = async function (request, h, dependencies = { invigilatorAccessRepository }) {
  const userId = extractUserIdFromRequest(request);
  const sessionId = request.params.sessionId;

  const isInvigilatorForSession = await dependencies.invigilatorAccessRepository.isUserInvigilatorForSession({
    sessionId,
    userId,
  });

  if (!isInvigilatorForSession) {
    return h.response().code(401).takeover();
  }
  return true;
};

const assessmentInvigilatorAuthorization = { verifyByCertificationCandidateId, verifyBySessionId };

export { assessmentInvigilatorAuthorization };
