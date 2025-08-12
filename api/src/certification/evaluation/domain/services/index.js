// TODO: cross-bounded context violation
import * as scoringDegradationService from '../../../../certification/scoring/domain/services/scoring-degradation-service.js';
import * as certificationChallengeLiveAlertRepository from '../../../../certification/shared/infrastructure/repositories/certification-challenge-live-alert-repository.js';
// TODO: cross-bounded context violation
import * as scoringService from '../../../../evaluation/domain/services/scoring/scoring-service.js';
import * as placementProfileService from '../../../../shared/domain/services/placement-profile-service.js';
import * as answerRepository from '../../../../shared/infrastructure/repositories/answer-repository.js';
import * as areaRepository from '../../../../shared/infrastructure/repositories/area-repository.js';
import * as assessmentResultRepository from '../../../../shared/infrastructure/repositories/assessment-result-repository.js';
import * as sharedChallengeRepository from '../../../../shared/infrastructure/repositories/challenge-repository.js';
import { injectDependencies } from '../../../../shared/infrastructure/utils/dependency-injection.js';
import * as challengeRepository from '../../../evaluation/infrastructure/repositories/challenge-repository.js';
import * as certificationAssessmentRepository from '../../../shared/infrastructure/repositories/certification-assessment-repository.js';
import * as certificationCourseRepository from '../../../shared/infrastructure/repositories/certification-course-repository.js';
import * as competenceMarkRepository from '../../../shared/infrastructure/repositories/competence-mark-repository.js';
import * as complementaryCertificationBadgesRepository from '../../../shared/infrastructure/repositories/complementary-certification-badge-repository.js';
import * as complementaryCertificationCourseResultRepository from '../../../shared/infrastructure/repositories/complementary-certification-course-result-repository.js';
import * as flashAlgorithmConfigurationRepository from '../../../shared/infrastructure/repositories/flash-algorithm-configuration-repository.js';
import * as scoringConfigurationRepository from '../../../shared/infrastructure/repositories/scoring-configuration-repository.js';
import * as certificationAssessmentHistoryRepository from '../../infrastructure/repositories/certification-assessment-history-repository.js';
import * as certificationCandidateRepository from '../../infrastructure/repositories/certification-candidate-repository.js';
import * as challengeCalibrationRepository from '../../infrastructure/repositories/challenge-calibration-repository.js';
import * as complementaryCertificationScoringCriteriaRepository from '../../infrastructure/repositories/complementary-certification-scoring-criteria-repository.js';
import * as flashAlgorithmService from './algorithm-methods/flash.js';

/**
 * Using {@link https://jsdoc.app/tags-type "Closure Compiler's syntax"} to document injected dependencies
 *
 * @typedef {assessmentResultRepository} AssessmentResultRepository
 * @typedef {competenceMarkRepository} CompetenceMarkRepository
 * @typedef {certificationCourseRepository} CertificationCourseRepository
 * @typedef {scoringDegradationService} ScoringDegradationService
 * @typedef {certificationAssessmentHistoryRepository} CertificationAssessmentHistoryRepository
 * @typedef {challengeCalibrationRepository} ChallengeCalibrationRepository
 * @typedef {certificationChallengeLiveAlertRepository} CertificationChallengeLiveAlertRepository
 * @typedef {scoringConfigurationRepository} ScoringConfigurationRepository
 * @typedef {flashAlgorithmConfigurationRepository} FlashAlgorithmConfigurationRepository
 * @typedef {answerRepository} AnswerRepository
 * @typedef {flashAlgorithmService} FlashAlgorithmService
 * @typedef {challengeRepository} ChallengeRepository
 * @typedef {scoringService} ScoringService
 * @typedef {areaRepository} AreaRepository
 * @typedef {placementProfileService} PlacementProfileService
 * @typedef {certificationCandidateRepository} CertificationCandidateRepository
 * @typedef {complementaryCertificationBadgesRepository} ComplementaryCertificationBadgesRepository
 * @typedef {certificationAssessmentRepository} CertificationAssessmentRepository
 * @typedef {complementaryCertificationCourseResultRepository} ComplementaryCertificationCourseResultRepository *
 * @typedef {complementaryCertificationScoringCriteriaRepository} ComplementaryCertificationScoringCriteriaRepository
 * @typedef {sharedChallengeRepository} SharedChallengeRepository
 */
const dependencies = {
  assessmentResultRepository,
  competenceMarkRepository,
  certificationCourseRepository,
  scoringDegradationService,
  flashAlgorithmConfigurationRepository,
  scoringConfigurationRepository,
  answerRepository,
  certificationAssessmentHistoryRepository,
  certificationChallengeLiveAlertRepository,
  flashAlgorithmService,
  challengeCalibrationRepository,
  challengeRepository,
  areaRepository,
  placementProfileService,
  scoringService,
  certificationCandidateRepository,
  complementaryCertificationBadgesRepository,
  certificationAssessmentRepository,
  complementaryCertificationCourseResultRepository,
  complementaryCertificationScoringCriteriaRepository,
  sharedChallengeRepository,
};

import { findByCertificationCourseIdAndAssessmentId } from './scoring/calibrated-challenge-service.js';
import { scoreComplementaryCertificationV2 } from './scoring/score-complementary-certification-v2.js';
import { scoreDoubleCertificationV3 } from './scoring/score-double-certification-v3.js';
import { calculateCertificationAssessmentScore, handleV2CertificationScoring } from './scoring/scoring-v2.js';
import { handleV3CertificationScoring } from './scoring/scoring-v3.js';

const usecasesWithoutInjectedDependencies = {
  findByCertificationCourseIdAndAssessmentId,
  scoreComplementaryCertificationV2,
  scoreDoubleCertificationV3,
  calculateCertificationAssessmentScore,
  handleV2CertificationScoring,
  handleV3CertificationScoring,
};

const services = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);

export { services };
