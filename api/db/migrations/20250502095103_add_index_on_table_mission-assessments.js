const indexesToAdd = [{ tableName: 'mission-assessments', index: ['organizationLearnerId'] }];

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
