const TABLE_NAME = 'certification_versions';

const TABLE_TWO_NAME = 'certification-frameworks-challenges';
const TABLE_TWO_COLUMN_NAME = 'versionId';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.increments('id').primary();

    table
      .string('scope', 255)
      .notNullable()
      .comment(
        'Identifier of the certification framework. A same identifier will not have multiple version "active" at the same time.',
      );

    table
      .timestamp('startDate')
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('Inclusive. This algorithm version is applicable starting this date.');

    table
      .timestamp('expirationDate')
      .nullable()
      .comment(
        'Exclusive. When NULL, it means that the version is the current active one (latest). This algorithm version is applicable until this date.',
      );

    table
      .integer('assessmentDuration')
      .notNullable()
      .defaultTo(0)
      .comment('Duration in minutes for the certification test.');

    table
      .jsonb('globalScoringConfiguration')
      .nullable()
      .comment("Defines the mesh levels and boundaries of the assessment's global scoring");

    table
      .jsonb('competencesScoringConfiguration')
      .nullable()
      .comment("Defines the mesh levels and boundaries of the assessment's competences scoring");

    table
      .jsonb('challengesConfiguration')
      .notNullable()
      .comment(
        'Defines the challenges selection rules. This configuration is used to select the challenges to present to the candidate during an assessment.',
      );
  });

  await knex.schema.table(TABLE_TWO_NAME, function (table) {
    table
      .integer(TABLE_TWO_COLUMN_NAME)
      .nullable() // Temporary nullable for retrocompatibility during migration to the new certification versioning system
      .references('certification_versions.id')
      .comment(
        'Links challenges to their certification version. A certification version defines both the configuration and the set of applicable challenges available for that certification scope and time period.',
      );
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_TWO_NAME, function (table) {
    table.dropColumn(TABLE_TWO_COLUMN_NAME);
  });

  await knex.schema.dropTable(TABLE_NAME);
};

export { down, up };
