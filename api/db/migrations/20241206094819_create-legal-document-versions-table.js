const TABLE_NAME = 'legal-document-versions';

const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.increments().primary();
    table.string('type').notNullable().comment("Legal document type ('TOS', 'PDP',...)");
    table.string('service').notNullable().comment("Service related to the document ('pix-app', ...)");
    table.dateTime('versionAt').notNullable().comment('Document version date');
    table.comment('Legal document versions by services');
  });
};

const down = async function (knex) {
  return knex.schema.dropTable(TABLE_NAME);
};

export { down, up };
