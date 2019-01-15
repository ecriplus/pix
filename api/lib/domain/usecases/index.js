const _ = require('lodash');
const injectDefaults = require('../../infrastructure/utils/inject-defaults');

const dependencies = {
  answerRepository: require('../../infrastructure/repositories/answer-repository'),
  assessmentRepository: require('../../infrastructure/repositories/assessment-repository'),
  assessmentResultRepository: require('../../infrastructure/repositories/assessment-result-repository'),
  campaignParticipationRepository: require('../../infrastructure/repositories/campaign-participation-repository'),
  campaignRepository: require('../../infrastructure/repositories/campaign-repository'),
  certificationChallengeRepository: require('../../infrastructure/repositories/certification-challenge-repository'),
  certificationCourseRepository: require('../../infrastructure/repositories/certification-course-repository'),
  certificationRepository: require('../../infrastructure/repositories/certification-repository'),
  challengeRepository: require('../../infrastructure/repositories/challenge-repository'),
  competenceMarkRepository: require('../../infrastructure/repositories/competence-mark-repository'),
  competenceRepository: require('../../infrastructure/repositories/competence-repository'),
  competenceTreeRepository: require('../../infrastructure/repositories/competence-tree-repository'),
  correctionRepository: require('../../infrastructure/repositories/correction-repository'),
  courseRepository: require('../../infrastructure/repositories/course-repository'),
  encryptionService: require('../../domain/services/encryption-service'),
  mailService: require('../../domain/services/mail-service'),
  organizationService: require('../../domain/services/organization-service'),
  organizationRepository: require('../../infrastructure/repositories/organization-repository'),
  resetPasswordService: require('../../domain/services/reset-password-service'),
  reCaptchaValidator: require('../../infrastructure/validators/grecaptcha-validator'),
  scoringService: require('../../domain/services/scoring/scoring-service'),
  settings: require('../../settings'),
  skillRepository: require('../../infrastructure/repositories/skill-repository'),
  skillsService: require('../../domain/services/skills-service'),
  smartPlacementAssessmentRepository: require('../../infrastructure/repositories/smart-placement-assessment-repository'),
  smartPlacementKnowledgeElementRepository: require('../../infrastructure/repositories/smart-placement-knowledge-element-repository'),
  targetProfileRepository: require('../../infrastructure/repositories/target-profile-repository'),
  tokenService: require('../../domain/services/token-service'),
  userRepository: require('../../infrastructure/repositories/user-repository'),
  snapshotsCsvConverter: require('../../infrastructure/converter/snapshots-csv-converter'),
  snapshotRepository: require('../../infrastructure/repositories/snapshot-repository'),
};

function injectDependencies(usecases) {
  return _.mapValues(usecases, _.partial(injectDefaults, dependencies));
}

module.exports = injectDependencies({
  acceptPixCertifTermsOfService: require('./accept-pix-certif-terms-of-service'),
  acceptPixOrgaTermsOfService: require('./accept-pix-orga-terms-of-service'),
  authenticateUser: require('./authenticate-user'),
  correctAnswerThenUpdateAssessment: require('./correct-answer-then-update-assessment'),
  createCampaign: require('./create-campaign'),
  createAssessmentResultForCompletedAssessment: require('./create-assessment-result-for-completed-assessment'),
  createAssessmentForCampaign: require('./create-assessment-for-campaign'),
  createOrganization: require('./create-organization.js'),
  createUser: require('./create-user'),
  findCampaignParticipationsByAssessmentId: require('./find-campaign-participations-by-assessmentId'),
  findCertificationAssessments: require('./find-certification-assessments'),
  findCompletedUserCertifications: require('./find-completed-user-certifications'),
  findPlacementAssessments: require('./find-placement-assessments'),
  findSmartPlacementAssessments: require('./find-smart-placement-assessments'),
  findSnapshots: require('./find-snapshots.js'),
  findUsers: require('./find-users.js'),
  findOrganizations: require('./find-organizations'),
  getAssessment: require('./get-assessment'),
  getCampaign: require('./get-campaign'),
  getCampaignByCode: require('./get-campaign-by-code'),
  getCorrectionForAnswerWhenAssessmentEnded: require('./get-correction-for-answer-when-assessment-ended'),
  getNextChallengeForCertification: require('./get-next-challenge-for-certification'),
  getNextChallengeForDemo: require('./get-next-challenge-for-demo'),
  getNextChallengeForPlacement: require('./get-next-challenge-for-placement'),
  getNextChallengeForPreview: require('./get-next-challenge-for-preview'),
  getNextChallengeForSmartPlacement: require('./get-next-challenge-for-smart-placement'),
  getOrganizationCampaigns: require('./get-organization-campaigns'),
  getOrganizationDetails: require('./get-organization-details.js'),
  getResultsCampaignInCSVFormat: require('./get-results-campaign-in-csv-format'),
  getOrCreateSamlUser: require('./get-or-create-saml-user'),
  getSkillReview: require('./get-skill-review'),
  getUserCampaignParticipations: require('./get-user-campaign-participations'),
  getUserCertification: require('./get-user-certification'),
  getUserCertificationWithResultTree: require('./get-user-certification-with-result-tree'),
  getUserWithMemberships: require('./get-user-with-memberships'),
  preloadCacheEntries: require('./preload-cache-entries'),
  reloadCacheEntry: require('./reload-cache-entry'),
  removeAllCacheEntries: require('./remove-all-cache-entries'),
  shareCampaignResult: require('./share-campaign-result'),
  startCampaignParticipation: require('./start-campaign-participation'),
  startPlacementAssessment: require('./start-placement-assessment'),
  updateCampaign: require('./update-campaign'),
  updateCertification: require('./update-certification'),
  updateOrganizationInformation: require('./update-organization-information'),
  updateUserPassword: require('./update-user-password'),
  writeOrganizationSharedProfilesAsCsvToStream: require('./write-organization-shared-profiles-as-csv-to-stream'),
});
