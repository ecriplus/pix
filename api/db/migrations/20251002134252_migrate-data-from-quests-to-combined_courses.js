/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const up = async function (knex) {
  const dataToInsert = await knex('quests')
    .select('id AS questId', 'code', 'organizationId', 'name', 'description', 'illustration', 'createdAt', 'updatedAt')
    .whereNotNull('organizationId');

  if (dataToInsert.length === 0) return;

  return knex('combined_courses').insert(dataToInsert);
};

const down = async function () {
  // We do not want to rollback the migration because we insert data.
};

export { down, up };
