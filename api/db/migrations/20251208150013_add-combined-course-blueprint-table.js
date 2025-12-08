const TABLE_NAME = 'combined_course_blueprints';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.comment('This table contains data specific to combined courses blueprints.');
    table.increments('id').primary().notNullable();
    table.string('name').notNullable().comment('The public name of the combined course once created');
    table.string('internalName').notNullable().comment('The internal name of the combined course used in pixAdmin');
    table.text('description').comment('This description of the combined course once created');
    table
      .json('successRequirements')
      .notNullable()
      .comment(
        'list of combined courses requirements to fulfill - a JSON in the form of `[{ type: "campaignParticipations" or "passages", value: id of profile cible (for campaignParticipations) or module id (for passages))}]`',
      );
    table
      .text('illustration')
      .comment('This illustration of the combined course once created visible on the combined course home page');
    table.dateTime('createdAt').defaultTo(knex.fn.now());
    table.dateTime('updatedAt').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME);
};

export { down, up };
