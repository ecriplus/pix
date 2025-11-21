const TABLE_NAME = 'certification_sco_blocked_access_dates';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table
      .string('scoOrganizationTagName', 255)
      .primary()
      .notNullable()
      .comment('Type of school organization affected by the reopening of their access');

    table
      .timestamp('reopeningDate')
      .notNullable()
      .comment('Date of reopening of school organizations access to Pix Certif');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.dropTable(TABLE_NAME);
};

export { down, up };
