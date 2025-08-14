import { knex } from '../../../../db/knex-database-connection.js';

export const isCodeAvailable = async function (code) {
  const isCodeExistsInCampaigns = await knex('campaigns').first('id').where({ code });
  if (isCodeExistsInCampaigns) {
    return false;
  }
  const isCodeExistsInCombinedCourse = await knex('quests').first('id').where({ code });
  return !isCodeExistsInCombinedCourse;
};
