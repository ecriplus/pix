// @ts-check
/**
 * @typedef {import ('./index.js').CandidateRepository} CandidateRepository
 * @typedef {import ('./index.js').CertificationCourseRepository} CertificationCourseRepository
 * @typedef {import ('./index.js').PlacementProfileService} PlacementProfileService
 * @typedef {import ('./index.js').EligibilityService} EligibilityService
 * @typedef {import ('./index.js').CertificationBadgesService} CertificationBadgesService
 * @typedef {import ('../../infrastructure/repositories/index.js').ComplementaryCertificationCourseRepository} ComplementaryCertificationCourseRepository
 * @typedef {import ('../../infrastructure/repositories/index.js').ComplementaryCertificationBadgeWithOffsetVersionRepository} ComplementaryCertificationBadgeWithOffsetVersionRepository
 * @typedef {import ('./index.js').CertificationAssessmentRepository} CertificationAssessmentRepository
 * @typedef {import ('../models/timeline/TimelineEvent.js').TimelineEvent} TimelineEvent
 * @typedef {import ('../models/Candidate.js').Candidate} Candidate
 * @typedef {import ('../models/Candidate.js').Subscription} Subscription
 * @typedef {import ('../read-models/UserCertificationEligibility.js').UserCertificationEligibility} UserCertificationEligibility
 * @typedef {import ('../../../shared/domain/models/CertificationCourse.js').CertificationCourse} CertificationCourse
 * @typedef {import ('../../../session-management/domain/models/CertificationAssessment.js').CertificationAssessment} CertificationAssessment
 */

import { CandidateCertifiableAndEligibleEvent } from '../models/timeline/CandidateCertifiableAndEligibleEvent.js';
import { CandidateCertifiableEvent } from '../models/timeline/CandidateCertifiableEvent.js';
import { CandidateCreatedEvent } from '../models/timeline/CandidateCreatedEvent.js';
import { CandidateEndScreenEvent } from '../models/timeline/CandidateEndScreenEvent.js';
import { CandidateNotCertifiableEvent } from '../models/timeline/CandidateNotCertifiableEvent.js';
import { CandidateNotEligibleEvent } from '../models/timeline/CandidateNotEligibleEvent.js';
import { CandidateReconciledEvent } from '../models/timeline/CandidateReconciledEvent.js';
import { CandidateTimeline } from '../models/timeline/CandidateTimeline.js';
import { CertificationEndedEvent } from '../models/timeline/CertificationEndedEvent.js';
import { CertificationStartedEvent } from '../models/timeline/CertificationStartedEvent.js';

/**
 * @param {Object} params
 * @param {number} params.sessionId
 * @param {number} params.certificationCandidateId
 * @param {CandidateRepository} params.candidateRepository
 * @param {CertificationCourseRepository} params.certificationCourseRepository
 * @param {CertificationAssessmentRepository} params.certificationAssessmentRepository
 * @param {ComplementaryCertificationCourseRepository} params.complementaryCertificationCourseRepository
 * @param {ComplementaryCertificationBadgeWithOffsetVersionRepository} params.complementaryCertificationBadgeWithOffsetVersionRepository
 * @param {CertificationBadgesService} params.certificationBadgesService
 * @param {EligibilityService} params.eligibilityService
 * @param {PlacementProfileService} params.placementProfileService
 * @returns {Promise<CandidateTimeline>}
 */
export const getCandidateTimeline = async ({
  certificationCandidateId,
  candidateRepository,
  certificationCourseRepository,
  certificationAssessmentRepository,
  certificationBadgesService,
  placementProfileService,
  eligibilityService,
  complementaryCertificationCourseRepository,
  complementaryCertificationBadgeWithOffsetVersionRepository,
}) => {
  const timeline = new CandidateTimeline({ certificationCandidateId });

  const candidate = await candidateRepository.get({ certificationCandidateId });
  timeline.addEvent(new CandidateCreatedEvent({ when: candidate.createdAt }));

  if (!candidate.isReconciled()) {
    return timeline;
  }

  timeline.addEvent(new CandidateReconciledEvent({ when: candidate.reconciledAt }));

  const certificationCourse = await certificationCourseRepository.findOneCertificationCourseByUserIdAndSessionId({
    userId: candidate.userId,
    sessionId: candidate.sessionId,
  });

  if (!certificationCourse) {
    const events = await _whenCandidateDidNotStartCertification({
      candidate,
      placementProfileService,
      certificationBadgesService,
      eligibilityService,
      complementaryCertificationCourseRepository,
      complementaryCertificationBadgeWithOffsetVersionRepository,
    });
    events.forEach((event) => timeline.addEvent(event));
    return timeline;
  }

  timeline.addEvent(new CertificationStartedEvent({ when: certificationCourse.getStartDate() }));
  const events = await _whenCandidateHasStartedTheTest({
    candidate,
    certificationCourse,
    placementProfileService,
    certificationBadgesService,
    eligibilityService,
    complementaryCertificationCourseRepository,
    complementaryCertificationBadgeWithOffsetVersionRepository,
  });
  events.forEach((event) => timeline.addEvent(event));

  if (certificationCourse.isCompleted()) {
    timeline.addEvent(new CandidateEndScreenEvent({ when: certificationCourse._completedAt }));
    return timeline;
  }

  const assessment = await certificationAssessmentRepository.getByCertificationCandidateId({
    certificationCandidateId,
  });
  if (assessment.endedAt) {
    timeline.addEvent(new CertificationEndedEvent({ when: assessment.endedAt, assessmentState: assessment.state }));
  }

  return timeline;
};

