const TABLE_NAME = 'quests';

const up = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.string('code').defaultTo(null).comment('Adds code on quests to use a quest object in a course');
    table.integer('organizationId').defaultTo(null).unsigned().comment('Links a quest to an organization');
    table.foreign('organizationId').references('organizations.id');
  });
};

const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.dropColumn('code');
    table.dropColumn('organizationId');
  });
};

export { down, up };
