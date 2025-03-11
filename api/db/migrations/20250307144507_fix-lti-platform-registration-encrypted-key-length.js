const TABLE_NAME = 'lti_platform_registrations';
const COLUMN_NAME = 'encryptedPrivateKey';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table.text(COLUMN_NAME).alter({ alterNullable: false, alterType: true });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table.string(COLUMN_NAME).alter({ alterNullable: false, alterType: true });
  });
};

export { down, up };
