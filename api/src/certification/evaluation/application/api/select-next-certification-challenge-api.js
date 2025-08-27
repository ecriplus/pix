/**
 * @typedef {import ('../../../../shared/domain/errors.js').AssessmentEndedError} AssessmentEndedError
 * @typedef {import ('../../../../shared/domain/models/Challenge.js').Challenge} Challenge
 * @typedef {import ('./models/CertificationAssessmentIdentifier.js').CertificationAssessmentIdentifier} CertificationAssessmentIdentifier
 */

import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';
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
      assessmentRepository,
    },
  }) => {
    const assessment = await dependencies.assessmentRepository.get(assessmentId);

    return usecases.getNextChallenge({ assessment, locale });
  },
);
