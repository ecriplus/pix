import { CampaignParticipationStatuses } from '../../src/prescription/shared/domain/constants.js';

const up = async function (knex) {
  await knex('campaign-participations')
    .update({ sharedAt: null })
    .where({ status: CampaignParticipationStatuses.TO_SHARE })
    .whereNotNull('sharedAt');
};

const down = function () {
  return;
};

export { down, up };
