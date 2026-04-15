const TABLE_NAME = 'combined_course_blueprints';
const COLUMN_NAME = 'content';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.dropColumn('content');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table
      .json(COLUMN_NAME)
      .comment(
        'list of combined courses requirements to fulfill. JSON array : [{type: "evaluation", value: targetProfileId}, {type: "module", value: moduleShortId}]',
      );
  });
};

export { down, up };
