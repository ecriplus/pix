const TABLE_NAME = 'legal-document-version-user-acceptances';

const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table
      .integer('legalDocumentVersionId')
      .references('id')
      .inTable('legal-document-versions')
      .notNullable()
      .comment('Accepted legal document version id');
    table
      .integer('userId')
      .references('id')
      .inTable('users')
      .notNullable()
      .comment('User who has accepted the document');
    table.dateTime('acceptedAt').notNullable().defaultTo(knex.fn.now()).comment('Document version acceptance date');
    table.unique(['userId', 'legalDocumentVersionId']);
    table.comment('Legal document versions user acceptances');
  });
};

const down = async function (knex) {
  return knex.schema.dropTable(TABLE_NAME);
};

export { down, up };
