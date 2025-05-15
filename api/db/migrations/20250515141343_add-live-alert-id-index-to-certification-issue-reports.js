/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async function (knex) {
  return knex.raw(
    'CREATE INDEX "certification-issue-reports_live-alert-id_index" ON "certification-issue-reports" ("liveAlertId");',
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  return knex.raw('DROP INDEX IF EXISTS "certification-issue-reports_live-alert-id_index";');
};

export { down, up };
