const up = async function (knex) {
  await knex('campaign-participations')
    .update({ sharedAt: null })
    .where({ status: 'TO_SHARE' })
    .whereNotNull('sharedAt');
};

const down = function () {
  return;
};

export { down, up };
