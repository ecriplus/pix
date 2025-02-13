// eslint-disable import/no-restricted-paths
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as certificationResultRepository from '../../../../../lib/infrastructure/repositories/certification-result-repository.js';
import * as competenceMarkRepository from '../../../../../lib/infrastructure/repositories/competence-mark-repository.js';
import * as answerRepository from '../../../../shared/infrastructure/repositories/answer-repository.js';
import * as assessmentResultRepository from '../../../../shared/infrastructure/repositories/assessment-result-repository.js';
import * as challengeRepository from '../../../../shared/infrastructure/repositories/challenge-repository.js';
import * as competenceRepository from '../../../../shared/infrastructure/repositories/competence-repository.js';
import { injectDependencies } from '../../../../shared/infrastructure/utils/dependency-injection.js';
import { importNamedExportsFromDirectory } from '../../../../shared/infrastructure/utils/import-named-exports-from-directory.js';
import * as flashAlgorithmService from '../../../flash-certification/domain/services/algorithm-methods/flash.js';
import * as pickChallengeService from '../../../flash-certification/domain/services/pick-challenge-service.js';
import * as flashAlgorithmConfigurationRepository from '../../../flash-certification/infrastructure/repositories/flash-algorithm-configuration-repository.js';
import * as certificationChallengeLiveAlertRepository from '../../../shared/infrastructure/repositories/certification-challenge-live-alert-repository.js';
import * as certificationChallengeRepository from '../../../shared/infrastructure/repositories/certification-challenge-repository.js';
import * as certificationCourseRepository from '../../../shared/infrastructure/repositories/certification-course-repository.js';
import * as certificationReportRepository from '../../../shared/infrastructure/repositories/certification-report-repository.js';
import * as certificateRepository from '../../infrastructure/repositories/certificate-repository.js';
import * as courseAssessmentResultRepository from '../../infrastructure/repositories/course-assessment-result-repository.js';
import * as scoCertificationCandidateRepository from '../../infrastructure/repositories/sco-certification-candidate-repository.js';
import * as v3CertificationCourseDetailsForAdministrationRepository from '../../infrastructure/repositories/v3-certification-course-details-for-administration-repository.js';
/**
 * Using {@link https://jsdoc.app/tags-type "Closure Compiler's syntax"} to document injected dependencies
 *
 * @typedef {competenceRepository} CompetenceRepository
 * @typedef {answerRepository} AnswerRepository
 * @typedef {challengeRepository} ChallengeRepository
 * @typedef {assessmentResultRepository} AssessmentResultRepository
 * @typedef {courseAssessmentResultRepository} CourseAssessmentResultRepository
 * @typedef {competenceMarkRepository} CompetenceMarkRepository
 * @typedef {certificationResultRepository} CertificationResultRepository
 * @typedef {scoCertificationCandidateRepository} ScoCertificationCandidateRepository
 * @typedef {certificationCourseRepository} CertificationCourseRepository
 * @typedef {certificateRepository} CertificateRepository
 * @typedef {certificationChallengeRepository} CertificationChallengeRepository
 * @typedef {certificationChallengeLiveAlertRepository} CertificationChallengeLiveAlertRepository
 * @typedef {certificationReportRepository} CertificationReportRepository
 * @typedef {pickChallengeService} PickChallengeService
 * @typedef {flashAlgorithmService} FlashAlgorithmService
 * @typedef {flashAlgorithmConfigurationRepository} FlashAlgorithmConfigurationRepository
 * @typedef {v3CertificationCourseDetailsForAdministrationRepository} V3CertificationCourseDetailsForAdministrationRepository
 **/
const dependencies = {
  competenceRepository,
  answerRepository,
  challengeRepository,
  assessmentResultRepository,
  competenceMarkRepository,
  courseAssessmentResultRepository,
  certificationCourseRepository,
  certificationResultRepository,
  scoCertificationCandidateRepository,
  certificateRepository,
  certificationChallengeRepository,
  certificationChallengeLiveAlertRepository,
  certificationReportRepository,
  pickChallengeService,
  flashAlgorithmService,
  flashAlgorithmConfigurationRepository,
  v3CertificationCourseDetailsForAdministrationRepository,
};

const path = dirname(fileURLToPath(import.meta.url));

/**
 * Note : current ignoredFileNames are injected in * {@link file://./../../../shared/domain/usecases/index.js}
 * This is in progress, because they should be injected in this file and not by shared sub-domain
 * The only remaining file ignored should be index.js
 */
const usecasesWithoutInjectedDependencies = {
  ...(await importNamedExportsFromDirectory({
    path: join(path, './'),
    ignoredFileNames: ['index.js'],
  })),
};

const usecases = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);

export { usecases };
