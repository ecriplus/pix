const TABLE_NAME = 'organization_learner_passage_participations';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.comment(
      'this table contains specific data related to passages for organization_learner_participations table',
    );
    table.increments('id').primary().notNullable();
    table.string('moduleId').notNullable();
    table
      .integer('organizationLearnerParticipationId')
      .references('organization_learner_participations.id')
      .index()
      .notNullable();
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
