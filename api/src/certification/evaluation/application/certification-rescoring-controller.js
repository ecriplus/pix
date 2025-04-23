import { extractLocaleFromRequest } from '../../../shared/infrastructure/utils/request-response-utils.js';
import { usecases } from '../../evaluation/domain/usecases/index.js';

const rescoreCertification = async function (request, h) {
  const certificationCourseId = request.params.certificationCourseId;
  const locale = extractLocaleFromRequest(request);

  await usecases.rescoreCertification({ certificationCourseId, locale });

  return h.response().code(201);
};

const certificationRescoringController = {
  rescoreCertification,
};

export { certificationRescoringController };
