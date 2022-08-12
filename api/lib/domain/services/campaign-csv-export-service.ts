// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
const CampaignAssessmentCsvLine = require('../../infrastructure/utils/CampaignAssessmentCsvLine');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'csvSeriali... Remove this comment to see the full error message
const csvSerializer = require('../../infrastructure/serializers/csv/csv-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignPa... Remove this comment to see the full error message
const campaignParticipationService = require('../services/campaign-participation-service');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  createOneCsvLine,
};

function createOneCsvLine({
  organization,
  campaign,
  campaignParticipationInfo,
  targetProfileWithLearningContent,
  participantKnowledgeElementsByCompetenceId,
  acquiredBadges,
  translate
}: $TSFixMe) {
  const line = new CampaignAssessmentCsvLine({
    organization,
    campaign,
    campaignParticipationInfo,
    targetProfileWithLearningContent,
    participantKnowledgeElementsByCompetenceId,
    acquiredBadges,
    campaignParticipationService,
    translate,
  });

  return csvSerializer.serializeLine(line.toCsvLine());
}
