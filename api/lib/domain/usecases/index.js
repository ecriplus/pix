// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/no-restricted-paths */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as pixAuthenticationService from '../../../src/authentication/domain/services/pix-authentication-service.js';
import * as refreshTokenService from '../../../src/authentication/domain/services/refresh-token-service.js';
import * as complementaryCertificationCourseRepository from '../../../src/certification/complementary-certification/infrastructure/repositories/complementary-certification-course-repository.js';
import { endAssessmentBySupervisor } from '../../../src/certification/course/domain/usecases/end-assessment-by-supervisor.js';
import { getNextChallengeForV2Certification } from '../../../src/certification/course/domain/usecases/get-next-challenge-for-v2-certification.js';
import { getNextChallengeForV3Certification } from '../../../src/certification/course/domain/usecases/get-next-challenge-for-v3-certification.js';
import * as flashAlgorithmService from '../../../src/certification/flash-certification/domain/services/algorithm-methods/flash.js';
import { pickChallengeService } from '../../../src/certification/flash-certification/domain/services/pick-challenge-service.js';
import * as flashAlgorithmConfigurationRepository from '../../../src/certification/flash-certification/infrastructure/repositories/flash-algorithm-configuration-repository.js';
import * as certificationCpfService from '../../../src/certification/session/domain/services/certification-cpf-service.js';
import * as sessionCodeService from '../../../src/certification/session/domain/services/session-code-service.js';
import * as certificationCandidateRepository from '../../../src/certification/session/infrastructure/repositories/certification-candidate-repository.js';
import * as certificationCpfCityRepository from '../../../src/certification/session/infrastructure/repositories/certification-cpf-city-repository.js';
import * as certificationCpfCountryRepository from '../../../src/certification/session/infrastructure/repositories/certification-cpf-country-repository.js';
import * as certificationOfficerRepository from '../../../src/certification/session/infrastructure/repositories/certification-officer-repository.js';
import * as finalizedSessionRepository from '../../../src/certification/session/infrastructure/repositories/finalized-session-repository.js';
import * as jurySessionRepository from '../../../src/certification/session/infrastructure/repositories/jury-session-repository.js';
import * as sessionRepository from '../../../src/certification/session/infrastructure/repositories/session-repository.js';
import * as certificationAssessmentRepository from '../../../src/certification/shared/infrastructure/repositories/certification-assessment-repository.js';
import * as certificationCenterRepository from '../../../src/certification/shared/infrastructure/repositories/certification-center-repository.js';
import * as certificationChallengeLiveAlertRepository from '../../../src/certification/shared/infrastructure/repositories/certification-challenge-live-alert-repository.js';
import * as certificationChallengeRepository from '../../../src/certification/shared/infrastructure/repositories/certification-challenge-repository.js';
import * as certificationCourseRepository from '../../../src/certification/shared/infrastructure/repositories/certification-course-repository.js';
import * as certificationIssueReportRepository from '../../../src/certification/shared/infrastructure/repositories/certification-issue-report-repository.js';
import * as issueReportCategoryRepository from '../../../src/certification/shared/infrastructure/repositories/issue-report-category-repository.js';
import * as certificationCandidateForSupervisingRepository from '../../../src/certification/supervision/infrastructure/repositories/certification-candidate-for-supervising-repository.js';
import { getCompetenceLevel } from '../../../src/evaluation/domain/services/get-competence-level.js';
import * as scorecardService from '../../../src/evaluation/domain/services/scorecard-service.js';
import * as stageAndStageAcquisitionComparisonService from '../../../src/evaluation/domain/services/stages/stage-and-stage-acquisition-comparison-service.js';
import * as competenceEvaluationRepository from '../../../src/evaluation/infrastructure/repositories/competence-evaluation-repository.js';
import * as stageAcquisitionRepository from '../../../src/evaluation/infrastructure/repositories/stage-acquisition-repository.js';
import * as stageCollectionForTargetProfileRepository from '../../../src/evaluation/infrastructure/repositories/stage-collection-repository.js';
import * as stageRepository from '../../../src/evaluation/infrastructure/repositories/stage-repository.js';
import * as organizationForAdminRepository from '../../../src/organizational-entities/infrastructure/repositories/organization-for-admin-repository.js';
import * as campaignManagementRepository from '../../../src/prescription/campaign/infrastructure/repositories/campaign-management-repository.js';
import * as campaignAssessmentParticipationRepository from '../../../src/prescription/campaign-participation/infrastructure/repositories/campaign-assessment-participation-repository.js';
import * as campaignAssessmentParticipationResultRepository from '../../../src/prescription/campaign-participation/infrastructure/repositories/campaign-assessment-participation-result-repository.js';
import * as campaignParticipationBCRepository from '../../../src/prescription/campaign-participation/infrastructure/repositories/campaign-participation-repository.js';
import * as campaignProfileRepository from '../../../src/prescription/campaign-participation/infrastructure/repositories/campaign-profile-repository.js';
import * as supOrganizationLearnerRepository from '../../../src/prescription/learner-management/infrastructure/repositories/sup-organization-learner-repository.js';
import * as organizationLearnerActivityRepository from '../../../src/prescription/organization-learner/infrastructure/repositories/organization-learner-activity-repository.js';
import * as activityAnswerRepository from '../../../src/school/infrastructure/repositories/activity-answer-repository.js';
import * as missionRepository from '../../../src/school/infrastructure/repositories/mission-repository.js';
import * as schoolRepository from '../../../src/school/infrastructure/repositories/school-repository.js';
import * as codeGenerator from '../../../src/shared/domain/services/code-generator.js';
import * as cryptoService from '../../../src/shared/domain/services/crypto-service.js';
import { tokenService } from '../../../src/shared/domain/services/token-service.js';
import * as adminMemberRepository from '../../../src/shared/infrastructure/repositories/admin-member-repository.js';
import * as answerRepository from '../../../src/shared/infrastructure/repositories/answer-repository.js';
import * as areaRepository from '../../../src/shared/infrastructure/repositories/area-repository.js';
import * as assessmentRepository from '../../../src/shared/infrastructure/repositories/assessment-repository.js';
import * as assessmentResultRepository from '../../../src/shared/infrastructure/repositories/assessment-result-repository.js';
import * as badgeRepository from '../../../src/shared/infrastructure/repositories/badge-repository.js';
import * as challengeRepository from '../../../src/shared/infrastructure/repositories/challenge-repository.js';
import * as competenceRepository from '../../../src/shared/infrastructure/repositories/competence-repository.js';
import * as organizationRepository from '../../../src/shared/infrastructure/repositories/organization-repository.js';
import * as targetProfileForAdminRepository from '../../../src/shared/infrastructure/repositories/target-profile-for-admin-repository.js';
import * as userLoginRepository from '../../../src/shared/infrastructure/repositories/user-login-repository.js';
import * as userRepository from '../../../src/shared/infrastructure/repositories/user-repository.js';
import * as dateUtils from '../../../src/shared/infrastructure/utils/date-utils.js';
import { injectDependencies } from '../../../src/shared/infrastructure/utils/dependency-injection.js';
import { importNamedExportsFromDirectory } from '../../../src/shared/infrastructure/utils/import-named-exports-from-directory.js';
import * as userOrgaSettingsRepository from '../../../src/shared/prescriber-management/infrastructure/repositories/user-orga-settings-repository.js';
import { config } from '../../config.js';
import * as algorithmDataFetcherService from '../../domain/services/algorithm-methods/data-fetcher.js';
import * as smartRandom from '../../domain/services/algorithm-methods/smart-random.js';
import * as authenticationSessionService from '../../domain/services/authentication/authentication-session-service.js';
import * as certificationBadgesService from '../../domain/services/certification-badges-service.js';
import * as certificationCandidatesOdsService from '../../domain/services/certification-candidates-ods-service.js';
import * as certificationCenterInvitationService from '../../domain/services/certification-center-invitation-service.js';
import * as certificationChallengesService from '../../domain/services/certification-challenges-service.js';
import * as improvementService from '../../domain/services/improvement-service.js';
import * as localeService from '../../domain/services/locale-service.js';
import * as mailService from '../../domain/services/mail-service.js';
import * as obfuscationService from '../../domain/services/obfuscation-service.js';
import * as passwordGenerator from '../../domain/services/password-generator.js';
import * as placementProfileService from '../../domain/services/placement-profile-service.js';
import * as resetPasswordService from '../../domain/services/reset-password-service.js';
import * as scoringCertificationService from '../../domain/services/scoring/scoring-certification-service.js';
import * as sessionPublicationService from '../../domain/services/session-publication-service.js';
import * as userService from '../../domain/services/user-service.js';
import * as verifyCertificateCodeService from '../../domain/services/verify-certificate-code-service.js';
import * as disabledPoleEmploiNotifier from '../../infrastructure/externals/pole-emploi/disabled-pole-emploi-notifier.js';
import * as poleEmploiNotifier from '../../infrastructure/externals/pole-emploi/pole-emploi-notifier.js';
import * as accountRecoveryDemandRepository from '../../infrastructure/repositories/account-recovery-demand-repository.js';
import * as attachableTargetProfileRepository from '../../infrastructure/repositories/attachable-target-profiles-repository.js';
import * as authenticationMethodRepository from '../../infrastructure/repositories/authentication-method-repository.js';
import * as badgeAcquisitionRepository from '../../infrastructure/repositories/badge-acquisition-repository.js';
import * as badgeForCalculationRepository from '../../infrastructure/repositories/badge-for-calculation-repository.js';
import * as campaignAnalysisRepository from '../../infrastructure/repositories/campaign-analysis-repository.js';
import * as campaignCollectiveResultRepository from '../../infrastructure/repositories/campaign-collective-result-repository.js';
import * as campaignParticipantRepository from '../../infrastructure/repositories/campaign-participant-repository.js';
import * as campaignParticipationOverviewRepository from '../../infrastructure/repositories/campaign-participation-overview-repository.js';
import * as campaignParticipationRepository from '../../infrastructure/repositories/campaign-participation-repository.js';
import { campaignParticipationResultRepository } from '../../infrastructure/repositories/campaign-participation-result-repository.js';
import { CampaignParticipationsStatsRepository as campaignParticipationsStatsRepository } from '../../infrastructure/repositories/campaign-participations-stats-repository.js';
import * as campaignRepository from '../../infrastructure/repositories/campaign-repository.js';
import * as campaignToJoinRepository from '../../infrastructure/repositories/campaign-to-join-repository.js';
import * as campaignAdministrationRepository from '../../infrastructure/repositories/campaigns-administration/campaign-repository.js';
import * as certifiableProfileForLearningContentRepository from '../../infrastructure/repositories/certifiable-profile-for-learning-content-repository.js';
import * as certificateRepository from '../../infrastructure/repositories/certificate-repository.js';
import * as certificationCenterForAdminRepository from '../../infrastructure/repositories/certification-center-for-admin-repository.js';
import * as certificationCenterInvitationRepository from '../../infrastructure/repositories/certification-center-invitation-repository.js';
import * as certificationCenterInvitedUserRepository from '../../infrastructure/repositories/certification-center-invited-user-repository.js';
import * as certificationCenterMembershipRepository from '../../infrastructure/repositories/certification-center-membership-repository.js';
import * as certificationLsRepository from '../../infrastructure/repositories/certification-livret-scolaire-repository.js';
import * as certificationPointOfContactRepository from '../../infrastructure/repositories/certification-point-of-contact-repository.js';
import * as certificationRepository from '../../infrastructure/repositories/certification-repository.js';
import * as certificationResultRepository from '../../infrastructure/repositories/certification-result-repository.js';
import * as cleaCertifiedCandidateRepository from '../../infrastructure/repositories/clea-certified-candidate-repository.js';
import * as competenceMarkRepository from '../../infrastructure/repositories/competence-mark-repository.js';
import * as competenceTreeRepository from '../../infrastructure/repositories/competence-tree-repository.js';
import * as complementaryCertificationCourseResultRepository from '../../infrastructure/repositories/complementary-certification-course-result-repository.js';
import * as complementaryCertificationHabilitationRepository from '../../infrastructure/repositories/complementary-certification-habilitation-repository.js';
import * as complementaryCertificationRepository from '../../infrastructure/repositories/complementary-certification-repository.js';
import * as countryRepository from '../../infrastructure/repositories/country-repository.js';
import * as courseRepository from '../../infrastructure/repositories/course-repository.js';
import * as dataProtectionOfficerRepository from '../../infrastructure/repositories/data-protection-officer-repository.js';
import * as divisionRepository from '../../infrastructure/repositories/division-repository.js';
import * as flashAssessmentResultRepository from '../../infrastructure/repositories/flash-assessment-result-repository.js';
import * as frameworkRepository from '../../infrastructure/repositories/framework-repository.js';
import * as groupRepository from '../../infrastructure/repositories/group-repository.js';
import { repositories } from '../../infrastructure/repositories/index.js';
import * as juryCertificationRepository from '../../infrastructure/repositories/jury-certification-repository.js';
import * as juryCertificationSummaryRepository from '../../infrastructure/repositories/jury-certification-summary-repository.js';
import * as knowledgeElementRepository from '../../infrastructure/repositories/knowledge-element-repository.js';
import * as learningContentRepository from '../../infrastructure/repositories/learning-content-repository.js';
import * as membershipRepository from '../../infrastructure/repositories/membership-repository.js';
import * as organizationInvitationRepository from '../../infrastructure/repositories/organization-invitation-repository.js';
import * as organizationInvitedUserRepository from '../../infrastructure/repositories/organization-invited-user-repository.js';
import * as organizationLearnerRepository from '../../infrastructure/repositories/organization-learner-repository.js';
import * as organizationMemberIdentityRepository from '../../infrastructure/repositories/organization-member-identity-repository.js';
import * as organizationTagRepository from '../../infrastructure/repositories/organization-tag-repository.js';
import * as organizationsToAttachToTargetProfileRepository from '../../infrastructure/repositories/organizations-to-attach-to-target-profile-repository.js';
import * as participantResultRepository from '../../infrastructure/repositories/participant-result-repository.js';
import { participantResultsSharedRepository } from '../../infrastructure/repositories/participant-results-shared-repository.js';
import * as participationsForUserManagementRepository from '../../infrastructure/repositories/participations-for-user-management-repository.js';
import * as poleEmploiSendingRepository from '../../infrastructure/repositories/pole-emploi-sending-repository.js';
import * as resetPasswordDemandRepository from '../../infrastructure/repositories/reset-password-demands-repository.js';
import * as scoCertificationCandidateRepository from '../../infrastructure/repositories/sco-certification-candidate-repository.js';
import * as sessionForSupervisingRepository from '../../infrastructure/repositories/sessions/session-for-supervising-repository.js';
import * as sessionJuryCommentRepository from '../../infrastructure/repositories/sessions/session-jury-comment-repository.js';
import * as sessionSummaryRepository from '../../infrastructure/repositories/sessions/session-summary-repository.js';
import * as skillRepository from '../../infrastructure/repositories/skill-repository.js';
import * as studentRepository from '../../infrastructure/repositories/student-repository.js';
import * as supervisorAccessRepository from '../../infrastructure/repositories/supervisor-access-repository.js';
import * as tagRepository from '../../infrastructure/repositories/tag-repository.js';
import * as targetProfileForUpdateRepository from '../../infrastructure/repositories/target-profile-for-update-repository.js';
import * as targetProfileRepository from '../../infrastructure/repositories/target-profile-repository.js';
import * as targetProfileShareRepository from '../../infrastructure/repositories/target-profile-share-repository.js';
import * as targetProfileSummaryForAdminRepository from '../../infrastructure/repositories/target-profile-summary-for-admin-repository.js';
import * as targetProfileTrainingRepository from '../../infrastructure/repositories/target-profile-training-repository.js';
import * as thematicRepository from '../../infrastructure/repositories/thematic-repository.js';
import * as tubeRepository from '../../infrastructure/repositories/tube-repository.js';
import * as stageCollectionRepository from '../../infrastructure/repositories/user-campaign-results/stage-collection-repository.js';
import * as userEmailRepository from '../../infrastructure/repositories/user-email-repository.js';
import * as userOrganizationsForAdminRepository from '../../infrastructure/repositories/user-organizations-for-admin-repository.js';
import * as userSavedTutorialRepository from '../../infrastructure/repositories/user-saved-tutorial-repository.js';
import * as userToCreateRepository from '../../infrastructure/repositories/user-to-create-repository.js';
import * as codeUtils from '../../infrastructure/utils/code-utils.js';
import * as writeCsvUtils from '../../infrastructure/utils/csv/write-csv-utils.js';
import * as writeOdsUtils from '../../infrastructure/utils/ods/write-ods-utils.js';
import { oidcAuthenticationServiceRegistry as authenticationServiceRegistry } from '../services/authentication/authentication-service-registry.js';
import * as learningContentConversionService from '../services/learning-content/learning-content-conversion-service.js';
import * as organizationInvitationService from '../services/organization-invitation-service.js';
import * as scoAccountRecoveryService from '../services/sco-account-recovery-service.js';
import * as userReconciliationService from '../services/user-reconciliation-service.js';
import * as organizationCreationValidator from '../validators/organization-creation-validator.js';
import * as organizationValidator from '../validators/organization-with-tags-and-target-profiles-script.js';
import * as passwordValidator from '../validators/password-validator.js';
import * as userValidator from '../validators/user-validator.js';
import { findTargetProfileOrganizations as findPaginatedFilteredTargetProfileOrganizations } from './find-paginated-filtered-target-profile-organizations.js';

