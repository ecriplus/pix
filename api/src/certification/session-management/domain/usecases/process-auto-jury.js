/**
 * @typedef {import('./index.js').CertificationRescoringRepository} CertificationRescoringRepository
 */
import { logger } from '../../../../shared/infrastructure/utils/logger.js';
import { PromiseUtils } from '../../../../shared/infrastructure/utils/promise-utils.js';
import { CertificationJuryDone } from '../events/CertificationJuryDone.js';
import { CertificationAssessment } from '../models/CertificationAssessment.js';
import { CertificationIssueReportResolutionAttempt } from '../models/CertificationIssueReportResolutionAttempt.js';
import { CertificationIssueReportResolutionStrategies } from '../models/CertificationIssueReportResolutionStrategies.js';

/**
 * @param {Object} params
 * @param {CertificationRescoringRepository} params.certificationRescoringRepository
 */
export async function processAutoJury({
  sessionId,
  certificationIssueReportRepository,
  certificationAssessmentRepository,
  certificationCourseRepository,
  challengeRepository,
  certificationRescoringRepository,
}) {
  const certificationCourses = await certificationCourseRepository.findCertificationCoursesBySessionId({
    sessionId,
  });

  for (const certificationCourse of certificationCourses) {
    const certificationAssessment = await certificationAssessmentRepository.getByCertificationCourseId({
      certificationCourseId: certificationCourse.getId(),
    });
    if (_areV3CertificationCourses(certificationCourses)) {
      await _handleAutoJuryV3({
        certificationAssessment,
        certificationCourse,
        certificationAssessmentRepository,
        certificationRescoringRepository,
      });
    } else {
      const resolutionStrategies = new CertificationIssueReportResolutionStrategies({
        certificationIssueReportRepository,
        challengeRepository,
      });

      await _handleAutoJuryV2({
        certificationAssessment,
        resolutionStrategies,
        certificationCourse,
        certificationIssueReportRepository,
        certificationAssessmentRepository,
        certificationRescoringRepository,
      });
    }
  }
}

/**
 * @param {Object} params
 * @param {CertificationRescoringRepository} params.certificationRescoringRepository
 */
async function _handleAutoJuryV2({
  certificationCourse,
  certificationIssueReportRepository,
  certificationAssessmentRepository,
  certificationRescoringRepository,
  resolutionStrategies,
  certificationAssessment,
}) {
  const hasAutoCompleteAnEffectOnScoring = await _autoCompleteUnfinishedTest({
    certificationCourse,
    certificationAssessment,
    certificationAssessmentRepository,
  });

  const hasAutoResolutionAnEffectOnScoring = await _autoResolveCertificationIssueReport({
    certificationCourse,
    certificationAssessment,
    certificationIssueReportRepository,
    certificationAssessmentRepository,
    resolutionStrategies,
  });

  if (hasAutoResolutionAnEffectOnScoring || hasAutoCompleteAnEffectOnScoring) {
    const certificationJuryDoneEvent = new CertificationJuryDone({
      certificationCourseId: certificationCourse.getId(),
    });

    await certificationRescoringRepository.rescoreV2Certification({
      event: certificationJuryDoneEvent,
    });
  }
}

function _areV3CertificationCourses(certificationCourses) {
  return certificationCourses[0].isV3();
}

/**
 * @param {Object} params
 * @param {CertificationRescoringRepository} params.certificationRescoringRepository
 */
async function _handleAutoJuryV3({
  certificationCourse,
  certificationAssessment,
  certificationAssessmentRepository,
  certificationRescoringRepository,
}) {
  if (_v3CertificationShouldBeScored(certificationAssessment)) {
    const certificationJuryDoneEvent = new CertificationJuryDone({
      certificationCourseId: certificationCourse.getId(),
    });

    await certificationRescoringRepository.rescoreV3Certification({
      event: certificationJuryDoneEvent,
    });
  }

  certificationAssessment.endDueToFinalization();

  await certificationAssessmentRepository.save(certificationAssessment);
}

function _v3CertificationShouldBeScored(certificationAssessment) {
  return certificationAssessment.state !== CertificationAssessment.states.COMPLETED;
}

async function _autoCompleteUnfinishedTest({
  certificationCourse,
  certificationAssessment,
  certificationAssessmentRepository,
}) {
  if (certificationCourse.isCompleted()) {
    return false;
  }

  if (certificationCourse.isAbortReasonCandidateRelated()) {
    certificationAssessment.skipUnansweredChallenges();
  }

  if (certificationCourse.isAbortReasonTechnical()) {
    certificationAssessment.neutralizeUnansweredChallenges();
  }

  certificationAssessment.endDueToFinalization();

  await certificationAssessmentRepository.save(certificationAssessment);

  return true;
}

async function _autoResolveCertificationIssueReport({
  certificationCourse,
  certificationAssessment,
  certificationIssueReportRepository,
  certificationAssessmentRepository,
  resolutionStrategies,
}) {
  const certificationIssueReports = await certificationIssueReportRepository.findByCertificationCourseId({
    certificationCourseId: certificationCourse.getId(),
  });

  if (certificationIssueReports.length === 0) {
    return null;
  }

  const resolutionAttempts = await PromiseUtils.mapSeries(
    certificationIssueReports,
    async (certificationIssueReport) => {
      try {
        return await resolutionStrategies.resolve({ certificationIssueReport, certificationAssessment });
      } catch (e) {
        logger.error(e);
        return CertificationIssueReportResolutionAttempt.unresolved();
      }
    },
  );

  if (resolutionAttempts.some((attempt) => attempt.isResolvedWithEffect())) {
    await certificationAssessmentRepository.save(certificationAssessment);
    return true;
  }

  return false;
}