/**
 * @param {Object} params
 * @param {Candidate} params.candidate
 * @param {PlacementProfileService} params.placementProfileService
 * @param {CertificationBadgesService} params.certificationBadgesService
 * @param {EligibilityService} params.eligibilityService
 * @param {ComplementaryCertificationCourseRepository} params.complementaryCertificationCourseRepository
 * @param {ComplementaryCertificationBadgeWithOffsetVersionRepository} params.complementaryCertificationBadgeWithOffsetVersionRepository
 * @returns {Promise<Array<TimelineEvent>>}
 */
const _whenCandidateDidNotStartCertification = async ({
  candidate,
  placementProfileService,
  certificationBadgesService,
  eligibilityService,
  complementaryCertificationCourseRepository,
  complementaryCertificationBadgeWithOffsetVersionRepository,
}) => {
  const certificabilityEvent = await _getCertificabilityEvent({
    candidate,
    userId: candidate.userId,
    atDate: candidate.reconciledAt,
    placementProfileService,
    eligibilityService,
    certificationBadgesService,
    complementaryCertificationCourseRepository,
    complementaryCertificationBadgeWithOffsetVersionRepository,
  });

  return [certificabilityEvent];
};

/**
 * @param {Object} params
 * @param {Candidate} params.candidate
 * @param {CertificationCourse} params.certificationCourse
 * @param {CertificationBadgesService} params.certificationBadgesService
 * @param {PlacementProfileService} params.placementProfileService
 * @param {EligibilityService} params.eligibilityService
 * @param {ComplementaryCertificationCourseRepository} params.complementaryCertificationCourseRepository
 * @param {ComplementaryCertificationBadgeWithOffsetVersionRepository} params.complementaryCertificationBadgeWithOffsetVersionRepository
 * @returns {Promise<Array<TimelineEvent>>}
 */
const _whenCandidateHasStartedTheTest = async ({
  candidate,
  certificationCourse,
  certificationBadgesService,
  placementProfileService,
  eligibilityService,
  complementaryCertificationCourseRepository,
  complementaryCertificationBadgeWithOffsetVersionRepository,
}) => {
  const certificabilityEvent = await _getCertificabilityEvent({
    candidate,
    userId: certificationCourse.getUserId(),
    atDate: certificationCourse.getStartDate(),
    placementProfileService,
    eligibilityService,
    certificationBadgesService,
    complementaryCertificationCourseRepository,
    complementaryCertificationBadgeWithOffsetVersionRepository,
  });

  return [certificabilityEvent];
};

/**
 * @param {Object} params
 * @param {number} params.userId
 * @param {Candidate} params.candidate
 * @param {Date} params.atDate
 * @param {PlacementProfileService} params.placementProfileService
 * @param {CertificationBadgesService} params.certificationBadgesService
 * @param {EligibilityService} params.eligibilityService
 * @param {ComplementaryCertificationCourseRepository} params.complementaryCertificationCourseRepository
 * @param {ComplementaryCertificationBadgeWithOffsetVersionRepository} params.complementaryCertificationBadgeWithOffsetVersionRepository
 * @returns {Promise<TimelineEvent>}
 */
const _getCertificabilityEvent = async ({
  candidate,
  userId,
  atDate,
  certificationBadgesService,
  eligibilityService,
  placementProfileService,
  complementaryCertificationCourseRepository,
  complementaryCertificationBadgeWithOffsetVersionRepository,
}) => {
  const userEligibility = await eligibilityService.getUserCertificationEligibility({
    userId,
    limitDate: atDate,
    certificationBadgesService,
    placementProfileService,
    complementaryCertificationCourseRepository,
    complementaryCertificationBadgeWithOffsetVersionRepository,
  });

  return _determineUserEligibilityStatus({ userEligibility, atDate, candidate });
};

/**
 * @param {Object} params
 * @param {UserCertificationEligibility} params.userEligibility
 * @param {Date} params.atDate
 * @param {Candidate} params.candidate
 * @returns {TimelineEvent}
 */
const _determineUserEligibilityStatus = ({ userEligibility, atDate, candidate }) => {
  if (!userEligibility.isCertifiable) {
    return new CandidateNotCertifiableEvent({ when: atDate });
  }

  if (_candidateIsRegisteredToDoubleCertification(candidate)) {
    if (_candidateIsEligibleToDoubleCertification(userEligibility)) {
      return new CandidateCertifiableAndEligibleEvent({ when: atDate });
    }

    return new CandidateNotEligibleEvent({ when: atDate });
  }

  return new CandidateCertifiableEvent({ when: atDate });
};

/**
 * @param {Candidate} candidate
 * @returns {boolean}
 */
const _candidateIsRegisteredToDoubleCertification = (candidate) => {
  return candidate.subscriptions.length === 2;
};

/**
 * @param {UserCertificationEligibility} userEligibility
 * @returns {boolean}
 */
const _candidateIsEligibleToDoubleCertification = (userEligibility) => {
  return userEligibility.doubleCertificationEligibility && userEligibility.doubleCertificationEligibility.isBadgeValid;
};
