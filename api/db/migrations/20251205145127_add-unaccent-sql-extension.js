const up = async function (knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS unaccent;');
};

const down = async function (knex) {
  await knex.raw('DROP EXTENSION IF EXISTS unaccent;');
};

export { down, up };
