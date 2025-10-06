const TABLE_NAME = 'combined_course_participations';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.integer('combinedCourseId').defaultTo(null).index().references('combined_courses.id');
    table
      .integer('organizationLearnerParticipationId')
      .defaultTo(null)
      .index()
      .references('organization_learner_participations.id');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.dropColumn('combinedCourseId');
    table.dropColumn('organizationLearnerParticipationId');
  });
};

export { down, up };
