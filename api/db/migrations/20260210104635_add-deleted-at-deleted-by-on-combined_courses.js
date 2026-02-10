const TABLE_NAME = 'combined_courses';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.dateTime('deletedAt').defaultTo(null).comment('Deletion date of combined course');
    table
      .bigInteger('deletedBy')
      .references('users.id')
      .defaultTo(null)
      .comment('Id of the user triggering the deletion');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.dropColumn('deletedAt');
    table.dropColumn('deletedBy');
  });
};

export { down, up };
