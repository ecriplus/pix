const TABLE_NAME = 'combined_course_blueprint_shares';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.increments('id').primary().comment('Combined course blueprint share identifier');
    table
      .integer('organizationId')
      .notNullable()
      .references('organizations.id')
      .comment("Organization id - see 'organizations' table");
    table
      .integer('combinedCourseBlueprintId')
      .notNullable()
      .references('combined_course_blueprints.id')
      .comment("CombinedCourseBlueprint id - see 'combined_course_blueprints' table");
    table.unique(['organizationId', 'combinedCourseBlueprintId']);
    table.comment('This table references which organization have access to which combined course blueprint');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  return knex.schema.dropTable(TABLE_NAME);
};

export { down, up };
