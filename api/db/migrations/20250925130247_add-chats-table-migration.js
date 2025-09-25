const TABLE_NAME = 'chats';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.uuid('id').primary();
    table.dateTime('startedAt').notNullable().defaultTo(knex.fn.now()).index();
    table.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now()).index();
    table.string('configId').nullable();
    table.jsonb('configContent').notNullable();
    table.integer('assessmentId').nullable();
    table.string('challengeId').nullable();
    table.integer('passageId').nullable();
    table.uuid('moduleId').nullable();
    table
      .boolean('hasAttachmentContextBeenAdded')
      .defaultTo(false)
      .notNullable()
      .comment('True if a file has been attached to prompt by user');
    table.integer('totalInputTokens').nullable().comment('Input tokens consumption updated after each message');
    table.integer('totalOutputTokens').nullable().comment('Output tokens consumption updated after each message');

    table.comment(
      'Table to store LLM chats.' +
        'Related challenge can be found by reading assessmentId and challengeId. Same for related module with passageId and moduleId.',
    );
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
