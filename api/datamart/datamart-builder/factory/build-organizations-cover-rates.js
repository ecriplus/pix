import { datamartBuffer } from '../datamart-buffer.js';

const buildOrganizationsCoverRates = function ({
  tag_name,
  domain_name,
  competence_code,
  competence_name,
  campaign_id,
  target_profile_id,
  orga_id,
  tube_id,
  tube_practical_title,
  extraction_date,
  max_level,
  sum_user_max_level,
  nb_user,
  nb_tubes_in_competence,
} = {}) {
  const values = {
    tag_name,
    domain_name,
    competence_code,
    competence_name,
    campaign_id,
    target_profile_id,
    orga_id,
    tube_id,
    tube_practical_title,
    extraction_date,
    max_level,
    sum_user_max_level,
    nb_user,
    nb_tubes_in_competence,
  };

  datamartBuffer.pushInsertable({
    tableName: 'organizations_cover_rates',
    values,
  });
};

export { buildOrganizationsCoverRates };
