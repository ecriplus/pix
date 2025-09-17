const FORMER_TABLE_NAME = 'pix-teams';
const NEW_TABLE_NAME = 'administration_teams';
const FORMER_COLUMN_NAME = 'pixTeamId';
const NEW_COLUMN_NAME = 'administrationTeamId';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.alterTable('organizations', async (table) => {
    table.dropColumn(FORMER_COLUMN_NAME);
  });

  await knex.schema.dropTable(FORMER_TABLE_NAME);

  await knex.schema.createTable(NEW_TABLE_NAME, function (table) {
    table.increments('id').primary();
    table.string('name').notNullable().comment('Team name');
    table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    table.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.alterTable('organizations', async (table) => {
    table
      .integer(NEW_COLUMN_NAME)
      .unsigned()
      .index()
      .references(`${NEW_TABLE_NAME}.id`)
      .comment("Reference to the organization's administration team");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.alterTable('organizations', async (table) => {
    table.dropColumn(NEW_COLUMN_NAME);
  });

  await knex.schema.dropTable(NEW_TABLE_NAME);

  await knex.schema.createTable(FORMER_TABLE_NAME, function (table) {
    table.increments('id').primary();
    table.string('name').notNullable().comment('Team name');
    table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    table.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.alterTable('organizations', async (table) => {
    table
      .integer(FORMER_COLUMN_NAME)
      .unsigned()
      .index()
      .references(`${FORMER_TABLE_NAME}.id`)
      .comment("Reference to the organization's pix team");
  });
};

export { down, up };
