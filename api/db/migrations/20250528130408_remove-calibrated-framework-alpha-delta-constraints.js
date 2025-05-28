const TABLE_NAME = 'certification-frameworks-challenges';

const up = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table.float('alpha').nullable().alter();
    table.float('delta').nullable().alter();

    table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
  });
};

const down = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table.float('alpha').notNullable().alter();
    table.float('delta').notNullable().alter();

    table.dropColumn('createdAt');
  });
};

export { down, up };
