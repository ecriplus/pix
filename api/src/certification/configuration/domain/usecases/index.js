import * as challengeRepository from '../../../../shared/infrastructure/repositories/challenge-repository.js';
import * as skillRepository from '../../../../shared/infrastructure/repositories/skill-repository.js';
import * as tubeRepository from '../../../../shared/infrastructure/repositories/tube-repository.js';
import { injectDependencies } from '../../../../shared/infrastructure/utils/dependency-injection.js';
import * as complementaryCertificationForTargetProfileAttachmentRepository from '../../../complementary-certification/infrastructure/repositories/complementary-certification-for-target-profile-attachment-repository.js';
import * as targetProfileHistoryRepository from '../../../shared/infrastructure/repositories/target-profile-history-repository.js';
import * as activeCalibratedChallengeRepository from '../../infrastructure/repositories/active-calibrated-challenge-repository.js';
import * as attachableTargetProfileRepository from '../../infrastructure/repositories/attachable-target-profiles-repository.js';
import * as candidateRepository from '../../infrastructure/repositories/candidate-repository.js';
import * as centerRepository from '../../infrastructure/repositories/center-repository.js';
import * as complementaryCertificationRepository from '../../infrastructure/repositories/complementary-certification-repository.js';
import * as frameworkChallengesRepository from '../../infrastructure/repositories/framework-challenges-repository.js';
import * as learningContentRepository from '../../infrastructure/repositories/learning-content-repository.js';
import * as ScoBlockedAccessDatesRepository from '../../infrastructure/repositories/sco-blocked-access-dates-repository.js';
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
 * @typedef {ScoBlockedAccessDatesRepository} ScoBlockedAccessDatesRepository
 * @typedef {versionsRepository} VersionsRepository
 **/
const dependencies = {
  activeCalibratedChallengeRepository,
  attachableTargetProfileRepository,
  candidateRepository,
  centerRepository,
  ScoBlockedAccessDatesRepository,
  challengeRepository,
  complementaryCertificationForTargetProfileAttachmentRepository,
  complementaryCertificationRepository,
  frameworkChallengesRepository,
  learningContentRepository,
  skillRepository,
  targetProfileHistoryRepository,
  tubeRepository,
  versionsRepository,
};

import { calibrateFrameworkVersion } from './calibrate-framework-version.js';
import { catchingUpCandidateReconciliation } from './catching-up-candidate-reconciliation.js';
import { createCertificationVersion } from './create-certification-version.js';
import { exportScoWhitelist } from './export-sco-whitelist.js';
import { findCertificationFrameworks } from './find-certification-frameworks.js';
import { findComplementaryCertifications } from './find-complementary-certifications.js';
import { getActiveVersionByScope } from './get-active-version-by-scope.js';
import { getComplementaryCertificationForTargetProfileAttachmentRepository } from './get-complementary-certification-for-target-profile-attachment.js';
import { getComplementaryCertificationTargetProfileHistory } from './get-complementary-certification-target-profile-history.js';
import { getCurrentFrameworkVersion } from './get-current-framework-version.js';
import { getFrameworkHistory } from './get-framework-history.js';
import { getScoBlockedAccessDates } from './get-sco-blocked-access-dates.js';
import { importScoWhitelist } from './import-sco-whitelist.js';
import { searchAttachableTargetProfiles } from './search-attachable-target-profiles.js';
import { updateCertificationVersion } from './update-certification-version.js';
import { updateScoBlockedAccessDate } from './update-sco-blocked-access-date.js';

const usecasesWithoutInjectedDependencies = {
  calibrateFrameworkVersion,
  catchingUpCandidateReconciliation,
  createCertificationVersion,
  exportScoWhitelist,
  findCertificationFrameworks,
  findComplementaryCertifications,
  getCurrentFrameworkVersion,
  getActiveVersionByScope,
  getComplementaryCertificationForTargetProfileAttachmentRepository,
  getComplementaryCertificationTargetProfileHistory,
  getFrameworkHistory,
  importScoWhitelist,
  searchAttachableTargetProfiles,
  updateCertificationVersion,
  getScoBlockedAccessDates,
  updateScoBlockedAccessDate,
};

const usecases = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);

/**
 * @typedef {dependencies} dependencies
 */
export { usecases };
