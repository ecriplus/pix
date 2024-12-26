import * as campaignParticipationService from '../../../../../lib/domain/services/campaign-participation-service.js';
import { CampaignAssessmentResultLine } from '../../infrastructure/exports/campaigns/campaign-assessment-result-line.js';

export { createOneCsvLine };

function createOneCsvLine({
  organization,
  campaign,
  additionalHeaders,
  campaignParticipationInfo,
  targetProfile,
  learningContent,
  stageCollection,
  participantKnowledgeElementsByCompetenceId,
  acquiredBadges,
  translate,
}) {
  const line = new CampaignAssessmentResultLine({
    organization,
    campaign,
    campaignParticipationInfo,
    targetProfile,
    additionalHeaders,
    learningContent,
    stageCollection,
    participantKnowledgeElementsByCompetenceId,
    acquiredBadges,
    campaignParticipationService,
    translate,
  });

  return line.toCsvLine();
}
