import { DomainTransaction } from '../../domain/DomainTransaction.js';

export const isCodeAvailable = async function (code) {
  const knexConn = DomainTransaction.getConnection();
  const isCodeExistsInCampaigns = await knexConn('campaigns').first('id').where({ code });
  if (isCodeExistsInCampaigns) {
    return false;
  }
  const isCodeExistsInCombinedCourse = await knexConn('combined_courses').first('id').where({ code });
  return !isCodeExistsInCombinedCourse;
};
