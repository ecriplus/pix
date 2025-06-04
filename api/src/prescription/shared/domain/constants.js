const CampaignParticipationStatuses = {
  STARTED: 'STARTED',
  TO_SHARE: 'TO_SHARE',
  SHARED: 'SHARED',
};

const CampaignTypes = {
  ASSESSMENT: 'ASSESSMENT',
  EXAM: 'EXAM',
  PROFILES_COLLECTION: 'PROFILES_COLLECTION',
};

const CampaignExternalIdTypes = {
  STRING: 'STRING',
  EMAIL: 'EMAIL',
};

const CampaignParticipationLoggerContext = {
  DELETION: 'CAMPAIGN_PARTICIPATION_DELETION',
  ANONYMIZATION: 'CAMPAIGN_PARTICIPATION_ANONYMIZATION',
};

export { CampaignExternalIdTypes, CampaignParticipationLoggerContext, CampaignParticipationStatuses, CampaignTypes };
