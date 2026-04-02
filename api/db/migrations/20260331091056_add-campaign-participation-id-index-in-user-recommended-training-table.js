/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  await knex.raw(`
    CREATE INDEX IF NOT EXISTS user_recommended_trainings_campaignparticipationid_index
    ON "user-recommended-trainings"("campaignParticipationId") WHERE "campaignParticipationId" IS NOT NULL;
`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.raw(`
    DROP INDEX IF EXISTS user_recommended_trainings_campaignparticipationid_index
`);
};

export { down, up };
