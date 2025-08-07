const TABLE_NAME = 'certification-configurations';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    const comment =
      'This table holds the certification flash configurations ' +
      'It drives the certification assessments challenge selections and ' +
      'how a certification assessment challenges are translated into a scoring';
    table.comment(comment);

    table.increments('id').primary().comment('Technical identifier');

    table
      .dateTime('startingDate')
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('Inclusive. This algorithm version is applicable starting this date.');

    table.dateTime('expirationDate').comment('Exclusive. This algorithm version is applicable until this date.');

    table.integer('maximumAssessmentLength').comment('Maximum number of challenges for an assessment');
    table
      .integer('challengesBetweenSameCompetence')
      .comment('Number of challenges before presenting again a challenge from the same competences');

    table.boolean('limitToOneQuestionPerTube').comment('Whether or not we allow multiple challenges for one tube');

    table
      .boolean('enablePassageByAllCompetences')
      .comment('Force to present at least one challenge from every competence');

    table
      .float('variationPercent')
      .comment('The allowed peak-to-peak amplitude in the variation of the difficulty between two challenges');

    table
      .jsonb('global-scoring-configuration')
      .nullable()
      .comment("Defines the mesh levels and boundaries of the assessment's global scoring");

    table
      .jsonb('competences-scoring-configuration')
      .nullable()
      .comment("Defines the mesh levels and boundaries of the assessment's competences scoring");
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
