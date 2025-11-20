import { usecases } from '../domain/usecases/index.js';

const authorizeToStart = async function (request, h) {
  const certificationCandidateForSupervisingId = request.params.certificationCandidateId;

  const authorizedToStart = request.payload['authorized-to-start'];
  await usecases.authorizeCertificationCandidateToStart({
    certificationCandidateForSupervisingId,
    authorizedToStart,
  });

  return h.response().code(204);
};

const authorizeToResume = async function (request, h) {
  const certificationCandidateId = request.params.certificationCandidateId;

  await usecases.authorizeCertificationCandidateToResume({
    certificationCandidateId,
  });

  return h.response().code(204);
};

const endAssessmentByInvigilator = async function (request) {
  const certificationCandidateId = request.params.certificationCandidateId;

  await usecases.endAssessmentByInvigilator({ certificationCandidateId });

  return null;
};

const certificationCandidateController = {
  authorizeToStart,
  authorizeToResume,
  endAssessmentByInvigilator,
};
export { certificationCandidateController };
