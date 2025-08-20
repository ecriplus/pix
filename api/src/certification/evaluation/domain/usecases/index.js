import * as placementProfileService from '../../../../shared/domain/services/placement-profile-service.js';
import { injectDependencies } from '../../../../shared/infrastructure/utils/dependency-injection.js';
import * as verifyCertificateCodeService from '../../../evaluation/domain/services/verify-certificate-code-service.js';
import {
  answerRepository,
  assessmentRepository,
  assessmentResultRepository,
  certificationChallengeRepository as sessionManagementCertificationChallengeRepository,
  challengeRepository as sharedChallengeRepository,
  competenceMarkRepository,
  cpfExportRepository,
  flashAlgorithmConfigurationRepository,
  sessionRepositories,
  sharedCompetenceMarkRepository,
} from '../../../session-management/infrastructure/repositories/index.js';
import * as certificationBadgesService from '../../../shared/domain/services/certification-badges-service.js';
import * as certificationAssessmentRepository from '../../../shared/infrastructure/repositories/certification-assessment-repository.js';
import * as sharedCertificationCandidateRepository from '../../../shared/infrastructure/repositories/certification-candidate-repository.js';
import * as certificationCenterRepository from '../../../shared/infrastructure/repositories/certification-center-repository.js';
import * as certificationCourseRepository from '../../../shared/infrastructure/repositories/certification-course-repository.js';
import * as sharedFlashAlgorithmConfigurationRepository from '../../../shared/infrastructure/repositories/flash-algorithm-configuration-repository.js';
import * as userRepository from '../../../shared/infrastructure/repositories/user-repository.js';
import * as certificationCandidateRepository from '../../infrastructure/repositories/certification-candidate-repository.js';
import * as certificationCompanionAlertRepository from '../../infrastructure/repositories/certification-companion-alert-repository.js';
import * as challengeCalibrationRepository from '../../infrastructure/repositories/challenge-calibration-repository.js';
import * as complementaryCertificationCourseRepository from '../../infrastructure/repositories/complementary-certification-course-repository.js';
import * as complementaryCertificationScoringCriteriaRepository from '../../infrastructure/repositories/complementary-certification-scoring-criteria-repository.js';
import * as evaluationSessionRepository from '../../infrastructure/repositories/session-repository.js';
import * as flashAlgorithmService from '../services/algorithm-methods/flash.js';
import { services } from '../services/index.js';
import pickChallengeService from '../services/pick-challenge-service.js';

/**
 * @typedef {certificationCompanionAlertRepository} CertificationCompanionAlertRepository
 * @typedef {evaluationSessionRepository} EvaluationSessionRepository
 * @typedef {certificationChallengeRepository} CertificationChallengeRepository
 * @typedef {certificationAssessmentRepository} CertificationAssessmentRepository
 * @typedef {complementaryCertificationCourseRepository} ComplementaryCertificationCourseRepository
 * @typedef {complementaryCertificationScoringCriteriaRepository} ComplementaryCertificationScoringCriteriaRepository
 * @typedef {assessmentResultRepository} AssessmentResultRepository
 * @typedef {certificationCourseRepository} CertificationCourseRepository
 * @typedef {sharedFlashAlgorithmConfigurationRepository} SharedFlashAlgorithmConfigurationRepository
 * @typedef {sharedChallengeRepository} SharedChallengeRepository
 * @typedef {services} Services
 */
const dependencies = {
  ...sessionRepositories,
  evaluationSessionRepository,
  sessionManagementCertificationChallengeRepository,
  challengeCalibrationRepository,
  certificationCandidateRepository,
  assessmentRepository,
  sharedCertificationCandidateRepository,
  verifyCertificateCodeService,
  assessmentResultRepository,
  answerRepository,
  sharedCompetenceMarkRepository,
  sharedChallengeRepository,
  userRepository,
  competenceMarkRepository,
  cpfExportRepository,
  flashAlgorithmConfigurationRepository,
  flashAlgorithmService,
  certificationBadgesService,
  pickChallengeService,
  placementProfileService,
  certificationCenterRepository,
  certificationCompanionAlertRepository,
  certificationCourseRepository,
  certificationAssessmentRepository,
  complementaryCertificationCourseRepository,
  complementaryCertificationScoringCriteriaRepository,
  sharedFlashAlgorithmConfigurationRepository,
  services,
};

import { createCompanionAlert } from './create-companion-alert.js';
import { deneutralizeChallenge } from './deneutralize-challenge.js';
import { getNextChallenge } from './get-next-challenge.js';
import { getNextChallengeForV2Certification } from './get-next-challenge-for-v2-certification.js';
import { neutralizeChallenge } from './neutralize-challenge.js';
import { rescoreV2Certification } from './rescore-v2-certification.js';
import { rescoreV3Certification } from './rescore-v3-certification.js';
import { retrieveLastOrCreateCertificationCourse } from './retrieve-last-or-create-certification-course.js';
import { scoreCompletedCertification } from './score-completed-certification.js';
import { simulateFlashAssessmentScenario } from './simulate-flash-assessment-scenario.js';

const usecasesWithoutInjectedDependencies = {
  createCompanionAlert,
  deneutralizeChallenge,
  getNextChallengeForV2Certification,
  getNextChallenge,
  neutralizeChallenge,
  rescoreV2Certification,
  rescoreV3Certification,
  retrieveLastOrCreateCertificationCourse,
  scoreCompletedCertification,
  simulateFlashAssessmentScenario,
};
const usecases = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);

export { usecases };
