import { AddUnicityConstraintKnowledgeElementSnapshots } from '../../../src/prescription/scripts/add-unicity-constraint-knwoledge-element-snapshots.js';
import { expect, knex, sinon } from '../../test-helper.js';

describe('Integration | Prescription | Scripts | add-unicity-constraint-knwoledge-element-snapshots', function () {
  let script;
  let loggerStub;
  const TABLE_NAME = 'knowledge-element-snapshots';
  const CONSTRAINT_NAME = 'one_snapshot_by_campaignParticipationId';

  before(async function () {
    script = new AddUnicityConstraintKnowledgeElementSnapshots();
    loggerStub = { info: sinon.stub(), error: sinon.stub() };
  });

  afterEach(async function () {
    const constraint = await knex.select('constraint_name').from('information_schema.table_constraints').where({
      table_name: TABLE_NAME,
      constraint_name: CONSTRAINT_NAME,
    });

    if (constraint.length > 0) {
      await knex.schema.table(TABLE_NAME, function (table) {
        table.dropUnique('campaignParticipationId', CONSTRAINT_NAME);
      });
    }
  });

  describe('Options', function () {
    it('has the correct options', function () {
      const { options } = script.metaInfo;
      expect(options.dryRun).to.deep.include({
        type: 'boolean',
        describe: 'execute script without commit',
        demandOption: false,
        default: true,
      });
    });
  });

  describe('#handle', function () {
    it('should not add unicity contraint on dryRun mode', async function () {
      await script.handle({ options: { dryRun: true }, logger: loggerStub });

      const constraint = await knex.select('constraint_name').from('information_schema.table_constraints').where({
        table_name: TABLE_NAME,
        constraint_name: CONSTRAINT_NAME,
      });

      expect(constraint).to.be.empty;
    });

    it('should add unicity contraint without dryRun mode', async function () {
      await script.handle({ options: { dryRun: false }, logger: loggerStub });

      const constraint = await knex.select('constraint_name').from('information_schema.table_constraints').where({
        table_name: TABLE_NAME,
        constraint_name: CONSTRAINT_NAME,
      });

      expect(constraint).to.be.not.empty;
    });
  });
});
