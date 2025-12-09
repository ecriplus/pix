const TABLE_NAME = 'chat_messages';

const SHOULD_BE_FORWARDED_TO_LLM_COLUMN_NAME = 'shouldBeForwardedToLLM';
const SHOULD_BE_RENDERED_IN_PREVIEW_COLUMN_NAME = 'shouldBeRenderedInPreview';
const SHOULD_BE_COUNTED_AS_A_PROMPT_COLUMN_NAME = 'shouldBeCountedAsAPrompt';
const HAVE_VICTORY_CONDITIONS_BEEN_FULFILLED_COLUMN_NAME = 'haveVictoryConditionsBeenFulfilled';
const HAS_ERROR_COLUMN_NAME = 'hasErrorOccurred';
const HAS_ATTACHMENT_BEEN_SUBMITTED_ALONG_WITH_A_PROMPT_COLUMN_NAME = 'hasAttachmentBeenSubmittedAlongWithAPrompt';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.dropColumns(
      SHOULD_BE_FORWARDED_TO_LLM_COLUMN_NAME,
      SHOULD_BE_RENDERED_IN_PREVIEW_COLUMN_NAME,
      SHOULD_BE_COUNTED_AS_A_PROMPT_COLUMN_NAME,
      HAVE_VICTORY_CONDITIONS_BEEN_FULFILLED_COLUMN_NAME,
      HAS_ERROR_COLUMN_NAME,
      HAS_ATTACHMENT_BEEN_SUBMITTED_ALONG_WITH_A_PROMPT_COLUMN_NAME,
    );
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.boolean(SHOULD_BE_FORWARDED_TO_LLM_COLUMN_NAME).defaultTo(false).nullable();
    table.boolean(SHOULD_BE_RENDERED_IN_PREVIEW_COLUMN_NAME).defaultTo(false).nullable();
    table.boolean(SHOULD_BE_COUNTED_AS_A_PROMPT_COLUMN_NAME).defaultTo(false).nullable();
    table.boolean(HAVE_VICTORY_CONDITIONS_BEEN_FULFILLED_COLUMN_NAME).defaultTo(false).nullable();
    table.boolean(HAS_ERROR_COLUMN_NAME).defaultTo(false).nullable();
    table.boolean(HAS_ATTACHMENT_BEEN_SUBMITTED_ALONG_WITH_A_PROMPT_COLUMN_NAME).defaultTo(false).nullable();
  });
};

export { down, up };
