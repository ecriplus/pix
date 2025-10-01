const SOURCE_TABLE = 'certification-configurations';
const TARGET_TABLE = 'certification_versions';
const FRAMEWORKS_TABLE = 'certification-frameworks-challenges';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  const pixPlusScopes = await knex(FRAMEWORKS_TABLE)
    .select('complementaryCertificationKey')
    .distinct('complementaryCertificationKey')
    .whereNotNull('complementaryCertificationKey')
    .pluck('complementaryCertificationKey');

  const currentConfig = await knex(SOURCE_TABLE)
    .select(
      'startingDate',
      'expirationDate',
      'globalScoringConfiguration',
      'competencesScoringConfiguration',
      'challengesConfiguration',
    )
    .whereNull('expirationDate')
    .first();

  for (const scope of pixPlusScopes) {
    await knex(TARGET_TABLE).insert({
      scope,
      startDate: currentConfig.startingDate,
      expirationDate: currentConfig.expirationDate,
      assessmentDuration: 0,
      globalScoringConfiguration: JSON.stringify(currentConfig.globalScoringConfiguration),
      competencesScoringConfiguration: JSON.stringify(currentConfig.competencesScoringConfiguration),
      challengesConfiguration: JSON.stringify(currentConfig.challengesConfiguration),
    });
  }

  for (const scope of pixPlusScopes) {
    const versionId = await knex(TARGET_TABLE).select('id').where('scope', scope).first();

    await knex(FRAMEWORKS_TABLE).where('complementaryCertificationKey', scope).update({
      versionId: versionId.id,
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex(FRAMEWORKS_TABLE).update({ versionId: null });
  await knex(TARGET_TABLE).del();
};

export { down, up };
