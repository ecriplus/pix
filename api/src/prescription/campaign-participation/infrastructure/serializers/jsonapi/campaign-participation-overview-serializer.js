import jsonapiSerializer from 'jsonapi-serializer';

import { CampaignParticipationStatuses } from '../../../../shared/domain/constants.js';

const { Serializer } = jsonapiSerializer;
const { TO_SHARE, STARTED } = CampaignParticipationStatuses;

const serialize = function (campaignParticipationOverviews) {
  return new Serializer('campaign-participation-overview', {
    attributes: [
      'isShared',
      'sharedAt',
      'createdAt',
      'organizationName',
      'status',
      'campaignCode',
      'campaignTitle',
      'disabledAt',
      'masteryRate',
      'validatedStagesCount',
      'totalStagesCount',
      'canRetry',
      'campaignType',
    ],
    transform(record) {
      const transformed = { ...record };
      // TODO: remove this mapping once the status is migrated
      if (transformed.status === TO_SHARE) {
        transformed.status = STARTED;
      }
      return transformed;
    },
  }).serialize(campaignParticipationOverviews);
};

export { serialize };
