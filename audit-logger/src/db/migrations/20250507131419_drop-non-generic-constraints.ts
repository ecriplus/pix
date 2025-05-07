import type { Knex } from 'knex';

const TABLE_NAME = 'audit-log';
const ACTION_COLUMN_NAME = 'action';
const ACTION_COLUMN_CONSTRAINT_NAME = 'audit-log_action_check';
const CLIENT_COLUMN_NAME = 'client';
const CLIENT_COLUMN_CONSTRAINT_NAME = 'audit-log_client_check';
const ROLE_COLUMN_NAME = 'role';
const ROLE_COLUMN_CONSTRAINT_NAME = 'audit-log_role_check';

const up = async function (knex: Knex): Promise<void> {
  // eslint-disable-next-line knex/avoid-injections -- Safe operation - the string is interpolated with a constant.
  await knex.raw(`ALTER TABLE "${TABLE_NAME}" DROP CONSTRAINT "${ACTION_COLUMN_CONSTRAINT_NAME}"`);
  // eslint-disable-next-line knex/avoid-injections -- Safe operation - the string is interpolated with a constant.
  await knex.raw(`ALTER TABLE "${TABLE_NAME}" DROP CONSTRAINT "${CLIENT_COLUMN_CONSTRAINT_NAME}"`);
  // eslint-disable-next-line knex/avoid-injections -- Safe operation - the string is interpolated with a constant.
  await knex.raw(`ALTER TABLE "${TABLE_NAME}" DROP CONSTRAINT "${ROLE_COLUMN_CONSTRAINT_NAME}"`);
};

const down = async function (knex: Knex): Promise<void> {
  // eslint-disable-next-line knex/avoid-injections -- Safe operation - the string is interpolated with a constant.
  await knex.raw(
    `ALTER TABLE "${TABLE_NAME}" ADD CONSTRAINT "${ACTION_COLUMN_CONSTRAINT_NAME}" CHECK ( "${ACTION_COLUMN_NAME}" IN ('ANONYMIZATION', 'ANONYMIZATION_GAR', 'EMAIL_CHANGED') )`,
  );
  // eslint-disable-next-line knex/avoid-injections -- Safe operation - the string is interpolated with a constant.
  await knex.raw(
    `ALTER TABLE "${TABLE_NAME}" ADD CONSTRAINT "${CLIENT_COLUMN_CONSTRAINT_NAME}" CHECK ( "${CLIENT_COLUMN_NAME}" IN ('PIX_ADMIN', 'PIX_APP') )`,
  );
  // eslint-disable-next-line knex/avoid-injections -- Safe operation - the string is interpolated with a constant.
  await knex.raw(
    `ALTER TABLE "${TABLE_NAME}" ADD CONSTRAINT "${ROLE_COLUMN_CONSTRAINT_NAME}" CHECK ( "${ROLE_COLUMN_NAME}" IN ('SUPER_ADMIN', 'SUPPORT', 'USER') )`,
  );
};

export { down, up };
