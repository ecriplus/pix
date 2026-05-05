import * as sinon from 'sinon';

import { MigratePgbossJobsV9toV12Script } from '../../../scripts/migrate-pgboss-jobs-v9-to-v12.js';
import { expect } from '../../test-helper.js';
import { knex } from '../../tooling/databases.js';

const v9TableName = 'pgboss.job_v9';
describe('MigratePgBossV9', function () {
  beforeEach(async function () {
    await createPgBossV9Tables();
    await knex(v9TableName).insert({ name: 'SendEmailJob', state: 'created', data: { foo: 'bar' } });
    await knex(v9TableName).insert({ name: 'SendEmailJob', state: 'created', data: { foo2: 'bar2' } });
    await knex(v9TableName).insert({ name: 'SendEmailJob', state: 'completed', data: { foo2: 'bar2' } });
    await knex(v9TableName).insert({ name: '__pgboss_maintenance', state: 'created' });
    await knex(v9TableName).insert({ name: '__migrated_OtherJob', state: 'created' });
  });
  afterEach(async function () {
    await knex(v9TableName).truncate();
  });

  context('when dryRun is true', function () {
    it('sends no jobs', async function () {
      const options = { dryRun: true, jobTableName: v9TableName };
      const logger = { info: sinon.stub(), error: sinon.stub() };
      const script = new MigratePgbossJobsV9toV12Script();

      await script.handle({ options, logger });

      await expect('SendEmailJob').to.have.been.performed.withJobsCount(0);

      const migratedJobs = await knex(v9TableName).select().where('name', '__migrated_SendEmailJob');
      await expect(migratedJobs.length).equal(0);
    });
  });

  context('when dryRun is false', function () {
    it('sends created jobs', async function () {
      const options = { dryRun: false, jobTableName: v9TableName };
      const logger = { info: sinon.stub(), error: sinon.stub() };
      const script = new MigratePgbossJobsV9toV12Script();

      await script.handle({ options, logger });

      await expect('SendEmailJob').to.have.been.performed.withJobPayloads([{ foo: 'bar' }, { foo2: 'bar2' }]);

      const migratedJobs = await knex(v9TableName).select().where('name', '__migrated_SendEmailJob');
      await expect(migratedJobs.length).equal(2);
    });
  });
});

async function createPgBossV9Tables() {
  await knex.raw(
    `
    CREATE TABLE IF NOT EXISTS pgboss.job_v9 (
        id uuid DEFAULT gen_random_uuid() NOT NULL,
        name text NOT NULL,
        priority integer DEFAULT 0 NOT NULL,
        data jsonb,
        state pgboss.job_state DEFAULT 'created'::pgboss.job_state NOT NULL,
        retrylimit integer DEFAULT 0 NOT NULL,
        retrycount integer DEFAULT 0 NOT NULL,
        retrydelay integer DEFAULT 0 NOT NULL,
        retrybackoff boolean DEFAULT false NOT NULL,
        startafter timestamp with time zone DEFAULT now() NOT NULL,
        startedon timestamp with time zone,
        singletonkey text,
        singletonon timestamp without time zone,
        expirein interval DEFAULT '00:15:00'::interval NOT NULL,
        createdon timestamp with time zone DEFAULT now() NOT NULL,
        completedon timestamp with time zone,
        keepuntil timestamp with time zone DEFAULT (now() + '14 days'::interval) NOT NULL,
        on_complete boolean DEFAULT false NOT NULL,
        output jsonb
    )
    `,
  );
}
