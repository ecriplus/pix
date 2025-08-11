const TABLE_NAME = 'certification-configurations';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  // First step: copy the flash config for challenge selection
  const stepOneOriginalConfigs = await knex('flash-algorithm-configurations')
    .select(
      'maximumAssessmentLength',
      'challengesBetweenSameCompetence',
      'limitToOneQuestionPerTube',
      'enablePassageByAllCompetences',
      'variationPercent',
      'createdAt',
    )
    .orderBy('createdAt', 'asc'); // to insert from oldest to newest in the new table

  for (const config of stepOneOriginalConfigs) {
    await knex(TABLE_NAME).insert({
      startingDate: config.createdAt,
      maximumAssessmentLength: config.maximumAssessmentLength,
      challengesBetweenSameCompetence: config.challengesBetweenSameCompetence,
      limitToOneQuestionPerTube: config.limitToOneQuestionPerTube,
      enablePassageByAllCompetences: config.enablePassageByAllCompetences,
      variationPercent: config.variationPercent,
    });
  }

  // Second step : for every new config except the last one (the one considered active), set the expiration date
  const stepTwoNewlyCreatedConfigs = await knex(TABLE_NAME)
    .select('id', 'startingDate')
    .orderBy('startingDate', 'desc');

  while (stepTwoNewlyCreatedConfigs.length > 1) {
    const topConfig = stepTwoNewlyCreatedConfigs.shift();
    const lastCreatedAtBecomesNextConfigExpirationDate = topConfig.startingDate;
    const previousConfigId = stepTwoNewlyCreatedConfigs[0].id;

    // The N-1 config expiration date is set to the Nth createdAt
    await knex(TABLE_NAME).where({ id: previousConfigId }).update({
      expirationDate: lastCreatedAtBecomesNextConfigExpirationDate,
    });
  }

  // Third step : now for each config, identify the related config configuration
  const stepThreeConfigToPopulateWithScoring = await knex(TABLE_NAME)
    .select('id', 'startingDate')
    .orderBy('startingDate', 'asc');

  for (const currentFlashConfig of stepThreeConfigToPopulateWithScoring) {
    const startingDate = currentFlashConfig.startingDate;

    const certificationScoringConfiguration = await knex('certification-scoring-configurations')
      .select('configuration')
      .where('createdAt', '>=', startingDate)
      .orderBy('createdAt', 'asc') // taking the oldest one
      .first();

    const competenceScoringConfiguration = await knex('competence-scoring-configurations')
      .select('configuration')
      .where('createdAt', '>=', startingDate)
      .orderBy('createdAt', 'asc') // taking the oldest one
      .first();

    let newGlobalScoringConfiguration = null; // To secure migration, in case of no related scoring
    if (certificationScoringConfiguration?.configuration) {
      newGlobalScoringConfiguration = JSON.stringify(certificationScoringConfiguration.configuration);
    }

    let newCompetencesScoringConfiguration = null; // To secure migration, in case of no related scoring
    if (competenceScoringConfiguration?.configuration) {
      newCompetencesScoringConfiguration = JSON.stringify(competenceScoringConfiguration?.configuration);
    }

    await knex(TABLE_NAME).where({ id: currentFlashConfig.id }).update({
      'global-scoring-configuration': newGlobalScoringConfiguration,
      'competences-scoring-configuration': newCompetencesScoringConfiguration,
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex(TABLE_NAME).truncate();
};

export { down, up };
