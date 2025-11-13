const TABLE_NAME = 'organization_learner_participations';
const CONSTRAINT_NAME = 'one_module_by_organization_learner';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table
      .unique(['organizationLearnerId', 'referenceId'], {
        indexName: CONSTRAINT_NAME,
        // Using a raw predicate because partial indexes do not support parameterized queries.
        // The value 'PASSAGE' corresponds to OrganizationLearnerParticipationTypes.PASSAGE.
        predicate: knex.whereRaw(`"type" = 'PASSAGE'`),
      })
      .comment('Add unicity constraint for organizationLearnerId, referenceId for type `PASSAGE`');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.raw(`DROP INDEX :name:;`, { name: CONSTRAINT_NAME });
};

export { down, up };
