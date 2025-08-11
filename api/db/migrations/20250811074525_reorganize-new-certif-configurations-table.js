// Make sure you properly test your migration, especially DDL (Data Definition Language)
// ! If the target table is large, and the migration take more than 20 minutes, the deployment will fail !

// You can design and test your migration to avoid this by following this guide
// https://1024pix.atlassian.net/wiki/spaces/EDTDT/pages/3849323922/Cr+er+une+migration

// If your migrations target :
//
// `answers`
// `knowledge-elements`
// `knowledge-element-snapshots`
//
// contact @team-captains, because automatic migrations are not active on `pix-datawarehouse-production`
// this may prevent data replication to succeed the day after your migration is deployed on `pix-api-production`
const TABLE_NAME = 'certification-configurations';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.renameColumn('global-scoring-configuration', 'globalScoringConfiguration');
    table.renameColumn('competences-scoring-configuration', 'competencesScoringConfiguration');
    table
      .jsonb('challengesConfiguration')
      .comment(
        'Defines the challenges selection rules.\n' +
          'maximumAssessmentLength: Maximum number of challenges for an assessment\n' +
          'challengesBetweenSameCompetence: Number of challenges before presenting again a challenge from the same competences\n' +
          'limitToOneQuestionPerTube: Whether or not we allow multiple challenges for one tube\n' +
          'enablePassageByAllCompetences: Force to present at least one challenge from every competence\n' +
          'variationPercent: The allowed peak-to-peak amplitude in the variation of the difficulty between two challenges',
      );
  });

  const challengesConfiguration = await knex(TABLE_NAME).select(
    'id',
    'maximumAssessmentLength',
    'challengesBetweenSameCompetence',
    'limitToOneQuestionPerTube',
    'enablePassageByAllCompetences',
    'variationPercent',
  );

  for (const config of challengesConfiguration) {
    await knex(TABLE_NAME)
      .where({ id: config.id })
      .update({
        challengesConfiguration: {
          maximumAssessmentLength: config.maximumAssessmentLength,
          challengesBetweenSameCompetence: config.challengesBetweenSameCompetence,
          limitToOneQuestionPerTube: config.limitToOneQuestionPerTube,
          enablePassageByAllCompetences: config.enablePassageByAllCompetences,
          variationPercent: config.variationPercent,
        },
      });
  }

  await knex.schema.table(TABLE_NAME, function (table) {
    table.jsonb('challengesConfiguration').notNullable().alter();
    table.dropColumn('maximumAssessmentLength');
    table.dropColumn('challengesBetweenSameCompetence');
    table.dropColumn('limitToOneQuestionPerTube');
    table.dropColumn('enablePassageByAllCompetences');
    table.dropColumn('variationPercent');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
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
  });

  const challengesConfiguration = await knex(TABLE_NAME).select('id', 'challengesConfiguration');

  for (const config of challengesConfiguration) {
    await knex(TABLE_NAME).where({ id: config.id }).update({
      maximumAssessmentLength: config.challengesConfiguration.maximumAssessmentLength,
      challengesBetweenSameCompetence: config.challengesConfiguration.challengesBetweenSameCompetence,
      limitToOneQuestionPerTube: config.challengesConfiguration.limitToOneQuestionPerTube,
      enablePassageByAllCompetences: config.challengesConfiguration.enablePassageByAllCompetences,
      variationPercent: config.challengesConfiguration.variationPercent,
    });
  }

  await knex.schema.table(TABLE_NAME, function (table) {
    table.renameColumn('globalScoringConfiguration', 'global-scoring-configuration');
    table.renameColumn('competencesScoringConfiguration', 'competences-scoring-configuration');
    table.dropColumn('challengesConfiguration');
  });
};

export { down, up };
