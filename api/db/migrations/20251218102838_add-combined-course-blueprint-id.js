const TABLE_NAME = 'combined_courses';
const COLUMN_NAME = 'combinedCourseBlueprintId';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table
      .integer(COLUMN_NAME)
      .nullable()
      .references('combined_course_blueprints.id')
      .comment(
        "Combined course blueprint used to create this combined course) - see 'combined_course_blueprints' table",
      );
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.dropColumn(COLUMN_NAME);
  });
};

export { down, up };
