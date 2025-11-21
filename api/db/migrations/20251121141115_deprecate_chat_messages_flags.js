const TABLE_NAME = 'chat_messages';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.alterTable(TABLE_NAME, function (table) {
    table.boolean('shouldBeForwardedToLLM').nullable().alter();
    table.boolean('shouldBeRenderedInPreview').nullable().alter();
    table.boolean('shouldBeCountedAsAPrompt').nullable().alter();
    table.boolean('haveVictoryConditionsBeenFulfilled').nullable().alter();
    table.boolean('hasErrorOccurred').nullable().alter();
    table.boolean('hasAttachmentBeenSubmittedAlongWithAPrompt').nullable().alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function () {
  // C'est tout.
};

export { down, up };
