export const replications = [
  {
    name: 'sco_certification_results',
    before: async ({ datamartKnex }) => {
      await datamartKnex('sco_certification_results').truncate();
    },
    from: ({ datawarehouseKnex }) => {
      return datawarehouseKnex('data_export_parcoursup_certif_result').select(
        'national_student_id',
        'organization_uai',
        'last_name',
        'first_name',
        'birthdate',
        'status',
        'pix_score',
        'certification_date',
        'competence_level',
        'competence_name',
        'competence_code',
        'area_name',
        'certification_courses_id',
      );
    },
    to: ({ datamartKnex }, chunk) => {
      return datamartKnex('sco_certification_results').insert(chunk);
    },
  },
  {
    name: 'certification_results',
    before: async ({ datamartKnex }) => {
      await datamartKnex('certification_results').truncate();
    },
    from: ({ datawarehouseKnex }) => {
      return datawarehouseKnex('data_export_parcoursup_certif_result_code_validation').select(
        'certification_code_verification',
        'last_name',
        'first_name',
        'birthdate',
        'status',
        'pix_score',
        'certification_date',
        'competence_level',
        'competence_name',
        'competence_code',
        'area_name',
        'certification_courses_id',
      );
    },
    to: ({ datamartKnex }, chunk) => {
      return datamartKnex('certification_results').insert(chunk);
    },
  },
  {
    name: 'organizations_cover_rates',
    before: async ({ datamartKnex }) => {
      await datamartKnex('organizations_cover_rates').truncate();
    },
    from: ({ datawarehouseKnex }) => {
      return datawarehouseKnex('data_pro_campaigns_kpi_aggregated').select(
        'tag_name',
        'domain_name',
        'competence_code',
        'competence_name',
        'campaign_id',
        'target_profile_id',
        'orga_id',
        'tube_id',
        'tube_practical_title',
        'extraction_date',
        'max_level',
        'sum_user_max_level',
        'nb_user',
        'nb_tubes_in_competence',
      );
    },
    to: ({ datamartKnex }, chunk) => {
      return datamartKnex('organizations_cover_rates').insert(chunk);
    },
  },
  {
    name: 'target_profiles_course_duration',
    before: async ({ datamartKnex }) => {
      await datamartKnex('target_profiles_course_duration').truncate();
    },
    from: ({ datawarehouseKnex }) => {
      return datawarehouseKnex('data_target_profiles_course_duration').select(
        'targetProfileId',
        'median',
        'quantile_75',
        'quantile_95',
      );
    },
    to: ({ datamartKnex }, chunk) => {
      return datamartKnex('target_profiles_course_duration').insert(chunk);
    },
  },
];

export function getByName(name, dependencies = { replications }) {
  return dependencies.replications.find((replication) => replication.name === name);
}
