import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as certificationChallengesService from '../../../../../lib/domain/services/certification-challenges-service.js';
import * as verifyCertificateCodeService from '../../../../../lib/domain/services/verify-certificate-code-service.js';
import { pickChallengeService } from '../../../../evaluation/domain/services/pick-challenge-service.js';
import * as languageService from '../../../../shared/domain/services/language-service.js';
import * as placementProfileService from '../../../../shared/domain/services/placement-profile-service.js';
import { injectDependencies } from '../../../../shared/infrastructure/utils/dependency-injection.js';
import { importNamedExportsFromDirectory } from '../../../../shared/infrastructure/utils/import-named-exports-from-directory.js';
import * as flashAlgorithmService from '../../../flash-certification/domain/services/algorithm-methods/flash.js';
import {
  answerRepository,
  assessmentRepository,
  assessmentResultRepository,
  certificationChallengeRepository,
  challengeRepository,
  competenceMarkRepository,
  cpfExportRepository,
  flashAlgorithmConfigurationRepository,
  sessionRepositories,
  sharedCompetenceMarkRepository,
} from '../../../session-management/infrastructure/repositories/index.js';
import * as certificationBadgesService from '../../../shared/domain/services/certification-badges-service.js';
import * as sharedCertificationCandidateRepository from '../../../shared/infrastructure/repositories/certification-candidate-repository.js';
import * as certificationCenterRepository from '../../../shared/infrastructure/repositories/certification-center-repository.js';
import * as certificationCourseRepository from '../../../shared/infrastructure/repositories/certification-course-repository.js';
import * as userRepository from '../../../shared/infrastructure/repositories/user-repository.js';
import * as certificationCandidateRepository from '../../infrastructure/repositories/certification-candidate-repository.js';
import * as certificationCompanionAlertRepository from '../../infrastructure/repositories/certification-companion-alert-repository.js';
/**
 * @typedef {certificationCompanionAlertRepository} CertificationCompanionAlertRepository
 */

const dependencies = {
  ...sessionRepositories,
  assessmentRepository,
  sharedCertificationCandidateRepository,
  verifyCertificateCodeService,
  assessmentResultRepository,
  answerRepository,
  sharedCompetenceMarkRepository,
  challengeRepository,
  userRepository,
  competenceMarkRepository,
  certificationChallengesService,
  cpfExportRepository,
  certificationChallengeRepository,
  flashAlgorithmConfigurationRepository,
  flashAlgorithmService,
  languageService,
  certificationBadgesService,
  pickChallengeService,
  placementProfileService,
  certificationCenterRepository,
  certificationCandidateRepository,
  certificationCompanionAlertRepository,
  certificationCourseRepository,
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
