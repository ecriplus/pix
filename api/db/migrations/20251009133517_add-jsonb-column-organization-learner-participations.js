/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table('organization_learner_participations', function (table) {
    table
      .jsonb('attributes')
      .defaultTo(null)
      .comment(
        'column contains all extra informations related to the participation "type". at least the `id` of the related entity',
      );
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table('organization_learner_participations', function (table) {
    table.dropColumn('attributes');
  });
};

export { down, up };
