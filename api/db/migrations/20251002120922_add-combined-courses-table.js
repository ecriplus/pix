const TABLE_NAME = 'combined_courses';

const up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.comment('This table contains data specific to combined courses.');
    table.increments('id').primary().notNullable();
    table
      .string('name')
      .notNullable()
      .comment('The name of the combined course, used on the landing page of the combined course');
    table.string('code').unique().notNullable().comment('The code that is necessary to access the combined course.');
    table.integer('organizationId').references('organizations.id').index().notNullable();
    table.integer('questId').references('quests.id').index().notNullable();
    table.text('description').comment('This description is used on the landing page of the combined course.');
    table.text('illustration').comment('This illustration is used on the landing page of the combined course.');
    table.dateTime('createdAt').defaultTo(knex.fn.now());
    table.dateTime('updatedAt').defaultTo(knex.fn.now());
  });
};

const down = async function (knex) {
  await knex.schema.dropTable(TABLE_NAME);
};

export { down, up };
