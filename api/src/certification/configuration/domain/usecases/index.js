import * as challengeRepository from '../../../../shared/infrastructure/repositories/challenge-repository.js';
import * as skillRepository from '../../../../shared/infrastructure/repositories/skill-repository.js';
import * as tubeRepository from '../../../../shared/infrastructure/repositories/tube-repository.js';
import { injectDependencies } from '../../../../shared/infrastructure/utils/dependency-injection.js';
import * as complementaryCertificationForTargetProfileAttachmentRepository from '../../../complementary-certification/infrastructure/repositories/complementary-certification-for-target-profile-attachment-repository.js';
import * as sharedFlashAlgorithmConfigurationRepository from '../../../shared/infrastructure/repositories/flash-algorithm-configuration-repository.js';
import * as activeCalibratedChallengeRepository from '../../infrastructure/repositories/active-calibrated-challenge-repository.js';
import * as attachableTargetProfileRepository from '../../infrastructure/repositories/attachable-target-profiles-repository.js';
import * as candidateRepository from '../../infrastructure/repositories/candidate-repository.js';
import * as centerRepository from '../../infrastructure/repositories/center-repository.js';
import * as complementaryCertificationRepository from '../../infrastructure/repositories/complementary-certification-repository.js';
import * as flashAlgorithmConfigurationRepository from '../../infrastructure/repositories/flash-algorithm-configuration-repository.js';
import * as frameworkChallengesRepository from '../../infrastructure/repositories/framework-challenges-repository.js';
import * as learningContentRepository from '../../infrastructure/repositories/learning-content-repository.js';
import * as versionsRepository from '../../infrastructure/repositories/versions-repository.js';

/**
 *
 * Using {@link https://jsdoc.app/tags-type "Closure Compiler's syntax"} to document injected dependencies
 *
 * @typedef {activeCalibratedChallengeRepository} ActiveCalibratedChallengeRepository
 * @typedef {attachableTargetProfileRepository} AttachableTargetProfileRepository
 * @typedef {candidateRepository} CandidateRepository
 * @typedef {centerRepository} CenterRepository
 * @typedef {challengeRepository} ChallengeRepository
 * @typedef {complementaryCertificationRepository} ComplementaryCertificationRepository
 * @typedef {frameworkChallengesRepository} FrameworkChallengesRepository
 * @typedef {consolidatedFrameworkRepository} ConsolidatedFrameworkRepository
 * @typedef {complementaryCertificationForTargetProfileAttachmentRepository} ComplementaryCertificationForTargetProfileAttachmentRepository
 * @typedef {learningContentRepository} LearningContentRepository
 * @typedef {skillRepository} SkillRepository
 * @typedef {tubeRepository} TubeRepository
 * @typedef {flashAlgorithmConfigurationRepository} FlashAlgorithmConfigurationRepository
 * @typedef {sharedFlashAlgorithmConfigurationRepository} SharedFlashAlgorithmConfigurationRepository
 * @typedef {versionsRepository} VersionsRepository
 **/
const dependencies = {
  activeCalibratedChallengeRepository,
  attachableTargetProfileRepository,
  candidateRepository,
  centerRepository,
  challengeRepository,
  complementaryCertificationForTargetProfileAttachmentRepository,
  complementaryCertificationRepository,
  flashAlgorithmConfigurationRepository,
  frameworkChallengesRepository,
  learningContentRepository,
  skillRepository,
  tubeRepository,
  sharedFlashAlgorithmConfigurationRepository,
  versionsRepository,
};

import { calibrateFrameworkVersion } from './calibrate-framework-version.js';
import { catchingUpCandidateReconciliation } from './catching-up-candidate-reconciliation.js';
import { createCertificationVersion } from './create-certification-version.js';
import { createFlashAssessmentConfiguration } from './create-flash-assessment-configuration.js';
import { exportScoWhitelist } from './export-sco-whitelist.js';
import { findComplementaryCertifications } from './find-complementary-certifications.js';
import { getActiveFlashAssessmentConfiguration } from './get-active-flash-assessment-configuration.js';
import { getComplementaryCertificationForTargetProfileAttachmentRepository } from './get-complementary-certification-for-target-profile-attachment.js';
import { getCurrentFrameworkVersion } from './get-current-framework-version.js';
import { getFrameworkHistory } from './get-framework-history.js';
import { importScoWhitelist } from './import-sco-whitelist.js';
import { searchAttachableTargetProfiles } from './search-attachable-target-profiles.js';
import { updateCertificationVersion } from './update-certification-version.js';

const usecasesWithoutInjectedDependencies = {
  calibrateFrameworkVersion,
  catchingUpCandidateReconciliation,
  createCertificationVersion,
  createFlashAssessmentConfiguration,
  exportScoWhitelist,
  findComplementaryCertifications,
  getActiveFlashAssessmentConfiguration,
  getCurrentFrameworkVersion,
  getComplementaryCertificationForTargetProfileAttachmentRepository,
  getFrameworkHistory,
  importScoWhitelist,
  searchAttachableTargetProfiles,
  updateCertificationVersion,
};

const usecases = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);

/**
 * @typedef {dependencies} dependencies
 */
export { usecases };