function requirePoleEmploiNotifier() {
  if (config.poleEmploi.pushEnabled) {
    return poleEmploiNotifier;
  } else {
    return disabledPoleEmploiNotifier;
  }
}

/**
 * Using {@link https://jsdoc.app/tags-type "Closure Compiler's syntax"} to document injected dependencies
 *
 * @typedef {certificationCenterRepository} CertificationCenterRepository
 * @typedef {certificationRepository} CertificationRepository
 * @typedef {finalizedSessionRepository} FinalizedSessionRepository
 * @typedef {mailService} MailService
 * @typedef {sessionPublicationService} SessionPublicationService
 * @typedef {sessionRepository} SessionRepository
 */

const dependencies = {
  accountRecoveryDemandRepository,
  activityAnswerRepository,
  adminMemberRepository,
  algorithmDataFetcherService,
  answerRepository,
  areaRepository,
  assessmentRepository,
  assessmentResultRepository,
  attachableTargetProfileRepository,
  authenticationMethodRepository,
  authenticationServiceRegistry,
  authenticationSessionService,
  badgeAcquisitionRepository,
  badgeForCalculationRepository,
  badgeRepository,
  campaignAdministrationRepository,
  campaignAnalysisRepository,
  campaignAssessmentParticipationRepository,
  campaignAssessmentParticipationResultRepository,
  campaignCollectiveResultRepository,
  campaignManagementRepository,
  campaignParticipantRepository,
  campaignParticipationBCRepository,
  campaignParticipationOverviewRepository,
  campaignParticipationRepository,
  campaignParticipationResultRepository,
  campaignParticipationsStatsRepository,
  campaignProfileRepository,
  campaignRepository,
  campaignToJoinRepository,
  certifiableProfileForLearningContentRepository,
  certificateRepository,
  certificationAssessmentRepository,
  certificationBadgesService,
  certificationCandidateForSupervisingRepository,
  certificationCandidateRepository,
  certificationCandidatesOdsService,
  certificationCenterForAdminRepository,
  certificationCenterInvitationRepository,
  certificationCenterInvitationService,
  certificationCenterInvitedUserRepository,
  certificationCenterMembershipRepository,
  certificationCenterRepository,
  certificationChallengeLiveAlertRepository,
  certificationChallengeRepository,
  certificationChallengesService,
  certificationCourseRepository,
  certificationCpfCityRepository,
  certificationCpfCountryRepository,
  certificationCpfService,
  certificationIssueReportRepository,
  certificationLsRepository,
  certificationOfficerRepository,
  certificationPointOfContactRepository,
  certificationRepository,
  certificationResultRepository,
  challengeRepository,
  cleaCertifiedCandidateRepository,
  codeGenerator,
  codeUtils,
  competenceEvaluationRepository,
  competenceMarkRepository,
  competenceRepository,
  competenceTreeRepository,
  complementaryCertificationCourseResultRepository,
  complementaryCertificationCourseRepository,
  complementaryCertificationHabilitationRepository,
  complementaryCertificationRepository,
  config,
  correctionRepository: repositories.correctionRepository,
  countryRepository,
  courseRepository,
  dataProtectionOfficerRepository,
  dateUtils,
  divisionRepository,
  cryptoService,
  finalizedSessionRepository,
  flashAlgorithmConfigurationRepository,
  flashAlgorithmService,
  flashAssessmentResultRepository,
  frameworkRepository,
  getCompetenceLevel,
  groupRepository,
  improvementService,
  issueReportCategoryRepository,
  juryCertificationRepository,
  juryCertificationSummaryRepository,
  jurySessionRepository,
  knowledgeElementRepository,
  learningContentConversionService,
  learningContentRepository,
  localeService,
  mailService,
  membershipRepository,
  missionRepository,
  obfuscationService,
  organizationCreationValidator,
  organizationForAdminRepository,
  organizationInvitationRepository,
  organizationInvitationService,
  organizationInvitedUserRepository,
  organizationLearnerActivityRepository,
  organizationLearnerRepository,
  organizationMemberIdentityRepository,
  organizationRepository,
  organizationsToAttachToTargetProfileRepository,
  organizationTagRepository,
  organizationValidator,
  participantResultRepository,
  participantResultsSharedRepository,
  participationsForUserManagementRepository,
  passwordGenerator,
  passwordValidator,
  pickChallengeService,
  pixAuthenticationService,
  placementProfileService,
  poleEmploiNotifier: requirePoleEmploiNotifier(),
  poleEmploiSendingRepository,
  refreshTokenService,
  resetPasswordDemandRepository,
  resetPasswordService,
  schoolRepository,
  scoAccountRecoveryService,
  scoCertificationCandidateRepository,
  scorecardService,
  scoringCertificationService,
  sessionCodeService,
  sessionForSupervisingRepository,
  sessionJuryCommentRepository,
  sessionPublicationService,
  sessionRepository,
  sessionSummaryRepository,
  skillRepository,
  smartRandom,
  stageAndStageAcquisitionComparisonService,
  stageCollectionForTargetProfileRepository,
  stageCollectionRepository,
  stageRepository,
  stageAcquisitionRepository,
  studentRepository,
  supervisorAccessRepository,
  supOrganizationLearnerRepository,
  tagRepository,
  targetProfileForAdminRepository,
  targetProfileForUpdateRepository,
  targetProfileRepository,
  targetProfileShareRepository,
  targetProfileSummaryForAdminRepository,
  targetProfileTrainingRepository,
  thematicRepository,
  tokenService,
  trainingRepository: repositories.trainingRepository,
  trainingTriggerRepository: repositories.trainingTriggerRepository,
  tubeRepository,
  tutorialEvaluationRepository: repositories.tutorialEvaluationRepository,
  tutorialRepository: repositories.tutorialRepository,
  userEmailRepository,
  userLoginRepository,
  userOrganizationsForAdminRepository,
  userOrgaSettingsRepository,
  userRecommendedTrainingRepository: repositories.userRecommendedTrainingRepository,
  userReconciliationService,
  userRepository,
  userSavedTutorialRepository,
  userService,
  userToCreateRepository,
  userValidator,
  verifyCertificateCodeService,
  writeCsvUtils,
  writeOdsUtils,
};

const path = dirname(fileURLToPath(import.meta.url));

const usecasesWithoutInjectedDependencies = {
  ...(await importNamedExportsFromDirectory({ path: join(path, './'), ignoredFileNames: ['index.js'] })),
  ...(await importNamedExportsFromDirectory({ path: join(path, './account-recovery') })),
  ...(await importNamedExportsFromDirectory({ path: join(path, './authentication') })),
  ...(await importNamedExportsFromDirectory({ path: join(path, './campaigns-administration') })),
  ...(await importNamedExportsFromDirectory({ path: join(path, './certificate') })),
  ...(await importNamedExportsFromDirectory({ path: join(path, './organizations-administration') })),
  ...(await importNamedExportsFromDirectory({ path: join(path, './stages') })),
  ...(await importNamedExportsFromDirectory({ path: join(path, './target-profile-management') })),
  findPaginatedFilteredTargetProfileOrganizations,
  getNextChallengeForV2Certification,
  getNextChallengeForV3Certification,
  endAssessmentBySupervisor,
};

const usecases = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);

export { usecases };
