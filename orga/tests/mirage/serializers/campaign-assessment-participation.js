import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  links(campaignAssessmentParticipation) {
    return {
      campaignAssessmentParticipationResult: {
        related: `/api/campaigns/${campaignAssessmentParticipation.campaignId}/assessment-participations/${campaignAssessmentParticipation.id}/results`,
      },
    };
  },
});
