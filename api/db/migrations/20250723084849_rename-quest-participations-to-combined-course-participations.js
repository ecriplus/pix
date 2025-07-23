/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.renameTable('quest_participations', 'combined_course_participations');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.renameTable('combined_course_participations', 'quest_participations');
};

export { down, up };
