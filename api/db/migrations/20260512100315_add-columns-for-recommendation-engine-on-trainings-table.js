const TABLE_NAME = 'trainings';
const DELIVERY_MODE_COLUMN_NAME = 'deliveryMode';
const PROGRAM_COLUMN_NAME = 'program';
const REGISTRATION_REQUIRED_COLUMN_NAME = 'registrationRequired';
const OBJECTIVES_COLUMN_NAME = 'objectives';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.string(DELIVERY_MODE_COLUMN_NAME).comment('geographical arrangements for the training course');
    table.text(PROGRAM_COLUMN_NAME).comment('training program');
    table
      .boolean(REGISTRATION_REQUIRED_COLUMN_NAME)
      .defaultTo(false)
      .comment('registration requirement for attending the training course');
    table
      .specificType(OBJECTIVES_COLUMN_NAME, 'text[]')
      .defaultTo('{}')
      .comment('List of objectives to be achieved during the training course');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.dropColumn(DELIVERY_MODE_COLUMN_NAME);
    table.dropColumn(PROGRAM_COLUMN_NAME);
    table.dropColumn(REGISTRATION_REQUIRED_COLUMN_NAME);
    table.dropColumn(OBJECTIVES_COLUMN_NAME);
  });
};

export { down, up };
