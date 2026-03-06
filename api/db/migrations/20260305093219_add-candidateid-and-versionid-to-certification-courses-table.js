/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 *
 * 2 tables changes for this migration :
 *
 * 1/ add link from certification course to version of certification, and link
 * from certification course to candidate
 *
 * 2/ add subscription key into candidate. When candidate is created, he is
 * link to a framework. Value is extract from
 * https://github.com/1024pix/pix/blob/dev/api/src/certification/configuration/domain/models/Frameworks.js
 *
 * TODO Column `subscription` is need for CLEA usage ! Remove it when CLEA is merge with standard certification
 *
 */
const up = async function (knex) {
  await knex.schema.table('certification-courses', function (table) {
    table
      .integer('versionId')
      .references('certification_versions.id')
      .comment('Active certification version at creation time of this certification course');
    table.integer('candidateId').references('certification-candidates.id').comment('link to certification candidate');
  });
  await knex.schema.table('certification-candidates', function (table) {
    table.string('subscription').comment('Enum value of Framework that candidate is subscribe to');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async function (knex) {
  await knex.schema.table('certification-courses', function (table) {
    table.dropColumn('versionId');
    table.dropColumn('candidateId');
  });
  await knex.schema.table('certification-candidates', function (table) {
    table.dropColumn('subscription');
  });
};

export { down, up };
