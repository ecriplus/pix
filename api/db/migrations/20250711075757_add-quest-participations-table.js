const TABLE_NAME = 'quest_participations';

const up = function (knex) {
  return knex.schema.createTable(TABLE_NAME, (t) => {
    t.increments().primary();
    t.integer('organizationLearnerId').unsigned().references('organization-learners.id').index();
    t.integer('questId').unsigned().references('quests.id').index();
    t.enum('status', ['started', 'completed']).defaultTo('started');
  });
};

const down = function (knex) {
  return knex.schema.dropTable(TABLE_NAME);
};

export { down, up };
