const TABLE_NAME = 'organization_learner_participations';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.comment('This table contains all kinds of participation for organization-learners.');
    table.increments('id').primary();
    table.string('type', 50).notNullable().comment('Type of participation : campaign, combined-course, passage');
    table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    table.dateTime('updatedAt').defaultTo(knex.fn.now());
    table.dateTime('completedAt');
    table.dateTime('deletedAt');
    table.integer('deletedBy').references('users.id');
    table.integer('organizationLearnerId').references('organization-learners.id').notNullable().index();
    table.string('status').notNullable().comment('Status of the participation : started, completed');
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
