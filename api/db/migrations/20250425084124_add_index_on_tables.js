const indexesToAdd = [
  { tableName: 'organizations', index: ['name'] },
  { tableName: 'mission-assessments', index: ['missionId'] },
  { tableName: 'activity-answers', index: ['activityId'] },
  { tableName: 'certification-cpf-cities', index: ['INSEECode'] },
  { tableName: 'certification-cpf-cities', index: ['postalCode'] },
  { tableName: 'certification-center-memberships', index: ['certificationCenterId'] },
];

const up = async function (knex) {
  for (const { tableName, index } of indexesToAdd) {
    await knex.schema.table(tableName, function (table) {
      table.index(index);
    });
  }
};

const down = async function (knex) {
  for (const { tableName, index } of indexesToAdd) {
    await knex.schema.table(tableName, function (table) {
      table.dropIndex(index);
    });
  }
};
export { down, up };
