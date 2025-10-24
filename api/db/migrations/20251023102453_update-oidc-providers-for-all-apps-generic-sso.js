const TABLE_NAME = 'oidc-providers';
const APPLICATION_COLUMN_NAME = 'application';
const CONNECTION_METHOD_CODE_COLUMN_NAME = 'connectionMethodCode';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table
      .string(APPLICATION_COLUMN_NAME)
      .defaultTo(null)
      .comment('Name of the application for which this client configuration is for');
  });

  await knex.schema.table(TABLE_NAME, function (table) {
    table
      .string(CONNECTION_METHOD_CODE_COLUMN_NAME)
      .defaultTo(null)
      .comment(
        'Optional identity provider code to group the corresponding authentication method to another authentication method',
      );
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.dropColumn(APPLICATION_COLUMN_NAME);
    table.dropColumn(CONNECTION_METHOD_CODE_COLUMN_NAME);
  });
};

export { down, up };
