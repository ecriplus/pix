const TABLE_NAME = 'chat_messages';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.increments('id').primary();
    table.uuid('chatId').references('id').inTable('chats').index();
    table.integer('index').notNullable();
    table.string('emitter').notNullable().comment("Can be 'user' or 'assistant'");
    table.text('content').notNullable();
    this.string('attachmentName').nullable();
    this.text('attachmentContext').nullable();
    this.boolean('shouldBeForwardedToLLM').defaultTo(false);
    this.boolean('shouldBeRenderedInPreview').defaultTo(false);
    this.boolean('shouldBeCountedAsPrompt').defaultTo(false);
    this.boolean('hasAttachmentBeenSubmittedAlongWithAPrompt').defaultTo(false);
    this.boolean('haveVictoryConditionsBeenFulfilled').defaultTo(false);
    table.boolean('wasModerated').nullable().comment('if null, the message has not been processed by moderation');
    table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    table.comment('Table to store LLM chats messages.');
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
