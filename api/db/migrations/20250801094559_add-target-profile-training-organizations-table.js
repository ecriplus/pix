const TABLE_NAME = 'target-profile-training-organizations';

/**
 * Une ligne dans cette table permet à une organisation de recommander un CF par l'intermédiaire d'un PC.
 * Le lien avec le profil cible est nécessaire car une organisation peut être relié au même CF pour plusieurs PC
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    const comment =
      'Table permettant de filtrer les organisations ' +
      'pour lesquelles on veut recommander un contenu formatif ' +
      'par l’intermédiaire d’un profil cible';

    table.increments('id').primary();
    table.integer('organizationId').references('organizations.id');
    table.integer('targetProfileTrainingId').references('target-profile-trainings.id');
    table.comment(comment);
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
