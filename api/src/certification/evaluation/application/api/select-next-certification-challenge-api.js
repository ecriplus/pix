/**
 * @typedef {import ('../../../../shared/domain/errors.js').AssessmentEndedError} AssessmentEndedError
 * @typedef {import ('../../../../shared/domain/models/Challenge.js').Challenge} Challenge
 * @typedef {import ('./models/CertificationAssessmentIdentifier.js').CertificationAssessmentIdentifier} CertificationAssessmentIdentifier
 */

import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { AlgorithmEngineVersion } from '../../../shared/domain/models/AlgorithmEngineVersion.js';
import * as certificationCourseRepository from '../../../shared/infrastructure/repositories/certification-course-repository.js';
import { usecases } from '../../domain/usecases/index.js';
import * as assessmentRepository from '../../infrastructure/repositories/assessment-repository.js';

/**
 * @function
 * @name selectNextCertificationChallenge
 *
 * @param {CertificationAssessmentIdentifier} params.assessmentId
 * @param {string} params.locale
 *
 * @returns {Challenge}
 * @throws {AssessmentEndedError} test ended or no next challenge available
 * @throws {RangeError} illegal V3 certification algorithm state
 */
export const selectNextCertificationChallenge = withTransaction(
  async ({
    assessmentId,
    locale,
    dependencies = {
      certificationCourseRepository,
      assessmentRepository,
    },
  }) => {
    const assessment = await dependencies.assessmentRepository.get(assessmentId);

    const certificationCourse = await dependencies.certificationCourseRepository.get({
      id: assessment.certificationCourseId,
    });

    let challenge;
    if (AlgorithmEngineVersion.isV3(certificationCourse.getVersion())) {
      challenge = await usecases.getNextChallenge({ assessment, locale });
    } else {
      challenge = await usecases.getNextChallengeForV2Certification({ assessment, locale });
    }

    return challenge;
  },
);
