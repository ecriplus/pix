import { usecases } from '../../evaluation/domain/usecases/index.js';
import { AlgorithmEngineVersion } from '../../shared/domain/models/AlgorithmEngineVersion.js';
import * as certificationCourseRepository from '../../shared/infrastructure/repositories/certification-course-repository.js';
import CertificationRescored from '../domain/events/CertificationRescored.js';

const rescoreCertification = async function (request, h, dependencies = { certificationCourseRepository }) {
  const juryId = request.auth.credentials.userId;
  const certificationCourseId = request.params.certificationCourseId;

  const certificationCourse = await dependencies.certificationCourseRepository.get({ id: certificationCourseId });

  if (AlgorithmEngineVersion.isV3(certificationCourse.getVersion())) {
    await usecases.rescoreV3Certification({
      event: new CertificationRescored({ certificationCourseId, juryId }),
    });
  }

  if (AlgorithmEngineVersion.isV2(certificationCourse.getVersion())) {
    await usecases.rescoreV2Certification({
      event: new CertificationRescored({ certificationCourseId, juryId }),
    });
  }

  return h.response().code(201);
};

const certificationRescoringController = {
  rescoreCertification,
};

export { certificationRescoringController };
