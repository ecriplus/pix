const TABLE_NAME = 'certification-configurations';

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
        'Defines the challenges selection rules.\n' +
          'maximumAssessmentLength: Maximum number of challenges for an assessment\n' +
          'challengesBetweenSameCompetence: Number of challenges before presenting again a challenge from the same competences\n' +
          'limitToOneQuestionPerTube: Whether or not we allow multiple challenges for one tube\n' +
          'enablePassageByAllCompetences: Force to present at least one challenge from every competence\n' +
          'variationPercent: The allowed peak-to-peak amplitude in the variation of the difficulty between two challenges',
      );
  });
};

export { down, up };
