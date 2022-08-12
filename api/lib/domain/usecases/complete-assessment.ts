// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
const AssessmentCompleted = require('../events/AssessmentCompleted');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../models/CampaignParticipationStatuses');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyRat... Remove this comment to see the full error message
const { AlreadyRatedAssessmentError } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function completeAssessment({
  assessmentId,
  domainTransaction,
  campaignParticipationRepository,
  assessmentRepository
}: $TSFixMe) {
  const assessment = await assessmentRepository.get(assessmentId, domainTransaction);

  if (assessment.isCompleted()) {
    throw new AlreadyRatedAssessmentError();
  }

  await assessmentRepository.completeByAssessmentId(assessmentId, domainTransaction);

  if (assessment.campaignParticipationId) {
    const { TO_SHARE } = CampaignParticipationStatuses;

    await campaignParticipationRepository.update(
      { id: assessment.campaignParticipationId, status: TO_SHARE },
      domainTransaction
    );
  }

  return new AssessmentCompleted({
    assessmentId: assessment.id,
    userId: assessment.userId,
    campaignParticipationId: assessment.campaignParticipationId,
    certificationCourseId: assessment.certificationCourseId,
  });
};
