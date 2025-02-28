export const replications = [
  {
    name: 'sco_certification_results',
    before: async ({ datamartKnex }) => {
      await datamartKnex('sco_certification_results').delete();
    },
    from: ({ datawarehouseKnex }) => {
      return datawarehouseKnex('data_export_parcoursup_certif_result').select('*');
    },
    to: ({ datamartKnex }, chunk) => {
      return datamartKnex('sco_certification_results').insert(chunk);
    },
  },
  {
    name: 'data_export_parcoursup_certif_result',
    before: async ({ datamartKnex }) => {
      await datamartKnex('data_export_parcoursup_certif_result').delete();
    },
    from: ({ datawarehouseKnex }) => {
      return datawarehouseKnex('data_export_parcoursup_certif_result').select('*');
    },
    to: ({ datamartKnex }, chunk) => {
      return datamartKnex('data_export_parcoursup_certif_result').insert(chunk);
    },
  },
  {
    name: 'certification_results',
    before: async ({ datamartKnex }) => {
      await datamartKnex('certification_results').delete();
    },
    from: ({ datawarehouseKnex }) => {
      return datawarehouseKnex('data_export_parcoursup_certif_result_code_validation').select('*');
    },
    to: ({ datamartKnex }, chunk) => {
      return datamartKnex('certification_results').insert(chunk);
    },
  },
  {
    name: 'data_export_parcoursup_certif_result_code_validation',
    before: async ({ datamartKnex }) => {
      await datamartKnex('data_export_parcoursup_certif_result_code_validation').delete();
    },
    from: ({ datawarehouseKnex }) => {
      return datawarehouseKnex('data_export_parcoursup_certif_result_code_validation').select('*');
    },
    to: ({ datamartKnex }, chunk) => {
      return datamartKnex('data_export_parcoursup_certif_result_code_validation').insert(chunk);
    },
  },
];

export function getByName(name, dependencies = { replications }) {
  return dependencies.replications.find((replication) => replication.name === name);
}
