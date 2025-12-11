/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.renameTable('supervisor-accesses', 'invigilator_accesses');
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.renameTable('invigilator_accesses', 'supervisor-accesses');
};

export { down, up };
