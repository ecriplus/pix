const TABLE_NAME = 'target-profiles';

const up = function (knex) {
  return knex.schema.alterTable(TABLE_NAME, function (table) {
    table.integer('ownerOrganizationId').nullable().alter();
  });
};

const down = function (knex) {
  return knex.schema.alterTable(TABLE_NAME, function (table) {
    table.integer('ownerOrganizationId').notNullable().alter();
  });
};

export { down, up };
