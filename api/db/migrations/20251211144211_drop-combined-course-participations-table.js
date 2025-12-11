const TABLE_NAME = 'combined_course_participations';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.dropTable(TABLE_NAME);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (t) {
    t.increments().primary();
    t.integer('organizationLearnerId').unsigned().references('organization-learners.id').index();
    t.integer('questId').unsigned().references('quests.id').index();
    t.enum('status', ['started', 'completed']).defaultTo('started');
    t.timestamps(true, true, true);
    t.integer('combinedCourseId').defaultTo(null).index().references('combined_courses.id');
    t.integer('organizationLearnerParticipationId')
      .defaultTo(null)
      .index()
      .references('organization_learner_participations.id');
  });
};

export { down, up };
