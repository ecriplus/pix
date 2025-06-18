const TABLE_NAME = 'certification-frameworks-challenges';
const OLD_COLUMN_NAME = 'complementaryCertificationId';
const NEW_COLUMN_NAME = 'complementaryCertificationKey';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  return knex.schema.table(TABLE_NAME, (table) => {
    table.string(NEW_COLUMN_NAME);
    table.foreign(NEW_COLUMN_NAME).references('complementary-certifications.key');

    table.dropColumn(OLD_COLUMN_NAME);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.integer(OLD_COLUMN_NAME).unsigned();
    table.foreign(OLD_COLUMN_NAME).references('complementary-certifications.id');

    table.dropColumn(NEW_COLUMN_NAME);
  });
};

export { down, up };
