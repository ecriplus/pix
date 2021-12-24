const TABLE_NAME = 'account-recovery-demands';

exports.up = function (knex) {
  return knex.schema.table(TABLE_NAME, function (table) {
    table.dropIndex('oldEmail');
    table.dropIndex('newEmail');
    table.dropIndex('temporaryKey');
  });
};

exports.down = function (knex) {
  return knex.schema.table(TABLE_NAME, function (table) {
    table.index('oldEmail');
    table.index('newEmail');
    table.index('temporaryKey');
  });
};
