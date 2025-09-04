// Remove obsolete certification configuration tables
// These tables were consolidated into the new `certification-configurations` table
// in migration 20250807134527_copy-flash-configurations-to-new-table.js
// All data has been migrated and these tables are now unused.

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.dropTable('certification-scoring-configurations');
  await knex.schema.dropTable('competence-scoring-configurations');
  await knex.schema.dropTable('flash-algorithm-configurations');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.createTable('certification-scoring-configurations', function (table) {
    table.integer('id').primary();
    table.jsonb('configuration').notNullable();
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.bigInteger('createdByUserId').index().references('users.id');
  });

  await knex.schema.createTable('competence-scoring-configurations', function (table) {
    table.integer('id').primary();
    table.jsonb('configuration').notNullable();
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.bigInteger('createdByUserId').references('users.id');
  });

  await knex.schema.createTable('flash-algorithm-configurations', function (table) {
    table.integer('id').primary();
    table.integer('maximumAssessmentLength').nullable();
    table.integer('challengesBetweenSameCompetence').nullable();
    table.boolean('limitToOneQuestionPerTube').nullable();
    table.boolean('enablePassageByAllCompetences').nullable();
    table.float('variationPercent').nullable();
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
  });
};

export { down, up };
